#!/usr/bin/env node
// Turns a green-screen video into a "stacked alpha" MP4 for <AlphaVideo>: premultiplied colour
// in the top half, the transparency mask in the bottom half. Plain H.264, so it plays with
// hardware decoding on iPhone and in every browser.
//
//   node scripts/make-alpha-video.mjs input.mov src/assets/owl-loop.mp4 [size=720]
//
// Needs ffmpeg on your PATH (macOS: brew install ffmpeg), or set FFMPEG=/path/to/ffmpeg.
//
// Keying works on "green excess" (g − max(r, b)), so it tolerates the background drifting in
// shade. Edge pixels have the green un-mixed and despilled, and the matte is choked by one
// pixel to drop the outermost ring where the generator blended the subject into the green.
import { spawn, spawnSync } from 'node:child_process'

const [input, output, sizeArg = '720'] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node scripts/make-alpha-video.mjs input.mov output.mp4 [size=720]')
  process.exit(1)
}
const FFMPEG = process.env.FFMPEG || 'ffmpeg'
const SIZE = Number(sizeArg)
const LO = 28 // green excess at or below this: fully opaque
const HI = 150 // green excess at or above this: fully transparent

const probe = spawnSync(FFMPEG, ['-hide_banner', '-i', input], { encoding: 'utf8' })
const fps = probe.stderr.match(/, ([\d.]+) fps/)?.[1]
if (!fps) {
  console.error(`Couldn't read the frame rate of ${input}. Is ffmpeg installed?\n${probe.stderr}`)
  process.exit(1)
}

const decoder = spawn(FFMPEG, [
  '-v',
  'error',
  '-i',
  input,
  '-vf',
  `scale=${SIZE}:${SIZE}:flags=lanczos,format=rgb24`,
  '-f',
  'rawvideo',
  '-',
])
const encoder = spawn(FFMPEG, [
  '-v',
  'error',
  '-y',
  '-f',
  'rawvideo',
  '-pix_fmt',
  'rgb24',
  '-s',
  `${SIZE}x${SIZE * 2}`,
  '-r',
  fps,
  '-i',
  '-',
  '-vf',
  'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
  '-c:v',
  'libx264',
  '-profile:v',
  'high',
  '-level',
  '4.0',
  '-preset',
  'veryslow',
  '-crf',
  '16',
  '-colorspace',
  'bt709',
  '-color_primaries',
  'bt709',
  '-color_trc',
  'bt709',
  '-color_range',
  'tv',
  '-movflags',
  '+faststart',
  '-an',
  output,
])
decoder.stderr.pipe(process.stderr)
encoder.stderr.pipe(process.stderr)

const n = SIZE * SIZE
const frameBytes = n * 3
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v)
const at = (x, y) => Math.min(SIZE - 1, Math.max(0, y)) * SIZE + Math.min(SIZE - 1, Math.max(0, x))

function key(data) {
  // This frame's background colour, from the border rows.
  let br = 0,
    bg = 0,
    bb = 0,
    count = 0
  for (let x = 0; x < SIZE; x += 4) {
    for (const y of [2, SIZE - 3]) {
      const i = (y * SIZE + x) * 3
      br += data[i]
      bg += data[i + 1]
      bb += data[i + 2]
      count++
    }
  }
  br /= count
  bg /= count
  bb /= count

  const alpha = new Float32Array(n)
  const color = new Float32Array(n * 3)
  for (let p = 0; p < n; p++) {
    const i = p * 3
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2]
    let a = 1 - (g - Math.max(r, b) - LO) / (HI - LO)
    a = a < 0 ? 0 : a > 1 ? 1 : a
    a = a * a * (3 - 2 * a)
    if (a > 0 && a < 1) {
      // Un-mix the background (C = a·F + (1−a)·B), then despill hard: edges carry green light.
      const k = 1 - a
      r = (r - k * br) / a
      g = (g - k * bg) / a
      b = (b - k * bb) / a
      g = Math.min(g, (r + b) / 2)
    } else {
      // Interior: green may not exceed the brighter of red/blue (keeps whites and oranges).
      g = Math.min(g, Math.max(r, b))
    }
    alpha[p] = a
    color[i] = r
    color[i + 1] = g
    color[i + 2] = b
  }

  // Choke the matte by one pixel (3×3 minimum), then soften it (3×3 average).
  const eroded = new Float32Array(n)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let m = 1
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) m = Math.min(m, alpha[at(x + dx, y + dy)])
      eroded[y * SIZE + x] = m
    }
  }
  const out = Buffer.alloc(frameBytes * 2)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let sum = 0
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) sum += eroded[at(x + dx, y + dy)]
      const p = y * SIZE + x,
        i = p * 3
      const a = Math.min(alpha[p], sum / 9)
      out[i] = clamp(color[i] * a)
      out[i + 1] = clamp(color[i + 1] * a)
      out[i + 2] = clamp(color[i + 2] * a)
      const m = Math.round(a * 255),
        j = frameBytes + i
      out[j] = m
      out[j + 1] = m
      out[j + 2] = m
    }
  }
  return out
}

let pending = Buffer.alloc(0)
let frames = 0
decoder.stdout.on('data', (chunk) => {
  pending = Buffer.concat([pending, chunk])
  while (pending.length >= frameBytes) {
    const frame = pending.subarray(0, frameBytes)
    pending = pending.subarray(frameBytes)
    frames++
    if (!encoder.stdin.write(key(frame))) {
      decoder.stdout.pause()
      encoder.stdin.once('drain', () => decoder.stdout.resume())
    }
  }
})
decoder.on('close', (code) => {
  if (code !== 0) process.exit(code ?? 1)
  encoder.stdin.end()
})
encoder.on('close', (code) => {
  if (code !== 0) process.exit(code ?? 1)
  console.log(`✓ ${output}: ${frames} frames at ${SIZE}×${SIZE} (${fps} fps), stacked to ${SIZE}×${SIZE * 2}`)
})

#!/usr/bin/env node
// Turns a green-screen video into the mascot's transparent animated WebP, cropped to the owl.
//
//   node scripts/make-owl-loop.mjs input.mov src/assets/owl-loop.webp [size=720]
//
// Needs ffmpeg on your PATH (macOS: brew install ffmpeg), or set FFMPEG=/path/to/ffmpeg.
//
// Keying works on "green excess" (g − max(r, b)), so it tolerates the background drifting in
// shade. Edge pixels have the green un-mixed and despilled, and the matte is choked by one
// pixel to drop the outermost ring where the generator blended the subject into the green.
//
// The video is read twice: once to find the box the owl stays inside across every frame, then
// again to key and encode just that box. The script prints where to place it in OwlMascot.tsx.
import { spawn, spawnSync } from 'node:child_process'

const [input, output, sizeArg = '720'] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node scripts/make-owl-loop.mjs input.mov output.webp [size=720]')
  process.exit(1)
}
const FFMPEG = process.env.FFMPEG || 'ffmpeg'
const SIZE = Number(sizeArg)
const LO = 28 // green excess at or below this: fully opaque
const HI = 150 // green excess at or above this: fully transparent
const QUALITY = 80 // WebP quality; 80 is indistinguishable from the source at 2x zoom
const PAD = 4 // transparent margin kept around the owl, in pixels

// Where the whole SIZE×SIZE frame sits in OwlMascot's 154×160pt box, so its first frame lands
// exactly on owl.png (owl centred at ~60% of the frame's width). Only valid for that framing.
const FRAME_PT = 224.82
const FRAME_LEFT_PT = -34.97
const FRAME_TOP_PT = -33.71

const probe = spawnSync(FFMPEG, ['-hide_banner', '-i', input], { encoding: 'utf8' })
const fps = probe.stderr.match(/, ([\d.]+) fps/)?.[1]
if (!fps) {
  console.error(`Couldn't read the frame rate of ${input}. Is ffmpeg installed?\n${probe.stderr}`)
  process.exit(1)
}

const n = SIZE * SIZE
const frameBytes = n * 3
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v)
const at = (x, y) => Math.min(SIZE - 1, Math.max(0, y)) * SIZE + Math.min(SIZE - 1, Math.max(0, x))

/** Keys one RGB frame into straight (not premultiplied) RGBA. */
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
  const out = Buffer.alloc(n * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let sum = 0
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) sum += eroded[at(x + dx, y + dy)]
      const p = y * SIZE + x,
        i = p * 3,
        o = p * 4
      const m = Math.round(Math.min(alpha[p], sum / 9) * 255)
      out[o] = m ? clamp(color[i]) : 0
      out[o + 1] = m ? clamp(color[i + 1]) : 0
      out[o + 2] = m ? clamp(color[i + 2]) : 0
      out[o + 3] = m
    }
  }
  return out
}

/**
 * Decodes the input at SIZE×SIZE and calls onFrame with each keyed RGBA frame, in order. If
 * onFrame returns a promise, decoding pauses until it settles.
 */
function eachFrame(onFrame) {
  return new Promise((resolve, reject) => {
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
    decoder.stderr.pipe(process.stderr)
    let pending = Buffer.alloc(0)
    decoder.stdout.on('data', (chunk) => {
      pending = Buffer.concat([pending, chunk])
      while (pending.length >= frameBytes) {
        const frame = pending.subarray(0, frameBytes)
        pending = pending.subarray(frameBytes)
        const wait = onFrame(key(frame))
        if (wait) {
          decoder.stdout.pause()
          wait.then(() => decoder.stdout.resume())
        }
      }
    })
    decoder.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))))
  })
}

// Pass 1: the box the owl stays inside across the whole loop.
let x0 = SIZE,
  y0 = SIZE,
  x1 = -1,
  y1 = -1
await eachFrame((rgba) => {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!rgba[(y * SIZE + x) * 4 + 3]) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
})
if (x1 < 0) {
  console.error('Every frame came out fully transparent. Is the background pure green?')
  process.exit(1)
}

// A square with a small margin, an even number of pixels wide, kept inside the frame.
let side = Math.max(x1 - x0, y1 - y0) + 1 + 2 * PAD
side = Math.min(SIZE, side + (side % 2))
const place = (lo, hi) => Math.min(SIZE - side, Math.max(0, Math.round((lo + hi + 1 - side) / 2)))
const cropX = place(x0, x1)
const cropY = place(y0, y1)

// Pass 2: key again and encode only that square.
const encoder = spawn(FFMPEG, [
  '-v',
  'error',
  '-y',
  '-f',
  'rawvideo',
  '-pix_fmt',
  'rgba',
  '-s',
  `${side}x${side}`,
  '-r',
  fps,
  '-i',
  '-',
  // Millisecond timestamps, so frame durations alternate (e.g. 42/41/42ms at 24fps) instead of
  // all rounding down and the loop running fast.
  '-enc_time_base',
  '1/1000',
  '-c:v',
  'libwebp_anim',
  '-lossless',
  '0',
  '-quality',
  String(QUALITY),
  '-compression_level',
  '4',
  '-loop',
  '0',
  '-an',
  output,
])
encoder.stderr.pipe(process.stderr)
const encoded = new Promise((resolve, reject) =>
  encoder.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)))),
)

let frames = 0
await eachFrame((rgba) => {
  const crop = Buffer.alloc(side * side * 4)
  for (let y = 0; y < side; y++) {
    const from = ((cropY + y) * SIZE + cropX) * 4
    rgba.copy(crop, y * side * 4, from, from + side * 4)
  }
  frames++
  if (!encoder.stdin.write(crop)) return new Promise((resolve) => encoder.stdin.once('drain', resolve))
})
encoder.stdin.end()
await encoded

const pt = FRAME_PT / SIZE
const fmt = (v) => Number(v.toFixed(2))
console.log(`✓ ${output}: ${frames} frames at ${side}×${side} (${fps} fps), cropped from ${SIZE}×${SIZE} at x=${cropX}, y=${cropY}`)
console.log(
  `  OwlMascot.tsx: top-[calc(${fmt(FRAME_TOP_PT + cropY * pt)}px*var(--owl,1))] ` +
    `left-[calc(${fmt(FRAME_LEFT_PT + cropX * pt)}px*var(--owl,1))] size-[calc(${fmt(side * pt)}px*var(--owl,1))]`,
)

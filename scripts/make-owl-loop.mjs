#!/usr/bin/env node
// Turns a green-screen video into a mascot's transparent animated WebP, cropped to the owl.
//
//   node scripts/make-owl-loop.mjs input.mov src/assets/owl-loop.webp                  paywall owl
//   node scripts/make-owl-loop.mjs input.mov src/assets/home/owl-sleeping-loop.webp home   Home's sleeping owl
//   (an optional last argument overrides the decode size, in pixels)
//
// Needs ffmpeg on your PATH (macOS: brew install ffmpeg), or set FFMPEG=/path/to/ffmpeg.
//
// Keying works on "green excess" (g − max(r, b)), so it tolerates the background drifting in
// shade. Edge pixels have the green un-mixed and despilled, and the matte is choked by one
// pixel to drop the outermost ring where the generator blended the subject into the green.
//
// The video is read twice: once to find the box the owl stays inside across every frame, then
// again to key and encode just that box. The script prints where to place it in the component.
import { spawn, spawnSync } from 'node:child_process'

// Where the whole square video frame sits in the component's box, so the loop's first frame lands
// exactly on the still image. Each is only valid for the framing its start frame was made with.
const PRESETS = {
  // OwlMascot's 154×160pt box; owl centred at ~60% of the frame's width. Sizes scale with --owl.
  paywall: { size: 720, framePt: 224.82, leftPt: -34.97, topPt: -33.71, file: 'paywall/components/OwlMascot.tsx', scale: '*var(--owl,1)' },
  // GaugeMascot's 73×73pt box: the owl from owl-sleeping.png at 2.4x, centred in a 1080px frame.
  home: { size: 480, framePt: 91.25, leftPt: -10.34, topPt: -1.39, file: 'home/components/GaugeMascot.tsx', scale: '' },
}

const [input, output, presetName = 'paywall', sizeArg] = process.argv.slice(2)
const preset = PRESETS[presetName]
if (!input || !output || !preset) {
  console.error('Usage: node scripts/make-owl-loop.mjs input.mov output.webp [paywall|home] [size]')
  process.exit(1)
}
const FFMPEG = process.env.FFMPEG || 'ffmpeg'
const SIZE = Number(sizeArg ?? preset.size)
const LO = 28 // green excess at or below this: fully opaque
const HI = 150 // green excess at or above this: fully transparent
const QUALITY = 80 // WebP quality; 80 is indistinguishable from the source at 2x zoom
const PAD = 4 // transparent margin kept around the owl, in pixels

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

// Pass 1: the box the owl stays inside across the whole loop, and how many frames there are.
let x0 = SIZE,
  y0 = SIZE,
  x1 = -1,
  y1 = -1,
  total = 0
await eachFrame((rgba) => {
  total++
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

// The box with a small margin, an even number of pixels each way, kept inside the frame.
const span = (lo, hi) => {
  const length = hi - lo + 1 + 2 * PAD
  return Math.min(SIZE, length + (length % 2))
}
const width = span(x0, x1)
const height = span(y0, y1)
const place = (lo, hi, length) => Math.min(SIZE - length, Math.max(0, Math.round((lo + hi + 1 - length) / 2)))
const cropX = place(x0, x1, width)
const cropY = place(y0, y1, height)

// Pass 2: key again and encode only that box. The video starts and ends on the same image, so
// its last frame repeats the first; it's left out, and the loop wraps straight back to frame one.
const encoder = spawn(FFMPEG, [
  '-v',
  'error',
  '-y',
  '-f',
  'rawvideo',
  '-pix_fmt',
  'rgba',
  '-s',
  `${width}x${height}`,
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
  if (frames === total - 1) return
  const crop = Buffer.alloc(width * height * 4)
  for (let y = 0; y < height; y++) {
    const from = ((cropY + y) * SIZE + cropX) * 4
    rgba.copy(crop, y * width * 4, from, from + width * 4)
  }
  frames++
  if (!encoder.stdin.write(crop)) return new Promise((resolve) => encoder.stdin.once('drain', resolve))
})
encoder.stdin.end()
await encoded

const pt = preset.framePt / SIZE
const css = (v) => (preset.scale ? `calc(${Number(v.toFixed(2))}px${preset.scale})` : `${Number(v.toFixed(2))}px`)
console.log(`✓ ${output}: ${frames} frames at ${width}×${height} (${fps} fps), cropped from ${SIZE}×${SIZE} at x=${cropX}, y=${cropY}`)
console.log(
  `  ${preset.file}: top-[${css(preset.topPt + cropY * pt)}] left-[${css(preset.leftPt + cropX * pt)}] ` +
    `w-[${css(width * pt)}] h-[${css(height * pt)}]`,
)

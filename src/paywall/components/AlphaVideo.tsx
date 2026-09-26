import { useEffect, useRef } from 'react'

interface AlphaVideoProps {
  /**
   * "Stacked alpha" MP4: the colour image (premultiplied by alpha) in the top half and its
   * transparency mask (white = opaque) in the bottom half. Plain H.264, so it plays with hardware decoding everywhere,
   * including iOS, which can't otherwise show transparent video in a web view.
   */
  src: string
  /** Start (or resume) playback. The first frame is drawn as soon as it's available. */
  playing: boolean
  /** Fires once the first frame is on screen. */
  onReady?: () => void
  /** Fires if the video or WebGL can't be used, so the caller can keep a still image. */
  onError?: () => void
  className?: string
}

const VERTEX = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = vec2(position.x + 1.0, 1.0 - position.y) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

// Premultiplied colour from the top half, alpha from the bottom half. The small cutoff removes
// faint compression noise around the edges.
const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
varying vec2 uv;
void main() {
  vec3 color = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(frame, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  float a = clamp((alpha - 0.04) / 0.96, 0.0, 1.0);
  gl_FragColor = vec4(min(color * (a / max(alpha, 0.001)), vec3(a)), a);
}`

/** Plays a stacked-alpha video as a transparent, looping animation on a WebGL canvas. */
export function AlphaVideo({ src, playing, onReady, onError, className = '' }: AlphaVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const callbacks = useRef({ onReady, onError })
  callbacks.current = { onReady, onError }

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) {
      callbacks.current.onError?.()
      return
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      callbacks.current.onError?.()
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let ready = false
    let stopped = false
    let frameRequest = 0

    const draw = () => {
      if (stopped || video.readyState < 2) return
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight / 2
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!ready) {
        ready = true
        callbacks.current.onReady?.()
      }
    }

    // Redraw only when the video presents a new frame (about 30 times a second).
    const hasFrameCallback = 'requestVideoFrameCallback' in video
    const loop = () => {
      draw()
      frameRequest = hasFrameCallback ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop)
    }

    const onLoaded = () => {
      draw()
      loop()
    }
    const onFail = () => callbacks.current.onError?.()
    const onLost = (event: Event) => {
      event.preventDefault()
      onFail()
    }

    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('error', onFail)
    canvas.addEventListener('webglcontextlost', onLost)
    if (video.readyState >= 2) onLoaded()

    return () => {
      stopped = true
      if (hasFrameCallback) video.cancelVideoFrameCallback(frameRequest)
      else cancelAnimationFrame(frameRequest)
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('error', onFail)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!playing) {
      video.pause()
      return
    }
    // iOS only autoplays inline video that is muted; set it on the element, not just the prop.
    video.muted = true
    video.play().catch(() => callbacks.current.onError?.())
  }, [playing, src])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className={className} />
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="pointer-events-none absolute size-px opacity-0"
      />
    </>
  )
}

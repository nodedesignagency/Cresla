// The mascot loop is an animated WebP with transparency (src/assets/owl-loop.webp). Its first frame
// is src/assets/owl.png, which is shown during the drop-in and whenever Reduce Motion is on.
//
// It's an image rather than a <video> on purpose: every time a video starts or resumes in an iOS
// web view, the system media player takes over briefly and can freeze the page (about a second
// in the Simulator, right in the middle of the intro). An animated image never touches it.
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import owlLoop from '../../assets/owl-loop.webp'
import owl from '../../assets/owl.png'
import { haloIn, owlDrop, STORY } from '../motion'

interface OwlMascotProps {
  /** Fires when the still image is ready (or failed), so the intro never starts on a blank mascot. */
  onReady?: () => void
  /** The intro is running; the loop starts once the owl has landed. */
  playing: boolean
}

export function OwlMascot({ onReady, playing }: OwlMascotProps) {
  const reduceMotion = useReducedMotion()
  const [looping, setLooping] = useState(false)
  const [loopShown, setLoopShown] = useState(false)

  // The loop is only loaded when it's needed (not preloaded): a browser may start an animated
  // image's clock as soon as it's decoded, and the loop must begin on its first frame.
  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setLooping(true), (STORY.owlLands + 0.15) * 1000)
    return () => clearTimeout(timer)
  }, [playing])

  return (
    // Sized by --owl (1 normally; smaller on short screens, set on the Paywall root).
    <div className="relative h-[calc(160px*var(--owl,1))] w-[calc(154px*var(--owl,1))] shrink-0">
      {/* Soft glow where the light lands */}
      <motion.div
        variants={haloIn}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -mt-[calc(120px*var(--owl,1))] -ml-[calc(120px*var(--owl,1))] size-[calc(240px*var(--owl,1))]"
      >
        <div className="size-full animate-halo-pulse rounded-full bg-halo" />
      </motion.div>

      <motion.div variants={owlDrop} className="relative size-full will-change-transform">
        <img
          src={owl}
          alt=""
          draggable={false}
          onLoad={onReady}
          onError={onReady}
          className={`size-full object-contain select-none ${loopShown ? 'invisible' : ''}`}
        />
        {looping && !reduceMotion && (
          // The loop starts on its first frame, which matches owl.png, and sits exactly over it
          // (a 456px crop of the 720px animation frame, at 0.3123pt per pixel). The still is hidden
          // only once the loop has loaded, so there's never a gap; if it fails, the still stays.
          <img
            src={owlLoop}
            alt=""
            draggable={false}
            onLoad={() => setLoopShown(true)}
            className="pointer-events-none absolute top-[calc(7.51px*var(--owl,1))] left-[calc(7.5px*var(--owl,1))] size-[calc(142.39px*var(--owl,1))] max-w-none select-none"
          />
        )}
      </motion.div>
    </div>
  )
}

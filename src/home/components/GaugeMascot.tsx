import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import owlLoop from '../../assets/home/owl-sleeping-loop.webp'
import owl from '../../assets/home/owl-sleeping.png'
import bubble from '../../assets/home/thought-bubble.png'
import dotLarge from '../../assets/home/thought-dot-large.png'
import dotSmall from '../../assets/home/thought-dot-small.png'
import { delay } from '../../paywall/motion'

// The thought rises from the owl's head: the small dot, the large dot, then the bubble with the
// lock, each bobbing a moment after the one before (`thought-float` in tailwind.config.ts).
const THOUGHT = [
  { src: dotSmall, place: 'top-[33.26px] left-[41.57px] h-[2.84px] w-[3.85px]' },
  { src: dotLarge, place: 'top-[30.21px] left-[43.6px] h-[4.26px] w-[5.27px]' },
  { src: bubble, place: 'top-[3.85px] left-[34.27px] h-[28.19px] w-[36.3px]' },
]
const THOUGHT_STEP = 0.2

interface GaugeMascotProps {
  /**
   * The owl breathes and snuggles into its wing, and the thought bubble floats. Turn it on once the
   * screen has settled: the loop is only loaded then.
   */
  playing: boolean
  className?: string
}

/**
 * The sleeping owl and its lock thought bubble, inside the score gauge: a 73×73pt frame that the
 * gauge positions.
 *
 * The owl is the still `owl-sleeping.png` until it plays; then `owl-sleeping-loop.webp` (a 5s
 * seamless loop, an animated WebP with transparency made by scripts/make-owl-loop.mjs) is swapped
 * in over it. The loop starts on the still's exact pose, so the swap is invisible. It's loaded only
 * when needed, never preloaded: a browser may start an animated image's clock as soon as it's
 * decoded, and the loop must begin on its first frame. With Reduce Motion everything stays still.
 */
export function GaugeMascot({ playing, className = '' }: GaugeMascotProps) {
  const reduceMotion = useReducedMotion()
  const alive = playing && !reduceMotion

  // The still is hidden only once the loop has loaded, so there's never a gap; if it fails, the
  // still stays.
  const [loopShown, setLoopShown] = useState(false)
  useEffect(() => {
    if (!alive) setLoopShown(false)
  }, [alive])

  return (
    <div className={`pointer-events-none size-[73px] select-none ${className}`}>
      <div className="relative size-full">
        {THOUGHT.map(({ src, place }, index) => (
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className={`absolute max-w-none ${place} ${alive ? 'animate-thought-float' : ''}`}
            style={delay(index * THOUGHT_STEP)}
          />
        ))}
        <img
          src={owl}
          alt=""
          draggable={false}
          className={`absolute inset-0 size-full max-w-none ${alive && loopShown ? 'invisible' : ''}`}
        />
        {alive && (
          // Where make-owl-loop.mjs (home) says the loop's box sits in this frame.
          <img
            src={owlLoop}
            alt=""
            draggable={false}
            onLoad={() => setLoopShown(true)}
            className="absolute top-[23.13px] left-[4.11px] h-[40.68px] w-[62.35px] max-w-none"
          />
        )}
      </div>
    </div>
  )
}

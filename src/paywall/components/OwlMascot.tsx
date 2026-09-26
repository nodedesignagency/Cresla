// The mascot is a looping video with transparency (src/assets/owl-loop.mp4, "stacked alpha":
// colour on top, mask below). src/assets/owl.png is its first frame: it's shown while the video
// loads, during the drop-in, and whenever video can't play or Reduce Motion is on.
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import owlLoop from '../../assets/owl-loop.mp4'
import owl from '../../assets/owl.png'
import { haloIn, owlDrop, STORY } from '../motion'
import { AlphaVideo } from './AlphaVideo'

interface OwlMascotProps {
  /** Fires when the still image is ready (or failed), so the intro never starts on a blank mascot. */
  onReady?: () => void
  /** The intro is running; the loop starts once the owl has landed. */
  playing: boolean
}

export function OwlMascot({ onReady, playing }: OwlMascotProps) {
  const reduceMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setLooping(true), (STORY.owlLands + 0.15) * 1000)
    return () => clearTimeout(timer)
  }, [playing])

  const useVideo = !reduceMotion && !videoFailed
  const showVideo = useVideo && videoReady

  return (
    <div className="relative h-[160px] w-[154px] shrink-0">
      {/* Soft glow where the light lands */}
      <motion.div
        variants={haloIn}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -mt-[120px] -ml-[120px] size-[240px]"
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
          className={`size-full object-contain select-none ${showVideo ? 'invisible' : ''}`}
        />
        {useVideo && (
          // The video frame is 1:1 with the owl centred at ~60% of its width; this places its first
          // frame exactly over owl.png (224.8px frame, owl centre at 77.4px, 78.7px in the box).
          <AlphaVideo
            src={owlLoop}
            playing={looping}
            onReady={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            className={`pointer-events-none absolute top-[-33.71px] left-[-34.97px] size-[224.82px] max-w-none ${showVideo ? '' : 'invisible'}`}
          />
        )}
      </motion.div>
    </div>
  )
}

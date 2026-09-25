// Swap the mascot by replacing src/assets/owl.png (any size, ~154:160 aspect, transparent background).
import { motion } from 'framer-motion'
import owl from '../../assets/owl.png'
import { delay, haloIn, owlDrop, STORY } from '../motion'

interface OwlMascotProps {
  /** Fires when the image is ready (or failed), so the intro never starts on a blank mascot. */
  onReady?: () => void
  /** Start the idle float (it waits until the owl has landed). */
  playing: boolean
}

export function OwlMascot({ onReady, playing }: OwlMascotProps) {
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
        <div className={`size-full ${playing ? 'animate-owl-float' : ''}`} style={delay(STORY.owlLands + 0.35)}>
          <img
            src={owl}
            alt=""
            draggable={false}
            onLoad={onReady}
            onError={onReady}
            className="size-full object-contain select-none"
          />
        </div>
      </motion.div>
    </div>
  )
}

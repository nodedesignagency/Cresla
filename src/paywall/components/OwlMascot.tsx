// Swap the mascot by replacing src/assets/owl.png (any size, ~154:160 aspect, transparent background).
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import owl from '../../assets/owl.png'
import { INTRO } from '../motion'

// Soft drop from above with a gentle spring settle. Driven by the Paywall's "show" variant.
const dropIn: Variants = {
  hidden: { opacity: 0, y: -32, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.32,
      duration: 1,
      delay: INTRO.owl,
      opacity: { duration: 0.4, delay: INTRO.owl },
    },
  },
}

// Endless float once it has landed.
const float: Variants = {
  hidden: { y: 0 },
  show: {
    y: -6,
    transition: { delay: INTRO.owl + 1, duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
  },
}

interface OwlMascotProps {
  /** Fires when the image is ready (or failed), so the intro never starts on a blank mascot. */
  onReady?: () => void
}

export function OwlMascot({ onReady }: OwlMascotProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div variants={dropIn} className="relative h-[160px] w-[154px] shrink-0">
      <motion.img
        variants={reduceMotion ? undefined : float}
        src={owl}
        alt=""
        draggable={false}
        onLoad={onReady}
        onError={onReady}
        className="size-full object-contain select-none"
      />
    </motion.div>
  )
}

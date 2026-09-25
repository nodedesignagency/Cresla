import { motion, useReducedMotion } from 'framer-motion'
import glow from '../../assets/light-glow.svg'
import rayCore from '../../assets/light-ray-core.svg'
import rayWide from '../../assets/light-ray-wide.svg'

const breathe = { ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' } as const

/** Soft beams of light falling from the top edge of the screen, over the mascot. */
export function LightRays() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-[-13px] left-1/2 z-10 h-[191px] w-[243px]"
      style={{ x: '-50%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {/* Slow pulse between the design's 50% and a dimmer 30%. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.5 }}
        animate={reduceMotion ? undefined : { opacity: 0.3 }}
        transition={{ duration: 3.2, ...breathe }}
      >
        <img src={rayWide} alt="" className="absolute top-1 left-0 h-[236px] w-[243px] max-w-none" />
        <motion.img
          src={rayCore}
          alt=""
          className="absolute top-0 left-1/2 h-[209px] w-[149px] max-w-none mix-blend-lighten"
          style={{ x: '-50%', originY: 0 }}
          animate={reduceMotion ? undefined : { scaleX: 1.08 }}
          transition={{ duration: 4.6, ...breathe }}
        />
        <img
          src={glow}
          alt=""
          className="absolute top-[-66.54px] left-[calc(50%-213.5px)] h-[128.443px] w-[430.457px] max-w-none mix-blend-plus-lighter"
        />
      </motion.div>
    </motion.div>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import cloudBack from '../../assets/cloud-1.png'
import cloudFront from '../../assets/cloud-2.png'

// Figma frame is 393pt wide with a 59pt status bar. Clouds are positioned from the
// horizontal center and follow the content when the device's top inset differs.
// Each layer drifts back and forth around its design position; the nearer layer
// travels further and faster, which reads as parallax depth.
const CLOUDS = [
  {
    src: cloudBack,
    className: 'top-[calc(var(--safe-top)-51px)] left-[calc(50%-651.5px)]',
    drift: 24,
    duration: 26,
  },
  {
    src: cloudFront,
    className: 'top-[calc(var(--safe-top)-47px)] left-[calc(50%-225.5px)]',
    drift: 44,
    duration: 19,
  },
]

export function SkyBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[calc(var(--safe-top)+245px)] bg-sky" />
      {CLOUDS.map(({ src, className, drift, duration }) => (
        <motion.img
          key={className}
          src={src}
          alt=""
          className={`absolute h-[494px] w-[889px] max-w-none will-change-transform ${className}`}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -drift / 2 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: drift / 2 }}
          transition={{
            opacity: { duration: 1, ease: 'easeOut' },
            x: { duration, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
          }}
        />
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'
import glow from '../../assets/light-glow.svg'
import rayCore from '../../assets/light-ray-core.svg'
import rayWide from '../../assets/light-ray-wide.svg'
import { raysIn } from '../motion'

// Specks of light drifting down the beam onto the mascot (px within the 243px-wide beam).
const MOTES = [
  { left: 106, top: 30, size: 3, delay: 0, duration: 4.2 },
  { left: 134, top: 16, size: 2, delay: 1.1, duration: 3.6 },
  { left: 119, top: 54, size: 2.5, delay: 2, duration: 4.6 },
  { left: 97, top: 8, size: 2, delay: 2.9, duration: 3.9 },
  { left: 144, top: 42, size: 3, delay: 0.6, duration: 4.8 },
  { left: 125, top: 2, size: 2, delay: 3.4, duration: 4 },
]

/**
 * Beams of light falling from the top edge onto the mascot. They shine down on load,
 * then sway, breathe, and carry light and specks downwards. All loops are CSS.
 */
export function LightRays() {
  return (
    <motion.div
      aria-hidden
      variants={raysIn}
      className="pointer-events-none absolute top-[-13px] left-1/2 z-10 -ml-[121.5px] h-[191px] w-[243px] origin-top will-change-transform"
    >
      <div className="absolute inset-0 origin-top animate-ray-sway">
        {/* The beams from Figma, breathing between 50% and 32% */}
        <div className="absolute inset-0 animate-ray-pulse">
          <img src={rayWide} alt="" className="absolute top-1 left-0 h-[236px] w-[243px] max-w-none" />
          <img
            src={rayCore}
            alt=""
            className="absolute top-0 left-1/2 -ml-[74.5px] h-[209px] w-[149px] max-w-none mix-blend-lighten"
          />
          <img
            src={glow}
            alt=""
            className="absolute top-[-66.54px] left-[calc(50%-213.5px)] h-[128.443px] w-[430.457px] max-w-none mix-blend-plus-lighter"
          />
        </div>

        {/* Light flowing down inside the core beam, fading out at the mascot */}
        <div className="absolute top-0 left-1/2 -ml-[74.5px] h-[209px] w-[149px] overflow-hidden [clip-path:polygon(30.77%_0,76.92%_0,100%_100%,0_100%)] [mask-image:linear-gradient(180deg,#000_15%,transparent_88%)]">
          <span className="absolute inset-x-0 top-0 h-[45%] animate-ray-stream bg-stream opacity-70" />
          <span className="absolute inset-x-0 top-0 h-[45%] animate-ray-stream bg-stream opacity-70 [animation-delay:-1.7s]" />
        </div>

        {MOTES.map((mote) => (
          <span
            key={`${mote.left}:${mote.top}`}
            className="absolute animate-mote-fall rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.9)]"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              animationDelay: `${mote.delay}s`,
              animationDuration: `${mote.duration}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

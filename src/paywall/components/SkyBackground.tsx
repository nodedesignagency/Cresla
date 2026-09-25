import { motion } from 'framer-motion'
import cloudBack from '../../assets/cloud-1.png'
import cloudFront from '../../assets/cloud-2.png'
import cloudFar from '../../assets/cloud-3.png'
import { cloudIn, delay, skyIn, STORY } from '../motion'

// Figma frame is 393pt wide with a 59pt status bar. Clouds are positioned from the
// horizontal center and follow the content when the device's top inset differs.
//
// Each cloud has four layers of motion: the intro glide (Framer, on the compositor),
// a one-off dip when the owl lands, an endless sideways drift and a slow bob (CSS).
// Nearer layers drift further and faster, which reads as parallax depth. Negative
// delays start each drift mid-swing, at its design position and full speed.
const CLOUDS = [
  {
    src: cloudFar,
    frame: 'top-[calc(var(--safe-top)-30px)] left-[calc(50%-300px)] h-[333px] w-[600px] opacity-45',
    drift: 'animate-cloud-drift-far [animation-delay:-10.5s]',
    bob: '[animation-delay:-2s]',
    from: { x: 0, delay: STORY.clouds + 0.1 },
  },
  {
    src: cloudBack,
    frame: 'top-[calc(var(--safe-top)-51px)] left-[calc(50%-651.5px)] h-[494px] w-[889px]',
    drift: 'animate-cloud-drift-back [animation-delay:-6.5s]',
    bob: '[animation-delay:-4s]',
    from: { x: -120, delay: STORY.clouds },
  },
  {
    src: cloudFront,
    frame: 'top-[calc(var(--safe-top)-47px)] left-[calc(50%-225.5px)] h-[494px] w-[889px]',
    drift: 'animate-cloud-drift-front [animation-delay:-4.5s]',
    bob: '',
    from: { x: 140, delay: STORY.clouds + 0.04 },
  },
]

export function SkyBackground({ playing }: { playing: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        variants={skyIn}
        className="absolute inset-x-0 top-0 h-[calc(var(--safe-top)+245px)] origin-top bg-sky will-change-transform"
      />
      {CLOUDS.map(({ src, frame, drift, bob, from }) => (
        <motion.div
          key={src + frame}
          variants={cloudIn}
          custom={from}
          className={`absolute ${frame} will-change-transform`}
        >
          <div className={`size-full ${playing ? 'animate-cloud-bump' : ''}`} style={delay(STORY.owlLands)}>
            <div className={`size-full ${drift}`}>
              <img src={src} alt="" className={`size-full max-w-none animate-cloud-bob ${bob}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

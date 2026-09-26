import { motion, useReducedMotion } from 'framer-motion'
import cloudBack from '../../assets/cloud-1.png'
import cloudFront from '../../assets/cloud-2.png'
import cloudFar from '../../assets/cloud-3.png'
import { cloudIn, delay, skyIn, STORY } from '../motion'

// Figma frame is 393pt wide with a 59pt status bar. Clouds are positioned from the
// horizontal center and follow the content when the device's top inset differs.
//
// Each cloud rises gently into place (Framer, on the compositor), then, once it has fully
// settled, starts an endless sideways drift and a slow bob (CSS). The drift begins at rest
// from the design position, so there is no change of speed or direction between the two.
// Nearer layers drift further and faster, which reads as parallax depth.
const CLOUDS = [
  {
    src: cloudFar,
    frame: 'top-[calc(var(--safe-top)-30px)] left-[calc(50%-300px)] h-[333px] w-[600px] opacity-45',
    drift: 'animate-cloud-drift-far',
  },
  {
    src: cloudBack,
    frame: 'top-[calc(var(--safe-top)-51px)] left-[calc(50%-651.5px)] h-[494px] w-[889px]',
    drift: 'animate-cloud-drift-back',
  },
  {
    src: cloudFront,
    frame: 'top-[calc(var(--safe-top)-47px)] left-[calc(50%-225.5px)] h-[494px] w-[889px]',
    drift: 'animate-cloud-drift-front',
  },
].map((cloud, index) => ({ ...cloud, enterAt: STORY.clouds + index * STORY.cloudStagger }))

export function SkyBackground({ playing }: { playing: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div variants={skyIn} className="absolute inset-x-0 top-0 h-[calc(var(--safe-top)+245px)] bg-sky">
        {/* Daybreak: the page color slides away downwards, so the blue spreads from the top. */}
        {!reduceMotion && (
          <div
            className={`absolute inset-x-0 top-0 h-[200%] bg-veil will-change-transform [transform:translateY(-40%)] ${playing ? 'animate-sky-veil' : ''}`}
            style={delay(STORY.sky)}
          />
        )}
      </motion.div>

      {CLOUDS.map(({ src, frame, drift, enterAt }) => (
        <motion.div
          key={src + frame}
          variants={cloudIn}
          custom={{ delay: enterAt }}
          className={`absolute ${frame} will-change-transform`}
        >
          <div className={`size-full ${playing ? drift : ''}`} style={delay(enterAt + STORY.cloudRise)}>
            <img
              src={src}
              alt=""
              className={`size-full max-w-none ${playing ? 'animate-cloud-bob' : ''}`}
              style={delay(enterAt + STORY.cloudRise)}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

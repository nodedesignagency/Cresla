import { motion } from 'framer-motion'
import { useRef } from 'react'
import logo from '../../assets/home/logo.png'
import { delay } from '../../paywall/motion'
import { HOME_STORY, logoIn, ringIn } from '../motion'

// Three faint rounded squares around the mark (Figma: 0.33pt brand-blue lines at 20% opacity).
// Drawn as inset shadows: browsers round borders under 1px up to a whole point, shadows keep the hairline.
const RINGS = ['size-[56.667px] rounded-[14.167px]', 'size-[63.333px] rounded-[15.833px]', 'size-[70px] rounded-[17.5px]']

const LONG_PRESS_MS = 600

interface HomeLogoProps {
  /** The intro is running: the glow blooms behind the mark. */
  playing: boolean
  /** Fires when the mark has loaded (or failed), so the intro never starts on a blank logo. */
  onReady?: () => void
  /** Fires after a 0.6s press on the logo (a testing shortcut, see Home). */
  onLongPress?: () => void
}

export function HomeLogo({ playing, onReady, onLongPress }: HomeLogoProps) {
  const pressTimer = useRef<number | undefined>(undefined)
  const cancelPress = () => window.clearTimeout(pressTimer.current)

  return (
    <div
      className="relative size-[70px] shrink-0"
      onPointerDown={() => {
        if (!onLongPress) return
        cancelPress()
        pressTimer.current = window.setTimeout(onLongPress, LONG_PRESS_MS)
      }}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Glow that blooms as the logo appears, then fades away */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1/2 left-1/2 -mt-[70px] -ml-[70px] size-[140px] rounded-full bg-logo-glow opacity-0 ${playing ? 'animate-logo-glow' : ''}`}
        style={delay(HOME_STORY.logo)}
      />
      {RINGS.map((ring, index) => (
        <motion.span
          key={ring}
          aria-hidden
          variants={ringIn}
          custom={HOME_STORY.rings + index * HOME_STORY.step}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-ring opacity-20 shadow-[inset_0_0_0_0.333px_currentColor] ${ring}`}
        />
      ))}
      <motion.img
        src={logo}
        alt="Cresla"
        draggable={false}
        onLoad={onReady}
        onError={onReady}
        variants={logoIn}
        className="absolute top-[8.33px] left-[8.33px] size-[53.333px] max-w-none select-none"
      />
    </div>
  )
}

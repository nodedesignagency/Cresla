import { Capacitor } from '@capacitor/core'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef } from 'react'
import logo from '../../assets/home/logo.png'
import { delay } from '../../paywall/motion'
import { glide, HOME_STORY, ringIn } from '../motion'

// Three faint rounded squares around the mark (Figma: 0.33pt brand-blue lines at 20% opacity).
// Drawn as inset shadows: browsers round borders under 1px up to a whole point, shadows keep the hairline.
const RINGS = ['size-[56.667px] rounded-[14.167px]', 'size-[63.333px] rounded-[15.833px]', 'size-[70px] rounded-[17.5px]']

const LONG_PRESS_MS = 600

interface HomeLogoProps {
  /** The intro is running: the logo shrinks into place, then the glow blooms. */
  playing: boolean
  /**
   * Open like an app launch: until the intro plays, the mark sits centred on the screen at twice
   * its size, exactly where the native launch screen showed it. Off with Reduce Motion.
   */
  splash: boolean
  /** The rings pulse (after the intro, while this screen is showing). */
  pulse: boolean
  /** Fires when the mark has loaded (or failed), so the intro never starts on a blank logo. */
  onReady?: () => void
  /** Fires after a 0.6s press on the logo (a testing shortcut, see Home). */
  onLongPress?: () => void
}

export function HomeLogo({ playing, splash, pulse, onReady, onLongPress }: HomeLogoProps) {
  const markRef = useRef<HTMLImageElement>(null)
  const pressTimer = useRef<number | undefined>(undefined)
  const cancelPress = () => window.clearTimeout(pressTimer.current)

  // The transform that puts the mark at the centre of the screen, as big as on the launch screen
  // (twice its phone size: 106.67pt), from its place in the layout.
  const splashTransform = () => {
    const mark = markRef.current
    if (!mark) return 'none'
    mark.style.transform = 'none'
    const box = mark.getBoundingClientRect()
    // The iPad tiers zoom the whole layout (offsetWidth would round the 53.33pt width, so read it exactly)
    const zoom = box.width / parseFloat(getComputedStyle(mark).width) || 1
    const dx = (window.innerWidth / 2 - (box.left + box.width / 2)) / zoom
    const dy = (window.innerHeight / 2 - (box.top + box.height / 2)) / zoom
    return `translate(${dx}px, ${dy}px) scale(${2 / zoom})`
  }

  // Before the first paint: park the mark centred and big. In the app it's visible straight away,
  // because the launch screen above it shows the same picture; in a browser it fades in.
  useLayoutEffect(() => {
    const mark = markRef.current
    if (!mark || !splash) return
    mark.style.transform = splashTransform()
    if (!Capacitor.isNativePlatform()) mark.style.opacity = '0'
  }, [])

  useEffect(() => {
    const mark = markRef.current
    if (!mark || !splash || !playing) return
    const from = splashTransform() // measured again: the font may have moved the layout a little
    if (mark.style.opacity === '0') {
      mark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'backwards' })
    }
    mark.animate([{ transform: from }, { transform: 'none' }], {
      duration: HOME_STORY.splashShrink * 1000,
      delay: HOME_STORY.splashHold * 1000,
      easing: glide,
      fill: 'backwards',
    })
    // The animations hold the start pose through their delay; the element itself is back to normal.
    mark.style.transform = ''
    mark.style.opacity = ''
  }, [playing, splash])

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
      {/* Glow that blooms as the logo lands, then fades away */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1/2 left-1/2 -mt-[70px] -ml-[70px] size-[140px] rounded-full bg-logo-glow opacity-0 ${playing ? 'animate-logo-glow' : ''}`}
        style={delay(splash ? HOME_STORY.glow : 0)}
      />
      {RINGS.map((ring, index) => (
        // Entrance on the outer element, the pulse on the ring itself.
        <motion.span
          key={ring}
          aria-hidden
          variants={ringIn}
          custom={HOME_STORY.rings + index * HOME_STORY.step}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className={`shrink-0 text-brand-ring opacity-20 shadow-[inset_0_0_0_0.333px_currentColor] ${ring} ${pulse ? 'animate-ring-pulse' : ''}`}
            style={delay(index * 0.18)}
          />
        </motion.span>
      ))}
      <img
        ref={markRef}
        src={logo}
        alt="Cresla"
        draggable={false}
        onLoad={onReady}
        onError={onReady}
        className="absolute top-[8.33px] left-[8.33px] size-[53.333px] max-w-none select-none"
      />
    </div>
  )
}

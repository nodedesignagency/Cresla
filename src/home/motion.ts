// Home motion. The entrance reuses the paywall's variants (src/paywall/motion.ts), so both screens
// share one feel; like there, only whole `transform` / `opacity` / `filter` values are animated.
import type { Variants } from 'framer-motion'
import { easeOut, easeOutExpo } from '../paywall/motion'

/** Load-in storyboard, in seconds from the moment the logo image is ready. */
export const HOME_STORY = {
  /** Top bar: menu, Chat/Support and Sign In fade in. */
  topBar: 0.15,
  /** Logo fades in as its glow blooms; the rings around it follow `step` apart. */
  logo: 0.05,
  rings: 0.2,
  headline: 0.3,
  subtitle: 0.38,
  card: 0.46,
  /** First suggestion chip; the rest follow `step` apart. */
  chips: 0.6,
  composer: 0.7,
  /** Everything has landed; the gauge shimmer starts. */
  settled: 1.5,
  step: 0.06,
} as const

/** Connecting: the gauge lights up segment by segment, then the card collapses away. */
export const CONNECT = {
  /** Delay between segments lighting up. */
  segmentStep: 0.12,
  /** From the tap until the card starts to leave (all five segments lit, plus a short hold). */
  fill: 1.2,
  /** Card and subtitle fade and sink away. */
  leave: 0.3,
  /** The logo and headline glide into the centre. */
  settle: 0.7,
} as const

/** iOS-style ease for layout moves: fast start, long soft landing. */
export const glide = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** The logo comes into focus and settles on a soft spring. */
export const logoIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', transform: 'scale(0.86)' },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    transform: 'scale(1)',
    transition: {
      opacity: { duration: 0.6, ease: easeOut, delay: HOME_STORY.logo },
      filter: { duration: 0.7, ease: easeOut, delay: HOME_STORY.logo },
      transform: { type: 'spring', duration: 0.9, bounce: 0.3, delay: HOME_STORY.logo },
    },
  },
}

/** The faint rings around the logo spread out to their places. Pass the delay with `custom`. */
export const ringIn: Variants = {
  hidden: { opacity: 0, transform: 'scale(0.82)' },
  show: (delay: number) => ({
    opacity: 0.2,
    transform: 'scale(1)',
    transition: {
      opacity: { duration: 0.6, ease: easeOut, delay },
      transform: { duration: 0.9, ease: easeOutExpo, delay },
    },
  }),
}

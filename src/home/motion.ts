// Home motion. The entrance reuses the paywall's variants (src/paywall/motion.ts), so both screens
// share one feel; like there, only whole `transform` / `opacity` / `filter` values are animated.
import type { Variants } from 'framer-motion'
import { easeOut, easeOutExpo } from '../paywall/motion'

/**
 * Load-in storyboard, in seconds from the moment the logo image is ready. It opens like an app
 * launch: the logo sits centred at twice its size (exactly where the native launch screen showed
 * it), then shrinks into its place, and the rest of the screen rises in around it.
 */
export const HOME_STORY = {
  /** How long the logo holds, big and centred, before it shrinks. */
  splashHold: 0.3,
  /** How long it takes to shrink and glide into place. */
  splashShrink: 0.85,
  /** The soft background glows fade in. */
  backdrop: 0.2,
  /** As the logo lands: its glow blooms, and the rings spread out `step` apart. */
  glow: 0.85,
  rings: 0.95,
  topBar: 1.0,
  headline: 1.0,
  subtitle: 1.08,
  card: 1.16,
  /** First suggestion chip; the rest follow `step` apart. */
  chips: 1.28,
  composer: 1.38,
  /** Everything has landed; the gauge shimmer and the ring pulse start. */
  settled: 2.2,
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

/** The faint rings around the logo spread out to their places. Pass the delay with `custom`. */
export const ringIn: Variants = {
  hidden: { opacity: 0, transform: 'scale(0.82)' },
  show: (delay: number) => ({
    opacity: 1,
    transform: 'scale(1)',
    transition: {
      opacity: { duration: 0.6, ease: easeOut, delay },
      transform: { duration: 0.9, ease: easeOutExpo, delay },
    },
  }),
}

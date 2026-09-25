import type { BezierDefinition, Transition, Variants } from 'framer-motion'

// Every intro animation below animates whole `transform`, `opacity` or `filter` values
// (never x/y/scale shorthands or layout properties). That lets Framer Motion hand them to
// the browser's compositor, so they stay smooth on iOS even while JavaScript is busy.

/** Entrances: quick start, long soft settle. */
export const easeOut: BezierDefinition = [0.22, 1, 0.36, 1]
/** Big, cinematic moves (sky, clouds, light). */
export const easeOutExpo: BezierDefinition = [0.16, 1, 0.3, 1]

/** Intro storyboard, in seconds from the moment the mascot image is ready. */
export const STORY = {
  sky: 0,
  clouds: 0.05,
  rays: 0.3,
  owl: 0.35,
  /** Owl touches down: clouds dip, halo blooms, float begins. */
  owlLands: 0.9,
  headline: 0.6,
  subline: 0.78,
  trial: 0.86,
  /** First row inside the trial card; later rows follow every `step`. */
  trialItems: 1.0,
  plans: 1.0,
  cta: 1.12,
  saveBadge: 1.35,
  footer: 1.25,
  timeline: 1.45,
  /** Everything has landed; ambient details (sparkles, CTA shine) start. */
  settled: 1.8,
  step: 0.06,
} as const

const spring = (duration: number, bounce: number, delay: number): Transition => ({
  type: 'spring',
  duration,
  bounce,
  delay,
})

/** Sky settles from slightly zoomed in, like a camera easing back. Origin: top. */
export const skyIn: Variants = {
  hidden: { opacity: 0, transform: 'scale(1.18)' },
  show: {
    opacity: 1,
    transform: 'scale(1)',
    transition: {
      opacity: { duration: 0.8, ease: easeOut, delay: STORY.sky },
      transform: { duration: 1.8, ease: easeOutExpo, delay: STORY.sky },
    },
  },
}

/** Clouds part: each glides in from off to its side while shrinking into place. */
export const cloudIn: Variants = {
  hidden: (from: { x: number; delay: number }) => ({
    opacity: 0,
    transform: `translateX(${from.x}px) scale(1.3)`,
  }),
  show: (from: { x: number; delay: number }) => ({
    opacity: 1,
    transform: 'translateX(0px) scale(1)',
    transition: {
      opacity: { duration: 0.7, ease: easeOut, delay: from.delay },
      transform: { duration: 1.9, ease: easeOutExpo, delay: from.delay },
    },
  }),
}

/** Light beams shine down from the top edge. Origin: top. */
export const raysIn: Variants = {
  hidden: { opacity: 0, transform: 'scaleY(0.15)' },
  show: {
    opacity: 1,
    transform: 'scaleY(1)',
    transition: {
      opacity: { duration: 0.5, ease: easeOut, delay: STORY.rays },
      transform: { duration: 1.2, ease: easeOutExpo, delay: STORY.rays },
    },
  },
}

/** Owl drops down through the light and lands with a soft bounce. */
export const owlDrop: Variants = {
  hidden: { opacity: 0, transform: 'translateY(-170px) scale(0.86) rotate(-8deg)' },
  show: {
    opacity: 1,
    transform: 'translateY(0px) scale(1) rotate(0deg)',
    transition: {
      opacity: { duration: 0.3, ease: easeOut, delay: STORY.owl },
      transform: spring(1.05, 0.38, STORY.owl),
    },
  },
}

/** Glow behind the owl blooms as it lands. */
export const haloIn: Variants = {
  hidden: { opacity: 0, transform: 'scale(0.4)' },
  show: {
    opacity: 1,
    transform: 'scale(1)',
    transition: { duration: 1.2, ease: easeOutExpo, delay: STORY.owlLands - 0.1 },
  },
}

/** Text comes into focus: rises out of a blur. Pass the delay with `custom`. */
export const focusIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)', transform: 'translateY(18px)' },
  show: (delay: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    transform: 'translateY(0px)',
    transition: {
      opacity: { duration: 0.6, ease: easeOut, delay },
      filter: { duration: 0.8, ease: easeOut, delay },
      transform: { duration: 1, ease: easeOutExpo, delay },
    },
  }),
}

/** Cards float up and settle on a gentle spring. Pass the delay with `custom`. */
export const cardIn: Variants = {
  hidden: { opacity: 0, transform: 'translateY(44px) scale(0.94)' },
  show: (delay: number) => ({
    opacity: 1,
    transform: 'translateY(0px) scale(1)',
    transition: {
      opacity: { duration: 0.5, ease: easeOut, delay },
      transform: spring(1, 0.24, delay),
    },
  }),
}

/** Small rise for rows inside a card. Pass the delay with `custom`. */
export const itemIn: Variants = {
  hidden: { opacity: 0, transform: 'translateY(12px)' },
  show: (delay: number) => ({
    opacity: 1,
    transform: 'translateY(0px)',
    transition: {
      opacity: { duration: 0.5, ease: easeOut, delay },
      transform: { duration: 0.8, ease: easeOutExpo, delay },
    },
  }),
}

/** Badges pop in with a bouncy spring. Pass the delay with `custom`. */
export const popIn: Variants = {
  hidden: { opacity: 0, transform: 'scale(0.4)' },
  show: (delay: number) => ({
    opacity: 1,
    transform: 'scale(1)',
    transition: {
      opacity: { duration: 0.25, ease: easeOut, delay },
      transform: spring(0.6, 0.55, delay),
    },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 0.8, ease: easeOut, delay } }),
}

/** Plan selection ring and radio. */
export const selectSpring: Transition = { type: 'spring', bounce: 0.2, duration: 0.5 }

/** Press feedback, as a whole transform so it runs on the compositor. */
export const pressSpring: Transition = { type: 'spring', bounce: 0.3, duration: 0.35 }

/** Inline style for a CSS animation that should start `seconds` after it is applied. */
export const delay = (seconds: number) => ({ animationDelay: `${seconds}s` })

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
  /** Daybreak: the sky fades up and spreads down from the top. */
  sky: 0,
  /** First cloud layer; the others follow `cloudStagger` apart. */
  clouds: 0.5,
  cloudStagger: 0.15,
  /** How long each cloud takes to rise into place (its drift starts after). */
  cloudRise: 2.2,
  rays: 0.6,
  owl: 0.75,
  /** Owl touches down: halo blooms, float begins. */
  owlLands: 1.3,
  headline: 1.0,
  subline: 1.18,
  trial: 1.25,
  /** First row inside the trial card; later rows follow every `step`. */
  trialItems: 1.4,
  plans: 1.45,
  cta: 1.57,
  saveBadge: 1.8,
  footer: 1.7,
  timeline: 1.9,
  /** Everything has landed; ambient details (sparkles, CTA shine) start. */
  settled: 2.3,
  step: 0.06,
} as const

const spring = (duration: number, bounce: number, delay: number): Transition => ({
  type: 'spring',
  duration,
  bounce,
  delay,
})

/** Daybreak: the blue slowly deepens out of the page color (paired with the CSS veil sweep). */
export const skyIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: STORY.sky } },
}

/** Clouds rise gently into place while fading in. Pass `{ delay }` with `custom`. */
export const cloudIn: Variants = {
  hidden: { opacity: 0, transform: 'translateY(36px)' },
  show: ({ delay }: { delay: number }) => ({
    opacity: 1,
    transform: 'translateY(0px)',
    transition: {
      opacity: { duration: 1.4, ease: easeOut, delay },
      transform: { duration: STORY.cloudRise, ease: easeOut, delay },
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

/** Inline style for a CSS animation that should start `seconds` after it is applied. */
export const delay = (seconds: number) => ({ animationDelay: `${seconds}s` })

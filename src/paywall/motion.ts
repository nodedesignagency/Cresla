import type { BezierDefinition, Transition, Variants } from 'framer-motion'

/** Entrances: quick start, long soft settle (easeOutQuint). */
export const easeOut: BezierDefinition = [0.22, 1, 0.36, 1]
/** Travel between two resting points. */
export const easeInOut: BezierDefinition = [0.65, 0, 0.35, 1]

/** Intro choreography, in seconds from the moment the mascot image has loaded. */
export const INTRO = {
  owl: 0.1,
  content: 0.5,
  stagger: 0.08,
  timeline: 1.35,
  /** Everything has landed; ambient details (sparkle, CTA shine) may start. */
  settled: 1.6,
} as const

/** Content fades up in order after the owl. Pass the element's position with `custom`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay: INTRO.content + order * INTRO.stagger },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut, delay: INTRO.content + 0.1 } },
}

/** Plan selection ring and radio. */
export const selectSpring: Transition = { type: 'spring', bounce: 0.2, duration: 0.5 }

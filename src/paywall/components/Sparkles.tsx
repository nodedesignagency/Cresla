import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Four-point star from the Figma "spark" component.
const STAR =
  'M0.75 9.75C7.01752 9.75 9.75 7.11306 9.75 0.75C9.75 7.11306 12.4634 9.75 18.75 9.75C12.4634 9.75 9.75 12.4634 9.75 18.75C9.75 12.4634 7.01752 9.75 0.75 9.75Z'

// Positions around the card's top-right badge (px from the card's top-right corner).
const STARS = [
  { top: -18, right: 93, size: 12, delay: 0 },
  { top: -21, right: 3, size: 9, delay: 0.16 },
  { top: 16, right: 8, size: 8, delay: 0.32 },
]

/** A few tiny stars that twinkle around the badge every few seconds while `active`. */
export function Sparkles({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {active &&
        !reduceMotion &&
        STARS.map(({ top, right, size, delay }) => (
          <motion.svg
            key={`${top}:${right}`}
            aria-hidden
            viewBox="0 0 19.5 19.5"
            width={size}
            height={size}
            className="pointer-events-none absolute text-brand"
            style={{ top, right }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90] }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 + delay, repeat: Infinity, repeatDelay: 3 }}
          >
            <path d={STAR} fill="currentColor" />
          </motion.svg>
        ))}
    </AnimatePresence>
  )
}

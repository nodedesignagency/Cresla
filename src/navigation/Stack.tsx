import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export interface StackEntry {
  key: string
  /** Increases with every screen shown, so the newest is drawn on top, even while one leaves. */
  order: number
  element: ReactNode
}

/** forward: a screen was pushed (or replaced the top one). back: the top screen was popped. */
export type StackDirection = 'forward' | 'back'

// iOS navigation: the new screen slides in from the right while the one below drifts a quarter
// of the way left and dims. Transform-only, so it runs on the compositor.
const layer: Variants = {
  enter: (direction: StackDirection) => ({
    transform: direction === 'forward' ? 'translateX(100%)' : 'translateX(-25%)',
  }),
  top: { transform: 'translateX(0%)' },
  covered: { transform: 'translateX(-25%)' },
  exit: (direction: StackDirection) => ({
    transform: direction === 'forward' ? 'translateX(-25%)' : 'translateX(100%)',
  }),
}

const slide = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

/** A stack of full screens; the last entry is the one showing. */
export function Stack({ entries, direction }: { entries: StackEntry[]; direction: StackDirection }) {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : slide

  return (
    <div className="relative h-dvh overflow-hidden bg-canvas">
      <AnimatePresence initial={false} custom={direction}>
        {entries.map((entry, index) => {
          const onTop = index === entries.length - 1
          return (
            <motion.div
              key={entry.key}
              custom={direction}
              variants={layer}
              initial="enter"
              animate={onTop ? 'top' : 'covered'}
              exit="exit"
              transition={transition}
              inert={!onTop}
              style={{ zIndex: entry.order }}
              className="absolute inset-0 overflow-hidden bg-canvas shadow-[-10px_0_30px_rgba(10,13,32,0.08)]"
            >
              {entry.element}
              {/* Dims this screen while another covers it */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black"
                initial={false}
                animate={{ opacity: onTop ? 0 : 0.08 }}
                transition={transition}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

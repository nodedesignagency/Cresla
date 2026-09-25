import { motion } from 'framer-motion'

const pop = { type: 'spring', bounce: 0.45, duration: 0.45 } as const

/** Visual radio indicator (20×20). Selection semantics live on the parent input. */
export function Radio({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden className="relative size-5 shrink-0">
      <span className="absolute inset-[10%] rounded-full bg-track" />
      <span className="absolute inset-[17.5%] rounded-full bg-white shadow-radio" />
      <motion.span
        className="absolute inset-[10%] rounded-full border-t border-brand-deep bg-brand shadow-radio-active"
        initial={false}
        animate={{ opacity: checked ? 1 : 0, transform: checked ? 'scale(1)' : 'scale(0.5)' }}
        transition={{ transform: { ...pop, bounce: 0.25 }, opacity: { duration: 0.18 } }}
      />
      <motion.span
        className="absolute inset-[30%] rounded-full border border-white bg-white shadow-radio-dot"
        initial={false}
        animate={{ opacity: checked ? 1 : 0, transform: checked ? 'scale(1)' : 'scale(0)' }}
        transition={{
          transform: { ...pop, delay: checked ? 0.06 : 0 },
          opacity: { duration: 0.15, delay: checked ? 0.06 : 0 },
        }}
      />
    </span>
  )
}

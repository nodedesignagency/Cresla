import { motion } from 'framer-motion'
import checkIcon from '../assets/connect/icon-check.svg'
import { delay, easeOut, easeOutExpo } from '../paywall/motion'
import { PrimaryButton } from '../paywall/components/PrimaryButton'
import { DemoNote, FlowScreen } from './FlowScreen'

// Begins as the screen finishes sliding in.
const AT = 0.3

const RINGS = ['size-[112px]', 'size-[128px]', 'size-[144px]']

/** Stand-in success screen after connecting: a check badge with pulsing rings, then Continue. */
export function ConnectSuccess({ onContinue }: { onContinue: () => void }) {
  return (
    <FlowScreen
      footer={
        <>
          <PrimaryButton title="Continue" size="md" onClick={onContinue} />
          <DemoNote>Demo screen. The real success screen will go here.</DemoNote>
        </>
      }
    >
      <div className="relative flex size-[144px] items-center justify-center">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut, delay: AT + 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {RINGS.map((ring, index) => (
            <span
              key={ring}
              className={`absolute rounded-full text-brand-ring opacity-20 shadow-[inset_0_0_0_0.5px_currentColor] animate-ring-pulse ${ring}`}
              style={delay(AT + 0.6 + index * 0.18)}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transform: 'scale(0.5)' }}
          animate={{ opacity: 1, transform: 'scale(1)' }}
          transition={{
            opacity: { duration: 0.3, ease: easeOut, delay: AT },
            transform: { type: 'spring', duration: 0.7, bounce: 0.45, delay: AT },
          }}
          className="flex size-24 items-center justify-center rounded-full bg-icon shadow-gloss-brand"
        >
          <motion.img
            src={checkIcon}
            alt=""
            initial={{ opacity: 0, transform: 'scale(0.4) rotate(-12deg)' }}
            animate={{ opacity: 1, transform: 'scale(1) rotate(0deg)' }}
            transition={{
              opacity: { duration: 0.25, ease: easeOut, delay: AT + 0.2 },
              transform: { type: 'spring', duration: 0.6, bounce: 0.5, delay: AT + 0.2 },
            }}
            className="size-10 max-w-none"
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, transform: 'translateY(14px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ opacity: { duration: 0.5, ease: easeOut, delay: AT + 0.25 }, transform: { duration: 0.8, ease: easeOutExpo, delay: AT + 0.25 } }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <h1 className="text-display font-medium text-ink">Credit report connected</h1>
        <p className="max-w-[300px] text-label font-normal text-muted">
          We found your reports from all 3 bureaus. Next, let’s find the errors.
        </p>
      </motion.div>
    </FlowScreen>
  )
}

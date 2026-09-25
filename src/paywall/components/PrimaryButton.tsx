import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { pressSpring } from '../motion'
import { focusRing } from '../ui'

interface PrimaryButtonProps {
  title: string
  /** Short facts shown under the title, separated by bullets. */
  details?: string[]
  onClick?: () => void
  /** Sweep a soft highlight across the button every few seconds. */
  shine?: boolean
}

export function PrimaryButton({ title, details = [], onClick, shine = false }: PrimaryButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ transform: 'scale(0.97)', opacity: 0.92 }}
      transition={pressSpring}
      className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-brand p-3 text-white shadow-cta ${focusRing}`}
    >
      {shine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine-sweep bg-shine [animation-delay:0.2s] [transform:translateX(-130%)_skewX(-20deg)]"
        />
      )}
      <span className="relative text-cta font-medium whitespace-nowrap [font-feature-settings:'calt'_0,'liga'_0]">
        {title}
      </span>
      {details.length > 0 && (
        <span className="relative -my-trim-rounded flex items-center gap-1 font-rounded text-caption whitespace-nowrap">
          {details.map((detail, i) => (
            <Fragment key={detail}>
              {i > 0 && (
                <span aria-hidden className="flex size-2 items-center justify-center">
                  <span className="size-[3.5px] rounded-full bg-current" />
                </span>
              )}
              <span>{detail}</span>
            </Fragment>
          ))}
        </span>
      )}
    </motion.button>
  )
}

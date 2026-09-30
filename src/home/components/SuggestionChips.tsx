import { motion } from 'framer-motion'
import { useRef } from 'react'
import { itemIn } from '../../paywall/motion'
import { focusRing, hitArea } from '../../paywall/ui'
import { useScrollFade } from '../useScrollFade'

export interface Suggestion {
  label: string
  /** 14×14 icon. */
  icon: string
}

interface SuggestionChipsProps {
  items: Suggestion[]
  onPick: (suggestion: Suggestion) => void
  /** Intro timing (seconds) of the first chip; the rest follow `step` apart. */
  enterAt: number
  step: number
}

/**
 * One row of chips that scrolls sideways when it doesn't fit, running under the screen edges. A
 * soft fade marks whichever side has more to scroll to.
 */
export function SuggestionChips({ items, onPick, enterAt, step }: SuggestionChipsProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const fade = useScrollFade(rowRef, 'x', { start: 28, end: 48 })

  return (
    // Vertical padding keeps the chips' 44pt tap areas and shadows inside the scrolling row.
    <div
      ref={rowRef}
      className="-mx-gutter -mt-2 -mb-3 flex gap-[5.93px] overflow-x-auto overscroll-x-contain px-gutter pt-2 pb-3 [scrollbar-width:none] after:w-[14px] after:shrink-0 after:content-[''] [&::-webkit-scrollbar]:hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {items.map((item, index) => (
        // Entrance and press live on separate elements, as on the paywall's plan cards.
        <motion.div key={item.label} variants={itemIn} custom={enterAt + index * step} className="flex shrink-0">
          <button
            type="button"
            onClick={() => onPick(item)}
            className={`${hitArea} ${focusRing} flex cursor-pointer items-center gap-[4.33px] rounded-[54px] bg-white px-3 py-[6.17px] text-chip whitespace-nowrap text-ink shadow-chip transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.96]`}
          >
            <img src={item.icon} alt="" className="size-3.5 max-w-none" />
            {item.label}
          </button>
        </motion.div>
      ))}
    </div>
  )
}

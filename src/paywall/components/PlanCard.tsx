import { motion } from 'framer-motion'
import { selectSpring } from '../motion'
import { GlossBadge } from './GlossBadge'
import { Radio } from './Radio'
import { Sparkles } from './Sparkles'

interface PlanCardProps {
  /** Radio group name shared by all plan cards. */
  name: string
  value: string
  label: string
  trial: string
  price: string
  priceNote?: string
  badge?: string
  selected: boolean
  onSelect: () => void
  /** Twinkle a few stars around the badge while this card is selected. */
  sparkle?: boolean
}

export function PlanCard({
  name,
  value,
  label,
  trial,
  price,
  priceNote,
  badge,
  selected,
  onSelect,
  sparkle = false,
}: PlanCardProps) {
  return (
    <motion.label
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.35 }}
      className="relative flex min-w-0 flex-1 cursor-pointer flex-col justify-center gap-2.5 rounded-card bg-white p-4 shadow-card outline-offset-2 outline-brand has-[:focus-visible]:outline-2"
    >
      <input type="radio" name={name} value={value} checked={selected} onChange={onSelect} className="sr-only" />

      <span className="flex items-center gap-1">
        <Radio checked={selected} />
        <span className="-my-trim-label truncate text-label font-medium text-muted">{label}</span>
      </span>

      <span aria-hidden className="-mt-px h-px w-full bg-rule-dashed bg-[length:4px_1px]" />

      <span className="flex flex-col gap-1">
        <span className="text-title text-black">{trial}</span>
        <span className="flex items-end gap-1 whitespace-nowrap text-muted">
          <span className="text-caption">{price}</span>
          {priceNote && <span className="text-nano">{priceNote}</span>}
        </span>
      </span>

      {/* Selection ring glides between cards (shared layoutId within the parent LayoutGroup). */}
      {selected && (
        <motion.span
          layoutId="plan-ring"
          aria-hidden
          className="pointer-events-none absolute inset-0 border border-brand"
          style={{ borderRadius: 18 }}
          transition={selectSpring}
        />
      )}

      {badge && (
        <GlossBadge tone="brand" className="absolute -top-[11px] right-[12.5px]">
          {badge}
        </GlossBadge>
      )}

      <Sparkles active={sparkle && selected} />
    </motion.label>
  )
}

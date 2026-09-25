import { GlossBadge } from './GlossBadge'
import { Radio } from './Radio'

interface PlanCardProps {
  label: string
  trial: string
  price: string
  priceNote?: string
  badge?: string
  selected: boolean
  onSelect?: () => void
}

export function PlanCard({ label, trial, price, priceNote, badge, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="relative flex min-w-0 flex-1 flex-col justify-center gap-2.5 rounded-card bg-white p-4 text-left shadow-card"
    >
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

      {selected && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-card border border-brand" />
      )}

      {badge && (
        <GlossBadge tone="brand" className="absolute -top-[11px] right-[12.5px]">
          {badge}
        </GlossBadge>
      )}
    </button>
  )
}

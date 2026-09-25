import type { ReactNode } from 'react'

type Tone = 'brand' | 'success'

const tones: Record<Tone, string> = {
  brand: 'bg-brand shadow-gloss-brand',
  success: 'bg-success shadow-gloss-success',
}

interface GlossBadgeProps {
  tone: Tone
  children: ReactNode
  className?: string
}

/** Small glossy pill, e.g. "No Charge Today" and "Save $450". */
export function GlossBadge({ tone, children, className = '' }: GlossBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-badge px-2 py-1 text-badge font-medium whitespace-nowrap text-white ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

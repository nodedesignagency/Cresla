import { Fragment } from 'react'
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
    // Press feedback is plain CSS (the `scale` property), composited and never left half-way.
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-brand p-3 text-white shadow-cta transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] active:opacity-90 ${focusRing}`}
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
    </button>
  )
}

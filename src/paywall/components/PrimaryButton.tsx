import { Fragment } from 'react'
import { focusRing } from '../ui'

interface PrimaryButtonProps {
  title: string
  /** Short facts shown under the title, separated by bullets. */
  details?: string[]
  onClick?: () => void
}

export function PrimaryButton({ title, details = [], onClick }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-brand p-3 text-white shadow-cta ${focusRing}`}
    >
      <span className="text-cta font-medium whitespace-nowrap [font-feature-settings:'calt'_0,'liga'_0]">{title}</span>
      {details.length > 0 && (
        <span className="-my-trim-rounded flex items-center gap-1 font-rounded text-caption whitespace-nowrap">
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

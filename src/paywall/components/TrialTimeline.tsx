import type { CSSProperties } from 'react'
import bellIcon from '../../assets/icon-bell.png'
import hourglassIcon from '../../assets/icon-hourglass.png'
import lockIcon from '../../assets/icon-lock.png'

export interface TimelineStep {
  title: string
  body: string
}

interface TrialTimelineProps {
  steps: TimelineStep[]
}

export function TrialTimeline({ steps }: TrialTimelineProps) {
  return (
    <ol className="relative flex flex-col gap-5 rounded-panel bg-canvas px-3 py-5">
      {steps.map((step) => (
        <li key={step.title} className="flex items-center gap-2">
          <span aria-hidden className="h-8 w-6 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="-my-trim-title text-title font-medium text-ink">{step.title}</p>
            <p className="-my-trim-caption text-caption text-muted">{step.body}</p>
          </div>
        </li>
      ))}
      <TimelineRail />
    </ol>
  )
}

/** Vertical progress rail: Today (lock) → Day 2 (bell) → Day 3 (hourglass). */
function TimelineRail() {
  return (
    <li
      aria-hidden
      className="absolute top-1/2 left-3 h-[154px] w-[18px] -translate-y-1/2 overflow-hidden rounded-full bg-brand/10"
    >
      <span className="absolute inset-x-0 top-0 h-[37px] rounded-full bg-brand shadow-gloss-brand">
        <span className="absolute top-[13px] left-[3px] size-3 overflow-hidden drop-shadow-icon">
          <img src={lockIcon} alt="" className="absolute top-[-22.95%] left-[-21.37%] size-[140.72%] max-w-none" />
        </span>
      </span>
      <RailDots count={4} top={42} />

      <span className="absolute inset-x-0 top-[59px] h-[37px]">
        <MaskIcon src={bellIcon} className="bg-brand" />
      </span>
      <RailDots count={5} top={89} />

      <span className="absolute inset-x-0 bottom-0 h-[37px]">
        <MaskIcon
          src={hourglassIcon}
          className="bg-icon"
          style={{ backgroundSize: '47px 38px', backgroundPosition: '-10px -6px' }}
        />
      </span>
    </li>
  )
}

function RailDots({ count, top }: { count: number; top: number }) {
  return (
    <span className="absolute left-2 flex flex-col gap-1.5" style={{ top }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="size-0.5 rounded-full bg-brand/40" />
      ))}
    </span>
  )
}

/** 12×12 icon drawn from an alpha mask so its fill can be a color or gradient. */
function MaskIcon({ src, className, style }: { src: string; className: string; style?: CSSProperties }) {
  const mask = `url(${src}) center / 12px 12px no-repeat`
  return (
    <span
      className={`absolute top-[13px] left-[3px] size-3 ${className}`}
      style={{ WebkitMask: mask, mask, ...style }}
    />
  )
}

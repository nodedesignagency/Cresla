import { useAnimate, useReducedMotion } from 'framer-motion'
import { useEffect, type CSSProperties } from 'react'
import bellIcon from '../../assets/icon-bell.png'
import hourglassIcon from '../../assets/icon-hourglass.png'
import lockIcon from '../../assets/icon-lock.png'
import { easeInOut, INTRO } from '../motion'

export interface TimelineStep {
  title: string
  body: string
}

interface TrialTimelineProps {
  steps: TimelineStep[]
  /** Start the progress fill (it waits INTRO.timeline seconds, then runs once). */
  play?: boolean
}

export function TrialTimeline({ steps, play = true }: TrialTimelineProps) {
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
      <TimelineRail play={play} />
    </ol>
  )
}

// Rail geometry from Figma (px): a 154-tall track with three 37-tall nodes at 0, 59 and 117.
const RAIL_HEIGHT = 154
const NODE_HEIGHT = 37
const NODE_TOPS = [0, 59, 117] as const
const DAY_2_END = NODE_TOPS[1] + NODE_HEIGHT

/**
 * Vertical progress rail: Today (lock) → Day 2 (bell) → Day 3 (hourglass).
 *
 * The blue fill holds white copies of the dots and icons, so as it grows it
 * "lights up" each icon exactly when it reaches it.
 */
function TimelineRail({ play }: { play: boolean }) {
  const [scope, animate] = useAnimate<HTMLLIElement>()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!play) return
    if (reduceMotion) {
      animate('[data-rail-fill]', { height: RAIL_HEIGHT }, { duration: 0 })
      return
    }
    const pop = { scale: [0.6, 1.2, 1] }
    const controls = animate([
      ['[data-rail-fill]', { height: DAY_2_END }, { duration: 0.8, ease: easeInOut, at: INTRO.timeline }],
      ['[data-rail-icon="bell"]', pop, { duration: 0.5, at: '-0.3' }],
      ['[data-rail-fill]', { height: RAIL_HEIGHT }, { duration: 0.8, ease: easeInOut, at: '+0.2' }],
      ['[data-rail-icon="hourglass"]', pop, { duration: 0.5, at: '-0.3' }],
    ])
    return () => controls.stop()
  }, [play, reduceMotion, animate])

  return (
    <li
      ref={scope}
      aria-hidden
      className="absolute top-1/2 left-3 h-[154px] w-[18px] -translate-y-1/2 overflow-hidden rounded-full bg-brand/10"
    >
      {/* Unlit track */}
      <RailDots count={4} top={42} className="bg-brand/40" />
      <MaskIcon src={bellIcon} top={NODE_TOPS[1]} className="bg-brand" />
      <RailDots count={5} top={89} className="bg-brand/40" />
      <MaskIcon
        src={hourglassIcon}
        top={NODE_TOPS[2]}
        className="bg-icon"
        style={{ backgroundSize: '47px 38px', backgroundPosition: '-10px -6px' }}
      />

      {/* Lit fill: starts as the "Today" node and grows to Day 3 */}
      <span
        data-rail-fill
        className="absolute inset-x-0 top-0 overflow-hidden rounded-full bg-brand shadow-gloss-brand"
        style={{ height: NODE_HEIGHT }}
      >
        <span className="absolute top-[13px] left-[3px] size-3 overflow-hidden drop-shadow-icon">
          <img src={lockIcon} alt="" className="absolute top-[-22.95%] left-[-21.37%] size-[140.72%] max-w-none" />
        </span>
        <RailDots count={4} top={42} className="bg-white/60" />
        <MaskIcon src={bellIcon} top={NODE_TOPS[1]} className="bg-white" name="bell" />
        <RailDots count={5} top={89} className="bg-white/60" />
        <MaskIcon src={hourglassIcon} top={NODE_TOPS[2]} className="bg-white" name="hourglass" />
      </span>
    </li>
  )
}

function RailDots({ count, top, className }: { count: number; top: number; className: string }) {
  return (
    <span className="absolute left-2 flex flex-col gap-1.5" style={{ top }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`size-0.5 rounded-full ${className}`} />
      ))}
    </span>
  )
}

interface MaskIconProps {
  src: string
  /** Top of the 37px node the icon is centred in. */
  top: number
  className: string
  style?: CSSProperties
  name?: string
}

/** 12×12 icon drawn from an alpha mask so its fill can be a color or gradient. */
function MaskIcon({ src, top, className, style, name }: MaskIconProps) {
  const mask = `url(${src}) center / 12px 12px no-repeat`
  return (
    <span
      data-rail-icon={name}
      className={`absolute left-[3px] size-3 ${className}`}
      style={{ top: top + 13, WebkitMask: mask, mask, ...style }}
    />
  )
}

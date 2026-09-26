import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import bellIcon from '../../assets/icon-bell.png'
import hourglassIcon from '../../assets/icon-hourglass.png'
import lockIcon from '../../assets/icon-lock.png'
import { delay, itemIn, STORY } from '../motion'

export interface TimelineStep {
  title: string
  body: string
}

interface TrialTimelineProps {
  steps: TimelineStep[]
  /** Run the progress fill (it starts at STORY.timeline). */
  playing?: boolean
}

// Seconds after the fill starts at which its leading edge reaches each point. Derived from
// the `rail-fill` keyframes (rest 1.8s on Today, glide 1.6s to Day 2, rest 1.8s, glide 1.6s
// to Day 3, each glide cubic-bezier(0.65, 0, 0.35, 1)) and the rail geometry (edge from
// 37px to 96px, then to 154px).
const REACH = { row2: 2.61, bell: 2.72, row3: 5.96, hourglass: 6.12, end: 6.8 }
const ROW_REACH = [0, REACH.row2, REACH.row3]

export function TrialTimeline({ steps, playing = true }: TrialTimelineProps) {
  const reduceMotion = useReducedMotion()

  // Later days sit dimmed until the fill reaches them.
  const rowLight = (index: number) => {
    if (index === 0 || reduceMotion) return {}
    if (!playing) return { className: 'opacity-40' }
    return { className: 'animate-row-lit', style: delay(STORY.timeline + ROW_REACH[index]) }
  }

  return (
    <ol className="relative flex flex-col gap-5 rounded-panel bg-canvas px-3 py-5">
      {steps.map((step, index) => {
        const light = rowLight(index)
        return (
          <motion.li
            key={step.title}
            variants={itemIn}
            custom={STORY.trialItems + index * STORY.step}
            className="flex items-center gap-2"
          >
            <span aria-hidden className="h-8 w-6 shrink-0" />
            <div className={`flex min-w-0 flex-1 flex-col gap-3 ${light.className ?? ''}`} style={light.style}>
              <p className="-my-trim-title text-title font-medium text-ink">{step.title}</p>
              <p className="-my-trim-caption text-caption text-muted">{step.body}</p>
            </div>
          </motion.li>
        )
      })}
      <TimelineRail playing={playing} />
    </ol>
  )
}

/**
 * Vertical progress rail: Today (lock) → Day 2 (bell) → Day 3 (hourglass).
 *
 * The lit capsule is a full-height layer that slides down from above while its contents
 * slide up by the same amount, so the white icons and dots stay in place and are uncovered
 * exactly as the leading edge passes them. Both are transform-only CSS animations, which
 * iOS runs on the compositor: no layout, no JavaScript per frame.
 */
function TimelineRail({ playing }: { playing: boolean }) {
  const reduceMotion = useReducedMotion()
  const animate = playing && !reduceMotion
  const at = (seconds: number) => delay(STORY.timeline + seconds)

  return (
    <li
      aria-hidden
      className="absolute top-1/2 left-3 h-[154px] w-[18px] -translate-y-1/2 overflow-hidden rounded-full bg-brand/10"
    >
      {/* Unlit track */}
      <RailDots count={4} top={42} className="bg-brand/40" />
      <MaskIcon src={bellIcon} top={59} className="bg-brand" />
      <RailDots count={5} top={89} className="bg-brand/40" />
      <MaskIcon
        src={hourglassIcon}
        top={117}
        className="bg-icon"
        style={{ backgroundSize: '47px 38px', backgroundPosition: '-10px -6px' }}
      />

      {/* Lit capsule: starts as the "Today" node and grows to Day 3 */}
      <span
        className={`absolute inset-x-0 top-0 h-[154px] overflow-hidden rounded-full bg-brand shadow-gloss-brand will-change-transform ${animate ? 'animate-rail-fill' : ''}`}
        style={{ transform: reduceMotion ? 'none' : 'translateY(-117px)', ...at(0) }}
      >
        <span
          className={`absolute inset-0 will-change-transform ${animate ? 'animate-rail-counter' : ''}`}
          style={{ transform: reduceMotion ? 'none' : 'translateY(117px)', ...at(0) }}
        >
          <span className="absolute top-[13px] left-[3px] size-3 overflow-hidden drop-shadow-icon">
            <img src={lockIcon} alt="" className="absolute top-[-22.95%] left-[-21.37%] size-[140.72%] max-w-none" />
          </span>
          <RailDots count={4} top={42} className="bg-white/60" />
          <MaskIcon
            src={bellIcon}
            top={59}
            className={`bg-white ${animate ? 'animate-icon-pop' : ''}`}
            style={at(REACH.bell - 0.08)}
          />
          <RailDots count={5} top={89} className="bg-white/60" />
          <MaskIcon
            src={hourglassIcon}
            top={117}
            className={`bg-white ${animate ? 'animate-icon-pop' : ''}`}
            style={at(REACH.hourglass - 0.08)}
          />
        </span>

        {/* Once full, a glint of light runs down the capsule */}
        {animate && (
          <span
            className="absolute inset-x-0 top-0 h-12 animate-rail-glint bg-stream opacity-80"
            style={at(REACH.end - 0.05)}
          />
        )}
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
}

/** 12×12 icon drawn from an alpha mask so its fill can be a color or gradient. */
function MaskIcon({ src, top, className, style }: MaskIconProps) {
  const mask = `url(${src}) center / 12px 12px no-repeat`
  return (
    <span
      className={`absolute left-[3px] size-3 ${className}`}
      style={{ top: top + 13, WebkitMask: mask, mask, ...style }}
    />
  )
}

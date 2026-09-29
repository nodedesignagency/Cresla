import type { CSSProperties, ReactNode } from 'react'
import segment1 from '../../assets/home/gauge-1.svg'
import segment2 from '../../assets/home/gauge-2.svg'
import segment3 from '../../assets/home/gauge-3.svg'
import segment4 from '../../assets/home/gauge-4.svg'
import segment5 from '../../assets/home/gauge-5.svg'
import { delay } from '../../paywall/motion'
import { CONNECT } from '../motion'

// The five segments are one shape with different gradients, each drawn in a 184.475pt square that
// is turned about its centre. Every square's centre sits on the gauge's pivot (92.70, 93.24), so
// the turns lay the segments out along the arc, palest on the left.
const SEGMENTS = [
  { src: segment1, angle: -7.91 },
  { src: segment2, angle: 30.24 },
  { src: segment3, angle: 68.4 },
  { src: segment4, angle: 106.55 },
  { src: segment5, angle: 144.7 },
]

// Overlays take the segment's exact shape by using its SVG as a mask.
const segmentMask: CSSProperties = {
  maskImage: `url("${segment1}")`,
  WebkitMaskImage: `url("${segment1}")`,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
}

interface ScoreGaugeProps {
  /** Soft light runs across the segments (while the report is locked). */
  shimmer: boolean
  /** Light every segment in turn (on connect). */
  filled: boolean
  /** The mascot, positioned inside the gauge's 185×101pt frame. */
  children?: ReactNode
}

export function ScoreGauge({ shimmer, filled, children }: ScoreGaugeProps) {
  return (
    <div aria-hidden className="relative h-[101px] w-[185.4px] shrink-0">
      {SEGMENTS.map(({ src, angle }, index) => (
        <div
          key={src}
          className="pointer-events-none absolute top-[1.01px] left-[0.46px] size-[184.475px]"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="absolute top-[36.29px] left-[0.72px] h-[51.125px] w-[31.95px]">
            <img src={src} alt="" draggable={false} className="block size-full max-w-none" />
            {shimmer && (
              <span
                className="absolute inset-0 animate-gauge-shimmer bg-white opacity-0"
                style={{ ...segmentMask, ...delay(index * 0.22) }}
              />
            )}
            <span
              className={`absolute inset-0 bg-gauge-fill opacity-0 ${filled ? 'animate-gauge-fill' : ''}`}
              style={{ ...segmentMask, ...delay(index * CONNECT.segmentStep) }}
            />
          </div>
        </div>
      ))}
      {children}
    </div>
  )
}

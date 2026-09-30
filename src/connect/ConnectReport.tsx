import { useEffect, useRef, useState } from 'react'
import { GaugeMascot } from '../home/components/GaugeMascot'
import { Reassurance } from '../home/components/ConnectCard'
import { ScoreGauge } from '../home/components/ScoreGauge'
import { CONNECT } from '../home/motion'
import { PrimaryButton } from '../paywall/components/PrimaryButton'
import { DemoNote, FlowScreen } from './FlowScreen'

/** How long the demo "connection" takes: every gauge segment lights up, then a short hold. */
const DEMO_CONNECT_SECONDS = 4 * CONNECT.segmentStep + 0.5 + 0.4

/** The owl starts moving once the page has slid in (0.5s, see navigation/Stack.tsx). */
const MASCOT_AT = 0.55

interface ConnectReportProps {
  onBack: () => void
  /** The (demo) connection has finished. */
  onConnected: () => void
}

/**
 * Stand-in for the real connect flow (bureau sign-in and identity check). Tapping the button
 * lights the gauge up segment by segment, then reports success.
 */
export function ConnectReport({ onBack, onConnected }: ConnectReportProps) {
  const [connecting, setConnecting] = useState(false)
  const done = useRef(onConnected)
  done.current = onConnected

  const [mascotPlaying, setMascotPlaying] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMascotPlaying(true), MASCOT_AT * 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!connecting) return
    const timer = setTimeout(() => done.current(), DEMO_CONNECT_SECONDS * 1000)
    return () => clearTimeout(timer)
  }, [connecting])

  return (
    <FlowScreen
      onBack={connecting ? undefined : onBack}
      footer={
        <>
          <PrimaryButton
            title={connecting ? 'Connecting…' : 'Connect securely'}
            size="md"
            onClick={() => setConnecting(true)}
            disabled={connecting}
          />
          <Reassurance />
          <DemoNote>Demo screen. The real bureau connection will go here.</DemoNote>
        </>
      }
    >
      {/* The gauge, bigger than on Home: zoom re-renders it at the larger size, so it stays sharp */}
      <div className="[zoom:1.55] tiny:[zoom:1.3]">
        <ScoreGauge shimmer={!connecting} filled={connecting} tone="page">
          <GaugeMascot playing={mascotPlaying} className="absolute top-[36.06px] left-[50.68px]" />
        </ScoreGauge>
      </div>
      {/* "credit report" and "to unlock" never split across lines */}
      <h1 className="mt-8 text-display font-medium text-ink tiny:mt-5 narrow:text-[24px] narrow:leading-[29px]">
        Connect your credit&nbsp;report <span className="whitespace-nowrap">to unlock</span>
      </h1>
      <p className="mt-3 max-w-[300px] text-label font-normal text-muted">
        We’ll securely pull your reports from all 3 bureaus and check every line for errors.
      </p>
    </FlowScreen>
  )
}

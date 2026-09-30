import shieldIcon from '../../assets/home/icon-shield.svg'
import { PrimaryButton } from '../../paywall/components/PrimaryButton'
import { GaugeMascot } from './GaugeMascot'
import { ScoreGauge } from './ScoreGauge'

interface ConnectCardProps {
  onConnect: () => void
  /** Light runs across the locked gauge. */
  shimmer: boolean
  /** The report has just been connected: the gauge fills and the button stops responding. */
  filling: boolean
}

/** First-time card: locked score gauge with the sleeping owl, and the Connect button. */
export function ConnectCard({ onConnect, shimmer, filling }: ConnectCardProps) {
  return (
    <div className="flex min-h-[256px] flex-col items-center justify-center gap-3 rounded-card bg-white p-4 shadow-card tiny:min-h-0 tiny:gap-2 tiny:p-3">
      <ScoreGauge shimmer={shimmer} filled={filling}>
        <GaugeMascot className="absolute top-[36.06px] left-[50.68px]" />
      </ScoreGauge>

      <div className="flex w-full flex-col items-center gap-1 text-center">
        <h2 className="text-title font-medium text-ink">See your score and every error</h2>
        <p className="text-caption text-muted">Connect once, we check all 3 bureaus</p>
      </div>

      <div className="flex w-full flex-col items-center gap-2.5">
        <PrimaryButton title="Connect credit report" size="md" onClick={onConnect} disabled={filling} />
        <Reassurance />
      </div>
    </div>
  )
}

/** "Won't affect your score • About 2 minutes", under the Connect buttons. */
export function Reassurance() {
  return (
    <p className="flex flex-wrap items-start justify-center gap-1 text-caption whitespace-nowrap text-muted">
      <img src={shieldIcon} alt="" className="h-[8.02px] w-2 max-w-none" />
      <span className="-my-trim-caption">Won’t affect your score</span>
      <span aria-hidden className="flex h-[9px] w-2 items-center justify-center">
        <span className="size-[3.5px] rounded-full bg-current" />
      </span>
      <span className="-my-trim-caption">About 2 minutes</span>
    </p>
  )
}

import type { CSSProperties } from 'react'
import goldFoil from '../assets/gold-foil.jpg'
import bureausIcon from '../assets/icon-bureaus.svg'
import lettersIcon from '../assets/icon-letters.svg'
import supportIcon from '../assets/icon-support.svg'
import { GlossBadge } from './components/GlossBadge'
import { LightRays } from './components/LightRays'
import { OwlMascot } from './components/OwlMascot'
import { PerkDivider, PerkItem } from './components/PerkItem'
import { PlanCard } from './components/PlanCard'
import { PrimaryButton } from './components/PrimaryButton'
import { SkyBackground } from './components/SkyBackground'
import { TrialTimeline, type TimelineStep } from './components/TrialTimeline'
import { PLAN_ORDER, PLANS, type PlanId } from './plans'

const TIMELINE: TimelineStep[] = [
  {
    title: 'Today: Everything unlocked, $0',
    body: 'Unlimited dispute letters, watermark-free PDFs, unlimited credit profiles & priority support.',
  },
  { title: 'Day 2: We remind you', body: 'Cancel anytime before & you won’t be charged' },
  { title: 'Day 3: Trial ends', body: 'Cancel anytime before & you won’t be charged' },
]

// Safe-area insets. A host can override them (e.g. to preview a notch in a desktop
// browser) by setting --paywall-safe-top / --paywall-safe-bottom on an ancestor.
const rootStyle = {
  '--safe-top': 'var(--paywall-safe-top, env(safe-area-inset-top, 0px))',
  '--safe-bottom': 'var(--paywall-safe-bottom, env(safe-area-inset-bottom, 0px))',
} as CSSProperties

const goldFoilText: CSSProperties = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${goldFoil})`,
  backgroundSize: 'auto, cover',
  backgroundPosition: 'left top, center',
  backgroundRepeat: 'repeat, no-repeat',
}

export function Paywall() {
  const selectedPlan: PlanId = 'annual'
  const plan = PLANS[selectedPlan]

  return (
    <div
      style={rootStyle}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-canvas font-sans text-black select-none"
    >
      <SkyBackground />
      <LightRays />

      <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-gutter pt-[calc(var(--safe-top)+1px)] pb-[max(calc(var(--safe-bottom)-20px),14px)]">
        <button
          type="button"
          className="absolute top-[calc(var(--safe-top)+13px)] right-gutter z-20 rounded-full bg-white/70 px-2.5 py-1.5 text-button font-medium"
        >
          Sign In
        </button>

        <header className="flex flex-col items-center gap-0.5">
          <OwlMascot />
          <div className="flex w-full flex-col items-center gap-[18px]">
            <h1 className="-my-trim-display flex flex-col items-center text-center text-display font-medium">
              <span className="whitespace-nowrap">Dispute letters that</span>
              <span className="whitespace-nowrap">
                get results. <span className="bg-headline bg-clip-text text-transparent">Free for 3 days.</span>
              </span>
            </h1>
            <div className="flex items-center justify-center gap-1">
              <p className="-my-trim-label text-label whitespace-nowrap">Everything unlocked.</p>
              <GlossBadge tone="success">No Charge Today</GlossBadge>
            </div>
          </div>
        </header>

        <section aria-labelledby="trial-heading" className="mt-2.5 flex flex-col gap-1 rounded-card bg-white p-1 shadow-card">
          <h2 id="trial-heading" className="flex justify-center py-2">
            <span className="-my-trim-label bg-clip-text text-label font-medium text-transparent" style={goldFoilText}>
              HOW YOUR FREE TRIAL WORKS
            </span>
          </h2>
          <TrialTimeline steps={TIMELINE} />
          <ul className="flex items-center justify-between">
            <PerkItem icon={bureausIcon} label="All 3 Bureaus" />
            <PerkDivider />
            <PerkItem icon={lettersIcon} label="Unlimited letters" />
            <PerkDivider />
            <PerkItem icon={supportIcon} label="Priority Support" />
          </ul>
        </section>

        {/* Absorbs extra height so the purchase block stays anchored to the bottom. */}
        <div className="min-h-[17px] flex-1" />

        <div role="radiogroup" aria-label="Choose a plan" className="flex gap-2">
          {PLAN_ORDER.map((id) => (
            <PlanCard key={id} {...PLANS[id]} selected={id === selectedPlan} />
          ))}
        </div>

        <div className="mt-2">
          <PrimaryButton title="Start My FREE 3-Day Trial" details={['No charge today', plan.ctaPrice]} />
        </div>

        <footer className="mt-3 flex flex-col items-center gap-3 text-caption text-muted">
          <p className="-my-trim-caption flex items-center gap-2 whitespace-nowrap">
            <span>Cancel anytime</span>
            <FooterDot />
            <span>Auto-renews until canceled</span>
          </p>
          <nav className="-my-trim-caption flex items-center gap-2 whitespace-nowrap">
            <FooterLink>Terms of use</FooterLink>
            <FooterDot />
            <FooterLink>Privacy Policy</FooterLink>
            <FooterDot />
            <FooterLink>Restore</FooterLink>
          </nav>
        </footer>
      </div>
    </div>
  )
}

function FooterDot() {
  return <span aria-hidden className="size-0.5 shrink-0 rounded-full bg-muted" />
}

function FooterLink({ children }: { children: string }) {
  return (
    <button type="button" className="underline decoration-from-font [text-underline-position:from-font]">
      {children}
    </button>
  )
}

import { LayoutGroup, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useState, type CSSProperties } from 'react'
import bureausIcon from '../assets/icon-bureaus.svg'
import lettersIcon from '../assets/icon-letters.svg'
import supportIcon from '../assets/icon-support.svg'
import { GlossBadge } from './components/GlossBadge'
import { GoldText } from './components/GoldText'
import { LightRays } from './components/LightRays'
import { OwlMascot } from './components/OwlMascot'
import { PerkDivider, PerkItem } from './components/PerkItem'
import { PlanCard } from './components/PlanCard'
import { PrimaryButton } from './components/PrimaryButton'
import { SkyBackground } from './components/SkyBackground'
import { TrialTimeline, type TimelineStep } from './components/TrialTimeline'
import { cardIn, delay, fadeIn, focusIn, itemIn, popIn, STORY } from './motion'
import { PLAN_ORDER, PLANS, type Plan, type PlanId } from './plans'
import { focusRing, hitArea } from './ui'

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

export interface PaywallProps {
  /** Called when the CTA is tapped with the currently selected plan. */
  onSubscribe: (plan: Plan) => void
  onSignIn?: () => void
  onRestore?: () => void
  onOpenTerms?: () => void
  onOpenPrivacy?: () => void
  /** Plan selected when the paywall opens. */
  defaultPlan?: PlanId
}

export function Paywall({
  onSubscribe,
  onSignIn,
  onRestore,
  onOpenTerms,
  onOpenPrivacy,
  defaultPlan = 'annual',
}: PaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(defaultPlan)
  const plan = PLANS[selectedPlan]
  const planGroupId = useId()
  const reduceMotion = useReducedMotion()

  // The intro starts once the mascot image is ready (so it never pops in mid-drop), or
  // after 1.2s regardless. Ambient details wait until everything has landed.
  const [introStarted, setIntroStarted] = useState(false)
  const [introSettled, setIntroSettled] = useState(false)
  useEffect(() => {
    const fallback = setTimeout(() => setIntroStarted(true), 1200)
    return () => clearTimeout(fallback)
  }, [])
  useEffect(() => {
    if (!introStarted) return
    const timer = setTimeout(() => setIntroSettled(true), STORY.settled * 1000)
    return () => clearTimeout(timer)
  }, [introStarted])

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        style={rootStyle}
        // With Reduce Motion on, everything simply appears in place and no loops run.
        initial={reduceMotion ? false : 'hidden'}
        animate={introStarted || reduceMotion ? 'show' : 'hidden'}
        className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-canvas font-sans text-black select-none motion-reduce:**:animate-none!"
      >
        <SkyBackground playing={introStarted} />
        <LightRays />

        <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-gutter pt-[calc(var(--safe-top)+1px)] pb-[max(calc(var(--safe-bottom)-20px),14px)]">
          <motion.div
            variants={fadeIn}
            custom={STORY.subline}
            className="absolute top-[calc(var(--safe-top)+13px)] right-gutter z-20"
          >
            <button
              type="button"
              onClick={onSignIn}
              className={`${hitArea} ${focusRing} cursor-pointer rounded-full bg-white/70 px-2.5 py-1.5 text-button font-medium transition-opacity active:opacity-60`}
            >
              Sign In
            </button>
          </motion.div>

          <header className="flex flex-col items-center gap-0.5">
            <OwlMascot onReady={() => setIntroStarted(true)} playing={introStarted} />
            <div className="flex w-full flex-col items-center gap-[18px]">
              <h1 className="-my-trim-display flex flex-col items-center text-center text-display font-medium">
                <motion.span variants={focusIn} custom={STORY.headline} className="whitespace-nowrap">
                  Dispute letters that
                </motion.span>
                <motion.span variants={focusIn} custom={STORY.headline + 0.1} className="whitespace-nowrap">
                  get results.{' '}
                  <span
                    className={`bg-headline-glint bg-[length:250%_100%,100%_100%] bg-[position:160%_0,0_0] bg-no-repeat bg-clip-text text-transparent ${introStarted ? 'animate-text-glint' : ''}`}
                    style={delay(STORY.settled - 0.2)}
                  >
                    Free for 3 days.
                  </span>
                </motion.span>
              </h1>
              <div className="flex items-center justify-center gap-1">
                <motion.p
                  variants={focusIn}
                  custom={STORY.subline}
                  className="-my-trim-label text-label whitespace-nowrap"
                >
                  Everything unlocked.
                </motion.p>
                <motion.span variants={popIn} custom={STORY.subline + 0.15}>
                  <GlossBadge tone="success">No Charge Today</GlossBadge>
                </motion.span>
              </div>
            </div>
          </header>

          <motion.section
            variants={cardIn}
            custom={STORY.trial}
            aria-labelledby="trial-heading"
            className="mt-2.5 flex flex-col gap-1 rounded-card bg-white p-1 shadow-card"
          >
            <motion.h2
              variants={itemIn}
              custom={STORY.trialItems - STORY.step}
              id="trial-heading"
              className="flex justify-center py-2"
            >
              <GoldText className="-my-trim-label text-label font-medium">HOW YOUR FREE TRIAL WORKS</GoldText>
            </motion.h2>
            <TrialTimeline steps={TIMELINE} playing={introStarted} />
            <motion.ul
              variants={itemIn}
              custom={STORY.trialItems + 3 * STORY.step}
              className="flex items-center justify-between"
            >
              <PerkItem icon={bureausIcon} label="All 3 Bureaus" />
              <PerkDivider />
              <PerkItem icon={lettersIcon} label="Unlimited letters" />
              <PerkDivider />
              <PerkItem icon={supportIcon} label="Priority Support" />
            </motion.ul>
          </motion.section>

          {/* Absorbs extra height so the purchase block stays anchored to the bottom. */}
          <div className="min-h-[17px] flex-1" />

          <LayoutGroup id={planGroupId}>
            <div role="radiogroup" aria-label="Choose a plan" className="flex gap-2">
              {PLAN_ORDER.map((id, index) => {
                const option = PLANS[id]
                return (
                  <PlanCard
                    key={id}
                    name="paywall-plan"
                    value={id}
                    label={option.label}
                    trial={option.trial}
                    price={option.price}
                    priceNote={option.priceNote}
                    badge={option.badge}
                    selected={id === selectedPlan}
                    onSelect={() => setSelectedPlan(id)}
                    sparkle={id === 'annual' && introSettled}
                    enterAt={STORY.plans + index * STORY.step}
                    badgeAt={STORY.saveBadge}
                  />
                )
              })}
            </div>
          </LayoutGroup>

          <motion.div variants={cardIn} custom={STORY.cta} className="mt-2">
            <PrimaryButton
              title="Start My FREE 3-Day Trial"
              details={['No charge today', plan.ctaPrice]}
              onClick={() => onSubscribe(plan)}
              shine={introSettled}
            />
          </motion.div>

          <motion.footer
            variants={fadeIn}
            custom={STORY.footer}
            className="mt-3 flex flex-col items-center gap-3 text-caption text-muted"
          >
            <p className="-my-trim-caption flex items-center gap-2 whitespace-nowrap">
              <span>Cancel anytime</span>
              <FooterDot />
              <span>Auto-renews until canceled</span>
            </p>
            <nav className="-my-trim-caption flex items-center gap-2 whitespace-nowrap">
              <FooterLink onClick={onOpenTerms}>Terms of use</FooterLink>
              <FooterDot />
              <FooterLink onClick={onOpenPrivacy}>Privacy Policy</FooterLink>
              <FooterDot />
              <FooterLink onClick={onRestore}>Restore</FooterLink>
            </nav>
          </motion.footer>
        </div>
      </motion.div>
    </MotionConfig>
  )
}

function FooterDot() {
  return <span aria-hidden className="size-0.5 shrink-0 rounded-full bg-muted" />
}

// Links sit 18px apart, so each tap area is 44pt tall and reaches halfway into the gaps.
function FooterLink({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer underline decoration-from-font transition-opacity [text-underline-position:from-font] after:absolute after:top-1/2 after:left-1/2 after:h-11 after:w-[max(calc(100%+16px),44px)] after:-translate-x-1/2 after:-translate-y-1/2 active:opacity-60 ${focusRing}`}
    >
      {children}
    </button>
  )
}

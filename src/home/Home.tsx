import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import avatar from '../assets/home/avatar.png'
import helpIcon from '../assets/home/icon-help.svg'
import menuIcon from '../assets/home/icon-menu.svg'
import sparkleIcon from '../assets/home/icon-sparkle.svg'
import { hideLaunchScreen } from '../launch'
import { cardIn, fadeIn, itemIn } from '../paywall/motion'
import { focusRing, hitArea } from '../paywall/ui'
import { Composer } from './components/Composer'
import { ConnectCard } from './components/ConnectCard'
import { HomeLogo } from './components/HomeLogo'
import { ModeToggle, type HomeMode } from './components/ModeToggle'
import { SuggestionChips, type Suggestion } from './components/SuggestionChips'
import { CONNECT, glide, HOME_STORY } from './motion'
import { useScrollFade } from './useScrollFade'

export const SUGGESTIONS: Suggestion[] = [
  { label: 'How Does Cresla Work?', icon: helpIcon },
  { label: 'How Can Cresla Help?', icon: sparkleIcon },
]

/** Body text under "How can I help?": first time (with the Connect card), and once connected. */
export const SUBTITLE = {
  firstTime: "Let's start with your credit report.",
  returning: 'Ask about your report, disputes or next steps.',
}

// Safe-area insets. A host can override them (e.g. to preview a notch in a desktop browser) by
// setting --home-safe-top / --home-safe-bottom on an ancestor.
const rootStyle = {
  '--safe-top': 'var(--home-safe-top, env(safe-area-inset-top, 0px))',
  '--safe-bottom': 'var(--home-safe-bottom, env(safe-area-inset-bottom, 0px))',
} as CSSProperties

export interface HomeProps {
  /**
   * false: first-time state, with the Connect credit report card. true: returning state, just the
   * logo, headline and body text. Turning it on while Home is showing plays the connect animation;
   * while another screen covers Home (see `active`) it switches instantly.
   */
  hasConnectedReport: boolean
  /** Home is the screen on top. When covered, its loops pause and state changes don't animate. */
  active?: boolean
  /** Connect credit report was tapped. */
  onConnect: () => void
  /** Top right: Sign In before the report is connected, the profile picture after. */
  onSignIn?: () => void
  onProfile?: () => void
  onMenu?: () => void
  onModeChange?: (mode: HomeMode) => void
  /** Composer buttons: + , microphone, voice mode. */
  onAttach?: () => void
  onDictate?: () => void
  onVoice?: () => void
  /** The send arrow (shown in place of voice mode while there's text) was tapped. */
  onSend?: (text: string) => void
  /** Testing shortcut: fires when the logo is held for 0.6s. */
  onLogoLongPress?: () => void
}

export function Home({
  hasConnectedReport,
  active = true,
  onConnect,
  onSignIn,
  onProfile,
  onMenu,
  onModeChange,
  onAttach,
  onDictate,
  onVoice,
  onSend,
  onLogoLongPress,
}: HomeProps) {
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<HomeMode>('chat')
  const [draft, setDraft] = useState('')
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const mainFade = useScrollFade(mainRef, 'y', { start: 20, end: 32 })

  // The load-in starts once the logo image and the font are ready (so nothing pops in or shifts),
  // or after 0.6s regardless. At that moment the logo is drawn big and centred, just like the
  // native launch screen, so that can be hidden without a visible change.
  const [logoReady, setLogoReady] = useState(false)
  const [introStarted, setIntroStarted] = useState(false)
  const [introSettled, setIntroSettled] = useState(false)
  useEffect(() => {
    const fallback = setTimeout(() => setIntroStarted(true), 600)
    return () => clearTimeout(fallback)
  }, [])
  useEffect(() => {
    if (logoReady) document.fonts.ready.then(() => setIntroStarted(true))
  }, [logoReady])
  useEffect(() => {
    if (introStarted) hideLaunchScreen()
  }, [introStarted])
  useEffect(() => {
    if (!introStarted) return
    const timer = setTimeout(() => setIntroSettled(true), HOME_STORY.settled * 1000)
    return () => clearTimeout(timer)
  }, [introStarted])

  // First-time ↔ returning. The card stays mounted through the connect animation, then leaves the
  // layout; the body text changes with it.
  const [cardMounted, setCardMounted] = useState(!hasConnectedReport)
  const [filling, setFilling] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flipFrom = useRef<number | null>(null)
  const entering = useRef(false)
  const connecting = useRef(false)

  /**
   * Adds or removes the card. When animated, remembers where the logo and headline were so they
   * can glide to their new place.
   */
  const relayout = (mounted: boolean, animate: boolean) => {
    flipFrom.current = animate ? (heroRef.current?.getBoundingClientRect().top ?? null) : null
    entering.current = mounted
    setCardMounted(mounted)
  }
  const stopConnecting = () => {
    connecting.current = false
    setFilling(false)
    for (const element of [cardRef.current, subtitleRef.current]) {
      element?.getAnimations().forEach((animation) => animation.cancel())
    }
  }

  useEffect(() => {
    const timers: number[] = []
    const after = (seconds: number, run: () => void) => timers.push(window.setTimeout(run, seconds * 1000))
    const animate = active && !reduceMotion

    if (hasConnectedReport && cardMounted) {
      if (!animate) {
        stopConnecting()
        relayout(false, false)
        return
      }
      // Connected: light the gauge segment by segment, then the card and body text sink away.
      connecting.current = true
      setFilling(true)
      after(CONNECT.fill, () => {
        for (const element of [cardRef.current, subtitleRef.current]) {
          element?.animate(
            [
              { opacity: 1, transform: 'none' },
              { opacity: 0, transform: 'translateY(10px) scale(0.96)' },
            ],
            { duration: CONNECT.leave * 1000, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
          )
        }
        after(CONNECT.leave, () => {
          connecting.current = false
          setFilling(false)
          relayout(false, true)
        })
      })
    } else if (!hasConnectedReport && cardMounted && connecting.current) {
      // Switched back in the middle of the connect animation: undo it.
      stopConnecting()
    } else if (!hasConnectedReport && !cardMounted) {
      relayout(true, animate)
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [hasConnectedReport, cardMounted, reduceMotion, active])

  // After an animated change, the logo and headline re-centre: they glide from where they were
  // (a transform animation, so it runs on the compositor). The new body text fades in, and a
  // returning card rises in.
  useLayoutEffect(() => {
    const from = flipFrom.current
    flipFrom.current = null
    const hero = heroRef.current
    if (from === null || !hero) return
    const offset = from - hero.getBoundingClientRect().top
    if (Math.abs(offset) > 0.5) {
      hero.animate([{ transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' }], {
        duration: CONNECT.settle * 1000,
        easing: glide,
      })
    }
    // Replace the text's fade-out (it held at 0) with the fade-in, before anything is painted.
    subtitleRef.current?.getAnimations().forEach((animation) => animation.cancel())
    subtitleRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay: 200,
      easing: 'ease-out',
      fill: 'backwards',
    })
    if (entering.current) {
      cardRef.current?.animate(
        [
          { opacity: 0, transform: 'translateY(16px) scale(0.97)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 500, delay: 150, easing: glide, fill: 'backwards' },
      )
    }
  }, [cardMounted])

  const pickSuggestion = (suggestion: Suggestion) => {
    setDraft(suggestion.label)
    const field = fieldRef.current
    if (!field) return
    field.focus()
    requestAnimationFrame(() => field.setSelectionRange(field.value.length, field.value.length))
  }

  // Elements mounted after the intro (the card coming back) skip their entrance variants.
  const lateInitial = introSettled ? false : undefined

  return (
    <motion.div
      style={rootStyle}
      // With Reduce Motion on, everything simply appears in place and nothing loops.
      initial={reduceMotion ? false : 'hidden'}
      animate={introStarted || reduceMotion ? 'show' : 'hidden'}
      // Screen-size tiers (see src/index.css): tighter spacing on short phones, and on tall iPads
      // the whole layout is zoomed up so it fills the screen like on a phone.
      className={`relative isolate flex h-dvh flex-col overflow-clip bg-canvas font-sans text-ink select-none motion-reduce:**:animate-none! ${active ? '' : '**:[animation-play-state:paused]'} tablet-wide:h-[calc(100dvh/1.15)] tablet-wide:[zoom:1.15] tablet:h-[calc(100dvh/1.3)] tablet:[zoom:1.3] tablet-lg:h-[calc(100dvh/1.45)] tablet-lg:[zoom:1.45]`}
      // iOS only applies :active (the press feedback) when a touch listener is present.
      onTouchStart={() => {}}
    >
      {/* Soft brand-blue glows in two corners, fading in once the logo has taken over */}
      <motion.div
        aria-hidden
        variants={fadeIn}
        custom={HOME_STORY.backdrop}
        className="pointer-events-none absolute inset-0 bg-home-glow"
      />
      <div className="relative mx-auto flex min-h-0 w-full max-w-[430px] flex-1 flex-col px-gutter pt-[calc(var(--safe-top)+21px)] pb-[max(calc(var(--safe-bottom)-14px),20px)]">
        <motion.header
          variants={fadeIn}
          custom={HOME_STORY.topBar}
          className="relative z-10 flex h-[41px] shrink-0 items-center justify-between"
        >
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenu}
            className={`${hitArea} ${focusRing} flex size-10 cursor-pointer items-center justify-center rounded-[41px] bg-white/70 transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.92]`}
          >
            <img src={menuIcon} alt="" className="h-[11.5px] w-[17.5px] max-w-none" />
          </button>
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <ModeToggle
              value={mode}
              onChange={(next) => {
                setMode(next)
                onModeChange?.(next)
              }}
            />
          </div>
          {/* Sign In turns into the profile picture once the report is connected (same 41pt height) */}
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={hasConnectedReport ? 'profile' : 'sign-in'}
              initial={{ opacity: 0, transform: 'scale(0.6)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0.6)' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { opacity: { duration: 0.2 }, transform: { type: 'spring', duration: 0.45, bounce: 0.3 } }
              }
              className="origin-right"
            >
              {hasConnectedReport ? (
                <button
                  type="button"
                  aria-label="Profile"
                  onClick={onProfile}
                  className={`${hitArea} ${focusRing} flex size-[41px] cursor-pointer rounded-full transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.92]`}
                >
                  <img src={avatar} alt="" draggable={false} className="size-full max-w-none rounded-full" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSignIn}
                  className={`${hitArea} ${focusRing} flex h-[41px] cursor-pointer items-center rounded-[41px] bg-white/70 px-3 text-button font-medium text-black transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.95]`}
                >
                  Sign In
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.header>

        {/* Logo, headline and (first time) the card, centred between the top bar and the chips.
            If a screen is too short (Display Zoom on an iPhone SE), this part scrolls, with a
            soft fade at the edge that has more; my-auto keeps its top reachable. */}
        <main
          ref={mainRef}
          className="-mx-gutter flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: mainFade, WebkitMaskImage: mainFade }}
        >
          {/* A little more room on top lines the block up exactly with the design at 393×852 */}
          <div className="my-auto flex flex-col pt-[25px] pb-5 tiny:pt-3.5 tiny:pb-3">
            <div ref={heroRef} className="flex flex-col items-center gap-4 tiny:gap-3">
              <HomeLogo
                playing={introStarted && !reduceMotion}
                splash={!reduceMotion}
                rings={reduceMotion ? 'static' : 'pulse'}
                onReady={() => setLogoReady(true)}
                onLongPress={onLogoLongPress}
              />
              <div className="flex w-full flex-col items-center gap-5 text-center tiny:gap-3.5">
                <motion.h1
                  variants={itemIn}
                  custom={HOME_STORY.headline}
                  className="-my-trim-display text-display font-medium text-ink"
                >
                  How can I help?
                </motion.h1>
                <div ref={subtitleRef}>
                  <motion.p
                    variants={itemIn}
                    custom={HOME_STORY.subtitle}
                    className="-my-trim-label text-label font-normal text-ink"
                  >
                    {cardMounted ? SUBTITLE.firstTime : SUBTITLE.returning}
                  </motion.p>
                </div>
              </div>
            </div>
            {cardMounted && (
              <div ref={cardRef} className="mt-5 tiny:mt-3.5">
                <motion.div variants={cardIn} custom={HOME_STORY.card} initial={lateInitial}>
                  <ConnectCard
                    onConnect={onConnect}
                    shimmer={introSettled && !filling && !reduceMotion}
                    filling={filling}
                    playing={introSettled}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </main>

        <div className="flex shrink-0 flex-col gap-2.5">
          <SuggestionChips
            items={SUGGESTIONS}
            onPick={pickSuggestion}
            enterAt={HOME_STORY.chips}
            step={HOME_STORY.step}
          />
          <motion.div variants={cardIn} custom={HOME_STORY.composer}>
            <Composer
              value={draft}
              onChange={setDraft}
              fieldRef={fieldRef}
              onAttach={onAttach}
              onDictate={onDictate}
              onVoice={onVoice}
              onSend={() => {
                onSend?.(draft.trim())
                setDraft('')
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

import type { CSSProperties, ReactNode } from 'react'
import backIcon from '../assets/connect/icon-back.svg'
import { focusRing, hitArea } from '../paywall/ui'

// Same safe-area handling as Home (the dev harness sets --home-safe-* in a desktop browser).
const rootStyle = {
  '--safe-top': 'var(--home-safe-top, env(safe-area-inset-top, 0px))',
  '--safe-bottom': 'var(--home-safe-bottom, env(safe-area-inset-bottom, 0px))',
} as CSSProperties

interface FlowScreenProps {
  /** Shows the back button in the top bar. */
  onBack?: () => void
  /** Centred content. */
  children: ReactNode
  /** Pinned to the bottom: the main button and small print. */
  footer: ReactNode
}

/** Page frame for the connect flow: Home's background, top bar and margins. */
export function FlowScreen({ onBack, children, footer }: FlowScreenProps) {
  return (
    <div
      style={rootStyle}
      className="relative isolate flex h-dvh flex-col overflow-clip bg-canvas font-sans text-ink select-none tablet-wide:h-[calc(100dvh/1.15)] tablet-wide:[zoom:1.15] tablet:h-[calc(100dvh/1.3)] tablet:[zoom:1.3] tablet-lg:h-[calc(100dvh/1.45)] tablet-lg:[zoom:1.45]"
      // iOS only applies :active (the press feedback) when a touch listener is present.
      onTouchStart={() => {}}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-home-glow" />
      <div className="relative mx-auto flex min-h-0 w-full max-w-[430px] flex-1 flex-col px-gutter pt-[calc(var(--safe-top)+21px)] pb-[max(calc(var(--safe-bottom)-14px),20px)]">
        <header className="flex h-[41px] shrink-0 items-center">
          {onBack && (
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className={`${hitArea} ${focusRing} flex size-10 cursor-pointer items-center justify-center rounded-[41px] bg-white/70 transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.92]`}
            >
              <img src={backIcon} alt="" className="size-6 max-w-none" />
            </button>
          )}
        </header>
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto py-5 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
        <footer className="flex shrink-0 flex-col items-center gap-3">{footer}</footer>
      </div>
    </div>
  )
}

/** Small print marking a stand-in screen. */
export function DemoNote({ children }: { children: ReactNode }) {
  return <p className="text-caption text-muted">{children}</p>
}

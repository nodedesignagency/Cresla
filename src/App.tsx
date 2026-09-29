import { Capacitor } from '@capacitor/core'
import { useState, type CSSProperties } from 'react'
import { Home } from './home'
import { Paywall } from './paywall'

// Desktop browsers report no safe-area insets. Simulate an iPhone 14 (390×844) status bar and
// home indicator so `npm run dev` previews the layout as it appears on a device.
const previewInsets = Capacitor.isNativePlatform()
  ? undefined
  : ({
      '--paywall-safe-top': 'max(env(safe-area-inset-top), 47px)',
      '--paywall-safe-bottom': 'max(env(safe-area-inset-bottom), 34px)',
      '--home-safe-top': 'max(env(safe-area-inset-top), 47px)',
      '--home-safe-bottom': 'max(env(safe-area-inset-bottom), 34px)',
    } as CSSProperties)

// Dev harness: which screen and state to open with.
//   Browser:   ?screen=paywall   ?connected=1
//   Simulator: VITE_SCREEN=paywall ./scripts/run.sh   (VITE_CONNECTED=1 for the returning state)
const params = new URLSearchParams(window.location.search)
const screen = params.get('screen') ?? import.meta.env.VITE_SCREEN ?? 'home'
const startConnected = (params.get('connected') ?? import.meta.env.VITE_CONNECTED) === '1'

export default function App() {
  // Home's first-time / returning switch. Tapping Connect turns it on; holding the logo for 0.6s
  // flips it either way, for testing.
  const [hasConnectedReport, setHasConnectedReport] = useState(startConnected)

  return (
    <div style={previewInsets}>
      {screen === 'paywall' ? (
        <Paywall
          // No real payments yet: log what would be purchased.
          onSubscribe={(plan) => console.log('[Paywall] onSubscribe', plan.id, plan)}
          onSignIn={() => console.log('[Paywall] onSignIn')}
          onRestore={() => console.log('[Paywall] onRestore')}
          onOpenTerms={() => console.log('[Paywall] onOpenTerms')}
          onOpenPrivacy={() => console.log('[Paywall] onOpenPrivacy')}
        />
      ) : (
        <Home
          hasConnectedReport={hasConnectedReport}
          // No real connection flow yet: go straight to the returning state.
          onConnect={() => {
            console.log('[Home] onConnect')
            setHasConnectedReport(true)
          }}
          onSignIn={() => console.log('[Home] onSignIn')}
          onMenu={() => console.log('[Home] onMenu')}
          onModeChange={(mode) => console.log('[Home] onModeChange', mode)}
          onAttach={() => console.log('[Home] onAttach')}
          onDictate={() => console.log('[Home] onDictate')}
          onVoice={() => console.log('[Home] onVoice')}
          onLogoLongPress={() => {
            console.log('[Home] logo held: toggling hasConnectedReport')
            setHasConnectedReport((connected) => !connected)
          }}
        />
      )}
    </div>
  )
}

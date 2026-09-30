import { Capacitor } from '@capacitor/core'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ConnectReport } from './connect/ConnectReport'
import { ConnectSuccess } from './connect/ConnectSuccess'
import { Home } from './home'
import { hideLaunchScreen, setStatusBarText } from './launch'
import { Stack, type StackDirection, type StackEntry } from './navigation/Stack'
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

type Route = 'home' | 'connect' | 'success'

export default function App() {
  return <div style={previewInsets}>{screen === 'paywall' ? <PaywallScreen /> : <HomeFlow />}</div>
}

/**
 * Home and the connect flow: Home → Connect (demo) → Success (demo) → back to Home, now in its
 * returning state. Screens slide like iOS navigation.
 */
function HomeFlow() {
  // Home's first-time / returning switch. Holding the logo for 0.6s flips it, for testing.
  const [hasConnectedReport, setHasConnectedReport] = useState(startConnected)
  const [nav, setNav] = useState<{ routes: { route: Route; order: number }[]; direction: StackDirection }>({
    routes: [{ route: 'home', order: 0 }],
    direction: 'forward',
  })
  const nextOrder = useRef(1)
  const push = (route: Route) =>
    setNav(({ routes }) => ({ routes: [...routes, { route, order: nextOrder.current++ }], direction: 'forward' }))
  const replace = (route: Route) =>
    setNav(({ routes }) => ({
      routes: [...routes.slice(0, -1), { route, order: nextOrder.current++ }],
      direction: 'forward',
    }))
  const pop = () => setNav(({ routes }) => ({ routes: routes.slice(0, -1), direction: 'back' }))

  const top = nav.routes[nav.routes.length - 1].route

  // Every screen in this flow is light, so the status bar text is dark.
  useEffect(() => setStatusBarText('dark'), [])

  const screens: Record<Route, () => ReactNode> = {
    home: () => (
      <Home
        hasConnectedReport={hasConnectedReport}
        active={top === 'home'}
        onConnect={() => {
          console.log('[Home] onConnect')
          push('connect')
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
    ),
    connect: () => (
      <ConnectReport
        onBack={pop}
        onConnected={() => {
          console.log('[Connect] connected')
          // Home is covered now, so it switches to its returning state without animating.
          setHasConnectedReport(true)
          replace('success')
        }}
      />
    ),
    success: () => <ConnectSuccess onContinue={pop} />,
  }

  const entries: StackEntry[] = nav.routes.map(({ route, order }) => ({
    key: `${route}-${order}`,
    order,
    element: screens[route](),
  }))

  return <Stack entries={entries} direction={nav.direction} />
}

function PaywallScreen() {
  useEffect(() => {
    // White status bar text over the blue sky; the paywall has no logo to hand over to.
    setStatusBarText('light')
    hideLaunchScreen()
  }, [])
  return (
    <Paywall
      // No real payments yet: log what would be purchased.
      onSubscribe={(plan) => console.log('[Paywall] onSubscribe', plan.id, plan)}
      onSignIn={() => console.log('[Paywall] onSignIn')}
      onRestore={() => console.log('[Paywall] onRestore')}
      onOpenTerms={() => console.log('[Paywall] onOpenTerms')}
      onOpenPrivacy={() => console.log('[Paywall] onOpenPrivacy')}
    />
  )
}

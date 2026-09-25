import { Capacitor } from '@capacitor/core'
import type { CSSProperties } from 'react'
import { Paywall } from './paywall'

// Desktop browsers report no safe-area insets. Simulate an iPhone 14 (390×844) status bar and
// home indicator so `npm run dev` previews the layout as it appears on a device.
const previewInsets = Capacitor.isNativePlatform()
  ? undefined
  : ({
      '--paywall-safe-top': 'max(env(safe-area-inset-top), 47px)',
      '--paywall-safe-bottom': 'max(env(safe-area-inset-bottom), 34px)',
    } as CSSProperties)

export default function App() {
  return (
    <div style={previewInsets}>
      <Paywall />
    </div>
  )
}

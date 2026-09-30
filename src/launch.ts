import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

let hidden = false

/**
 * Hides the native launch screen (the logo at 2x, centred). Call it once the first screen has
 * drawn what should replace it; it waits two frames so that drawing is really on screen.
 */
export function hideLaunchScreen() {
  if (hidden || !Capacitor.isNativePlatform()) return
  hidden = true
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      SplashScreen.hide({ fadeOutDuration: 150 }).catch(() => {})
    }),
  )
}

/** Status bar text colour: dark over light pages, light over dark or colourful ones. */
export function setStatusBarText(text: 'dark' | 'light') {
  if (!Capacitor.isNativePlatform()) return
  StatusBar.setStyle({ style: text === 'dark' ? Style.Light : Style.Dark }).catch(() => {})
}

import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.cresla.app',
  appName: 'Cresla',
  webDir: 'dist',
  ios: {
    // Let the web view run edge-to-edge; the UI handles safe areas itself
    // via env(safe-area-inset-*).
    contentInset: 'never',
    backgroundColor: '#f2f4f8',
  },
  plugins: {
    StatusBar: {
      // Dark status bar text for Home's light page, drawn on top of the web view. The paywall
      // switches to white text over its blue sky (src/App.tsx).
      style: 'LIGHT',
      overlaysWebView: true,
    },
    SplashScreen: {
      // The launch screen (the logo at 2x, see LaunchScreen.storyboard) stays up until Home has
      // drawn the same logo in the same place and hides it (src/launch.ts), so the handoff is
      // seamless. After 3s it hides regardless.
      launchAutoHide: true,
      launchShowDuration: 3000,
      launchFadeOutDuration: 150,
      backgroundColor: '#f2f4f8',
      showSpinner: false,
    },
  },
}

export default config

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
}

export default config

import { motion } from 'framer-motion'

// Temporary setup check. Replaced by the Paywall screen in step 2.
export default function App() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-5 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <motion.div
        className="size-16 rounded-2xl bg-brand"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="text-center text-base font-medium">Vite + React + Tailwind + Framer Motion</p>
      <p className="text-center text-xs text-black/50">Setup check · Capacitor iOS ready</p>
    </main>
  )
}

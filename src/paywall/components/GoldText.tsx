import type { ReactNode } from 'react'

// Registering the angle as a typed property lets the browser interpolate it smoothly
// (Safari 16.4+). Where that isn't supported the gold simply stays still.
if (typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
  try {
    CSS.registerProperty({ name: '--gold-angle', syntax: '<angle>', inherits: false, initialValue: '100deg' })
  } catch {
    // Already registered (e.g. after a hot reload).
  }
}

/** Text filled with a gold-foil gradient whose light slowly rotates around the letters. */
export function GoldText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`animate-gold-spin bg-gold bg-clip-text text-transparent ${className}`}>{children}</span>
}

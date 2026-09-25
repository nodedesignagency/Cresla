import type { ReactNode } from 'react'

/**
 * Text filled with a flowing gold "mesh" gradient: soft blobs of light and deep gold that
 * drift slowly inside the letters.
 */
export function GoldText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`animate-gold-mesh bg-gold-mesh bg-[length:38%_320%,44%_320%,34%_320%,50%_320%,100%_100%] bg-[position:5%_50%,85%_40%,45%_60%,100%_50%,0_0] bg-no-repeat bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}

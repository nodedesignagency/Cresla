import { useReducedMotion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { focusRing, hitArea } from '../../paywall/ui'

export type HomeMode = 'chat' | 'support'

const MODES: { id: HomeMode; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'support', label: 'Support' },
]

interface ModeToggleProps {
  value: HomeMode
  onChange: (mode: HomeMode) => void
}

/** Chat / Support switch. The selected pill slides between the two labels. */
export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ x: number; width: number; slide: boolean } | null>(null)

  // Place the pill under the selected label. Layout offsets ignore the press scale, so the pill
  // always lands exactly. It slides when the selection changes, and snaps when the labels are
  // resized (the font loading, Display Zoom).
  const selected = useRef(value)
  selected.current = value
  const place = (slide: boolean) => {
    const tab = listRef.current?.querySelector<HTMLElement>(`[data-mode="${selected.current}"]`)
    if (tab) setPill({ x: tab.offsetLeft, width: tab.offsetWidth, slide })
  }
  const placed = useRef(false)
  useLayoutEffect(() => {
    place(placed.current)
    placed.current = true
  }, [value])
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let initial = true // ResizeObserver reports once on attach; the pill is already placed
    const observer = new ResizeObserver(() => {
      if (initial) initial = false
      else place(false)
    })
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const slide = pill?.slide && !reduceMotion

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Mode"
      className="relative flex gap-2.5 rounded-[41px] bg-white/70 p-1 transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] narrow:gap-1"
    >
      {pill && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-0 rounded-[41px] bg-pill"
          style={{
            width: pill.width,
            transform: `translateX(${pill.x}px)`,
            transition: slide ? 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), width 0.4s cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
          }}
        />
      )}
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          data-mode={id}
          aria-selected={id === value}
          onClick={() => onChange(id)}
          className={`${hitArea} ${focusRing} cursor-pointer rounded-[41px] px-3 py-2 text-button font-medium text-black narrow:px-2.5`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

import { useEffect, useState, type RefObject } from 'react'

/**
 * A mask for a scrolling element that softly fades out whichever ends have more content past
 * them, so it's clear the area scrolls. Undefined while everything fits.
 */
export function useScrollFade(
  ref: RefObject<HTMLElement | null>,
  axis: 'x' | 'y',
  fade: { start: number; end: number },
): string | undefined {
  const [more, setMore] = useState({ start: false, end: false })

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const position = axis === 'x' ? element.scrollLeft : element.scrollTop
      const visible = axis === 'x' ? element.clientWidth : element.clientHeight
      const total = axis === 'x' ? element.scrollWidth : element.scrollHeight
      const start = position > 1
      const end = position + visible < total - 1
      setMore((current) => (current.start === start && current.end === end ? current : { start, end }))
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    // Re-check when the element or its content changes size (fonts loading, the card leaving).
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref, axis])

  if (!more.start && !more.end) return undefined
  const direction = axis === 'x' ? 'to right' : 'to bottom'
  return `linear-gradient(${direction}, transparent, #000 ${more.start ? fade.start : 0}px, #000 calc(100% - ${more.end ? fade.end : 0}px), transparent)`
}

/**
 * Grows the tap area to at least 44×44pt (Apple HIG) without affecting layout.
 * The element must not clip overflow.
 */
export const hitArea =
  'relative after:absolute after:top-1/2 after:left-1/2 after:h-[max(100%,44px)] after:w-[max(100%,44px)] after:-translate-x-1/2 after:-translate-y-1/2'

/** Keyboard focus ring; hidden for touch and mouse. */
export const focusRing = 'outline-offset-2 outline-brand focus-visible:outline-2'

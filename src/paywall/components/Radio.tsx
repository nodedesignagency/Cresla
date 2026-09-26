const fade = 'transition-[opacity,scale] duration-200 ease-out'

/** Visual radio indicator (20×20). Selection semantics live on the parent input. */
export function Radio({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden className="relative size-5 shrink-0">
      <span className="absolute inset-[10%] rounded-full bg-track" />
      <span className="absolute inset-[17.5%] rounded-full bg-white shadow-radio" />
      <span
        className={`absolute inset-[10%] rounded-full border-t border-brand-deep bg-brand shadow-radio-active ${fade} ${checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      />
      <span
        className={`absolute inset-[30%] rounded-full border border-white bg-white shadow-radio-dot ${fade} ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
      />
    </span>
  )
}

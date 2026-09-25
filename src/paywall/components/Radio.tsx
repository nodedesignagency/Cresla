/** Visual radio indicator (20×20). Selection semantics live on the parent button. */
export function Radio({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden className="relative size-5 shrink-0">
      {checked ? (
        <>
          <span className="absolute inset-[10%] rounded-full border-t border-brand-deep bg-brand shadow-radio-active" />
          <span className="absolute inset-[30%] rounded-full border border-white bg-white shadow-radio-dot" />
        </>
      ) : (
        <>
          <span className="absolute inset-[10%] rounded-full bg-track" />
          <span className="absolute inset-[17.5%] rounded-full bg-white shadow-radio" />
        </>
      )}
    </span>
  )
}

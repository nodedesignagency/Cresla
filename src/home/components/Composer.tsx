import { useLayoutEffect, type RefObject } from 'react'
import micIcon from '../../assets/home/icon-mic.svg'
import plusIcon from '../../assets/home/icon-plus.svg'
import voiceIcon from '../../assets/home/icon-voice.svg'
import { focusRing, hitArea } from '../../paywall/ui'

/** The field grows with its text up to this height (six lines), then scrolls. */
const MAX_FIELD_HEIGHT = 102

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  fieldRef: RefObject<HTMLTextAreaElement | null>
  onAttach?: () => void
  onDictate?: () => void
  onVoice?: () => void
}

const press = 'transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.9]'

export function Composer({ value, onChange, fieldRef, onAttach, onDictate, onVoice }: ComposerProps) {
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${Math.min(field.scrollHeight, MAX_FIELD_HEIGHT)}px`
  }, [value, fieldRef])

  return (
    <div className="rounded-card bg-white p-1 shadow-composer">
      {/* Tapping anywhere in the grey area starts typing */}
      <div
        className="flex cursor-text flex-col gap-5 rounded-panel bg-canvas px-[16.88px] py-[17.87px] tiny:gap-4 tiny:py-3.5"
        onClick={(event) => {
          if (event.target === event.currentTarget) fieldRef.current?.focus()
        }}
      >
        <textarea
          ref={fieldRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask Cresla anything."
          aria-label="Ask Cresla anything"
          className="block w-full resize-none bg-transparent text-prompt text-ink outline-none select-text placeholder:text-hint"
        />
        <div className="flex items-end justify-between">
          <button
            type="button"
            aria-label="Add"
            onClick={onAttach}
            className={`${hitArea} ${focusRing} ${press} flex size-7 cursor-pointer items-center justify-center rounded-full border border-hairline bg-white`}
          >
            <img src={plusIcon} alt="" className="h-[12.54px] w-[12.54px] max-w-none" />
          </button>
          <div className="flex items-center gap-[7.06px]">
            <button
              type="button"
              aria-label="Dictate"
              onClick={onDictate}
              className={`${hitArea} ${focusRing} ${press} flex size-7 cursor-pointer items-center justify-center rounded-full border border-hairline bg-white`}
            >
              <img src={micIcon} alt="" className="size-[15.864px] max-w-none" />
            </button>
            <button
              type="button"
              aria-label="Voice mode"
              onClick={onVoice}
              className={`${hitArea} ${focusRing} ${press} flex size-7 cursor-pointer items-center justify-center rounded-full bg-brand shadow-voice`}
            >
              <img src={voiceIcon} alt="" className="size-[15.864px] max-w-none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

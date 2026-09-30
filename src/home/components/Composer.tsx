import { useLayoutEffect, type RefObject } from 'react'
import micIcon from '../../assets/home/icon-mic.svg'
import plusIcon from '../../assets/home/icon-plus.svg'
import sendIcon from '../../assets/home/icon-send.svg'
import voiceIcon from '../../assets/home/icon-voice.svg'
import { focusRing, hitArea } from '../../paywall/ui'

/** The field grows with its text up to this height (five lines), then scrolls. */
const MAX_FIELD_HEIGHT = 120

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  fieldRef: RefObject<HTMLTextAreaElement | null>
  onAttach?: () => void
  onDictate?: () => void
  onVoice?: () => void
  /** Tapped the send arrow, which replaces voice mode while there's text. */
  onSend?: () => void
}

const press = 'transition-[scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.9]'

// The blue button's two icons swap with a quick turn and scale.
const swap = 'absolute transition-[opacity,scale,rotate] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]'

export function Composer({ value, onChange, fieldRef, onAttach, onDictate, onVoice, onSend }: ComposerProps) {
  const canSend = value.trim().length > 0

  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${Math.min(field.scrollHeight, MAX_FIELD_HEIGHT)}px`
  }, [value, fieldRef])

  return (
    // Sized like a native chat field (Claude, Messages): 18pt text and 36pt buttons close to the
    // edges. The corners follow the round buttons: the grey panel's radius is the buttons' (18) plus
    // their 8pt inset, and the white frame adds its own 4pt.
    <div className="rounded-[30px] bg-white p-1 shadow-composer">
      {/* Tapping anywhere in the grey area starts typing */}
      <div
        className="flex cursor-text flex-col gap-[22px] rounded-[26px] bg-canvas px-2 pt-[22px] pb-2 tiny:gap-4 tiny:pt-4"
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
          className="block w-full resize-none bg-transparent px-2 text-prompt text-ink outline-none select-text placeholder:text-hint"
        />
        <div className="flex items-end justify-between">
          <button
            type="button"
            aria-label="Add"
            onClick={onAttach}
            className={`${hitArea} ${focusRing} ${press} flex size-9 cursor-pointer items-center justify-center rounded-full border border-hairline bg-white`}
          >
            <img src={plusIcon} alt="" className="size-4 max-w-none" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Dictate"
              onClick={onDictate}
              className={`${hitArea} ${focusRing} ${press} flex size-9 cursor-pointer items-center justify-center rounded-full border border-hairline bg-white`}
            >
              <img src={micIcon} alt="" className="size-5 max-w-none" />
            </button>
            {/* Voice mode while the field is empty; the send arrow once there's something to send */}
            <button
              type="button"
              aria-label={canSend ? 'Send' : 'Voice mode'}
              onClick={canSend ? onSend : onVoice}
              className={`${hitArea} ${focusRing} ${press} flex size-9 cursor-pointer items-center justify-center rounded-full bg-brand shadow-voice`}
            >
              <img
                src={voiceIcon}
                alt=""
                className={`${swap} size-5 max-w-none ${canSend ? 'scale-50 -rotate-45 opacity-0' : ''}`}
              />
              <img
                src={sendIcon}
                alt=""
                className={`${swap} size-5 max-w-none ${canSend ? '' : 'scale-50 rotate-45 opacity-0'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

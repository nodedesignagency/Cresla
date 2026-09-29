import owl from '../../assets/home/owl-sleeping.png'

/**
 * The sleeping owl and its lock thought bubble, inside the score gauge: a 73×73pt frame that the
 * gauge positions. It's a still image for now. To animate it, replace what this component renders
 * and keep the frame size; nothing else needs to change.
 */
export function GaugeMascot({ className = '' }: { className?: string }) {
  return (
    <img
      src={owl}
      alt=""
      draggable={false}
      className={`pointer-events-none size-[73px] max-w-none select-none ${className}`}
    />
  )
}

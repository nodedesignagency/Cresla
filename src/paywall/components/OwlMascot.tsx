// Swap the mascot by replacing src/assets/owl.png (any size, ~154:160 aspect, transparent background).
import owl from '../../assets/owl.png'

export function OwlMascot() {
  return (
    <div className="relative h-[160px] w-[154px] shrink-0">
      <img src={owl} alt="" draggable={false} className="size-full object-contain select-none" />
    </div>
  )
}

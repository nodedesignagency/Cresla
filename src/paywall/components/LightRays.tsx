import glow from '../../assets/light-glow.svg'
import rayCore from '../../assets/light-ray-core.svg'
import rayWide from '../../assets/light-ray-wide.svg'

/** Soft beams of light falling from the top edge of the screen, over the mascot. */
export function LightRays() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[-13px] left-1/2 z-10 h-[191px] w-[243px] -translate-x-1/2 opacity-50"
    >
      <img src={rayWide} alt="" className="absolute top-1 left-0 h-[236px] w-[243px] max-w-none" />
      <img
        src={rayCore}
        alt=""
        className="absolute top-0 left-1/2 h-[209px] w-[149px] max-w-none -translate-x-1/2 mix-blend-lighten"
      />
      <img
        src={glow}
        alt=""
        className="absolute top-[-66.54px] left-[calc(50%-213.5px)] h-[128.443px] w-[430.457px] max-w-none mix-blend-plus-lighter"
      />
    </div>
  )
}

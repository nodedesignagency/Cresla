import cloudBack from '../../assets/cloud-1.png'
import cloudFront from '../../assets/cloud-2.png'

// Figma frame is 393pt wide with a 59pt status bar. Clouds are positioned from the
// horizontal center and follow the content when the device's top inset differs.
export function SkyBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[calc(var(--safe-top)+245px)] bg-sky" />
      <img
        src={cloudBack}
        alt=""
        className="absolute top-[calc(var(--safe-top)-51px)] left-[calc(50%-651.5px)] h-[494px] w-[889px] max-w-none"
      />
      <img
        src={cloudFront}
        alt=""
        className="absolute top-[calc(var(--safe-top)-47px)] left-[calc(50%-225.5px)] h-[494px] w-[889px] max-w-none"
      />
    </div>
  )
}

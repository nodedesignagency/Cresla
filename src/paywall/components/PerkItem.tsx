interface PerkItemProps {
  icon: string
  label: string
}

export function PerkItem({ icon, label }: PerkItemProps) {
  return (
    <li className="flex min-w-0 flex-1 items-center justify-center gap-1 px-4 py-2 tiny:py-1">
      <img src={icon} alt="" draggable={false} className="size-4 shrink-0" />
      <span className="-my-trim-micro text-micro whitespace-nowrap text-black narrow:text-[9px]">{label}</span>
    </li>
  )
}

/** Hairline between perks: 36px tall, fading out at both ends. */
export function PerkDivider() {
  return (
    <li aria-hidden className="relative h-9 w-0 shrink-0 tiny:h-7">
      <span className="absolute inset-y-0 -left-[0.5px] w-px bg-rule-fade" />
    </li>
  )
}

import { cn } from "@/lib/utils";

/** CSS-only marquee (pauses on hover, static under prefers-reduced-motion). Decorative; content is duplicated for loop. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((t, i) => (
        <li key={`${t}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-base font-extrabold uppercase tracking-tight md:text-xl">{t}</span>
          <span className="ring-motif size-3 md:size-3.5" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

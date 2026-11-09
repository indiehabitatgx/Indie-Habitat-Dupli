import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "amber" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 font-display text-[0.65rem] font-bold uppercase leading-none tracking-[0.14em]",
        tone === "default" && "bg-fg text-bg",
        tone === "amber" && "bg-amber text-amber-ink",
        tone === "muted" && "bg-white/8 text-fg ring-1 ring-inset ring-white/15",
        className,
      )}
      {...props}
    />
  );
}

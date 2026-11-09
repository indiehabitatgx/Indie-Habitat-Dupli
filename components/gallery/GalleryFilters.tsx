"use client";

import { cn } from "@/lib/utils";

export function GalleryFilters({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
      {["All", ...categories].map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={active === c}
          onClick={() => onChange(c)}
          className={cn(
            "min-h-11 rounded-full border px-5 font-display text-xs font-bold uppercase tracking-[0.14em] transition",
            active === c ? "border-amber bg-amber text-amber-ink" : "border-line hover:border-fg",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

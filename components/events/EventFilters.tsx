"use client";

import type { EventFilterState, EventSort } from "@/lib/event-filters";
import { DAY_NAMES, cn } from "@/lib/utils";

export function EventFilters({
  categories,
  state,
  onChange,
}: {
  categories: { slug: string; name: string }[];
  state: EventFilterState;
  onChange: (patch: Partial<EventFilterState>) => void;
}) {
  const chips = [{ slug: "all", name: "All" }, ...categories];
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <fieldset>
        <legend className="mb-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">Category</legend>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const active = state.category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ category: c.slug })}
                className={cn(
                  "min-h-11 rounded-full border px-5 font-display text-xs font-bold uppercase tracking-[0.14em] transition",
                  active ? "border-amber bg-amber text-amber-ink" : "border-line hover:border-fg",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <div className="flex flex-col gap-2">
          <label htmlFor="filter-day" className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
            Day
          </label>
          <select id="filter-day" className="field sm:w-48" value={state.day} onChange={(e) => onChange({ day: e.target.value })}>
            <option value="all">Any day</option>
            {DAY_NAMES.map((d, i) => (
              <option key={d} value={String(i)}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="filter-sort" className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
            Sort by
          </label>
          <select
            id="filter-sort"
            className="field sm:w-52"
            value={state.sort}
            onChange={(e) => onChange({ sort: e.target.value as EventSort })}
          >
            <option value="featured">Featured</option>
            <option value="time">Earliest start time</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="title">Name A–Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

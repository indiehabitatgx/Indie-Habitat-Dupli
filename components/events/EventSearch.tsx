"use client";

import { Search, X } from "lucide-react";

export function EventSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full">
      <label htmlFor="event-search" className="sr-only">
        Search events
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
      <input
        id="event-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search shows, e.g. open mic"
        autoComplete="off"
        className="field !min-h-14 !pl-12 !pr-12 text-lg"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-muted hover:text-fg"
          aria-label="Clear search"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { EventCardData } from "@/types/event";
import { DEFAULT_FILTERS, categoriesOf, filterEvents, type EventFilterState } from "@/lib/event-filters";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { EventSearch } from "@/components/events/EventSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { DAY_NAMES } from "@/lib/utils";

const PAGE_SIZE = 9;

export function EventExplorer({ events, initial }: { events: EventCardData[]; initial: EventFilterState }) {
  const [state, setState] = useState<EventFilterState>(initial);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredQ = useDeferredValue(state.q);

  const categories = useMemo(() => categoriesOf(events), [events]);
  const results = useMemo(() => filterEvents(events, { ...state, q: deferredQ }), [events, state, deferredQ]);

  // Keep the URL shareable without adding history entries or re-requesting the page.
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (state.q) qs.set("q", state.q);
      if (state.category !== "all") qs.set("category", state.category);
      if (state.day !== "all") qs.set("day", state.day);
      if (state.sort !== "featured") qs.set("sort", state.sort);
      const next = qs.toString();
      if (next !== window.location.search.replace(/^\?/, "")) {
        window.history.replaceState(null, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [state]);

  const update = (patch: Partial<EventFilterState>) => {
    setState((s) => ({ ...s, ...patch }));
    setVisible(PAGE_SIZE);
  };

  const summary = [
    state.category !== "all" ? categories.find((c) => c.slug === state.category)?.name : null,
    state.day !== "all" ? `on ${DAY_NAMES[Number(state.day)]}` : null,
    deferredQ ? `matching “${deferredQ}”` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 border-y border-line py-8">
        <EventSearch value={state.q} onChange={(q) => update({ q })} />
        <EventFilters categories={categories} state={state} onChange={update} />
      </div>

      <h2 className="sr-only">Shows</h2>
      <p className="text-sm text-muted" aria-live="polite" role="status">
        {results.length} {results.length === 1 ? "show" : "shows"}
        {summary ? ` ${summary}` : ""}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="No shows match"
          action={
            <Button variant="outline" onClick={() => update(DEFAULT_FILTERS)}>
              Clear filters
            </Button>
          }
        >
          Try another day or category, or clear your search.
        </EmptyState>
      ) : (
        <>
          {/* Fluid columns: ~160px min on phones (2-up), ~210px from sm, ~240px on large screens; never a single giant card. */}
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-x-3 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-x-5 sm:gap-y-8 xl:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] xl:gap-x-6">
            {results.slice(0, visible).map((e, i) => (
              <li key={e.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
          {visible < results.length && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more shows ({results.length - visible} more)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

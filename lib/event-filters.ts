import type { EventCardData } from "@/types/event";

export type EventSort = "featured" | "time" | "price-asc" | "price-desc" | "title";

export type EventFilterState = {
  q: string;
  category: string; // "all" | category slug
  day: string; // "all" | "0".."6"
  sort: EventSort;
};

export const DEFAULT_FILTERS: EventFilterState = { q: "", category: "all", day: "all", sort: "featured" };

export function parseFilters(params: URLSearchParams | Record<string, string | undefined>): EventFilterState {
  const get = (k: string) => (params instanceof URLSearchParams ? params.get(k) : params[k]) ?? undefined;
  const sort = get("sort");
  const day = get("day");
  return {
    q: (get("q") ?? "").slice(0, 80),
    category: get("category") || "all",
    day: day && /^[0-6]$/.test(day) ? day : "all",
    sort: (["featured", "time", "price-asc", "price-desc", "title"] as const).includes(sort as EventSort)
      ? (sort as EventSort)
      : "featured",
  };
}

function weekdayOf(iso: string) {
  // Interpret in IST, the venue's timezone.
  const d = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return d.getDay();
}

export function runsOnDay(e: EventCardData, day: number) {
  if (e.recurrence === "WEEKLY") return e.scheduleDays.includes(day);
  return e.startDate ? weekdayOf(e.startDate) === day : false;
}

export function filterEvents(events: EventCardData[], f: EventFilterState): EventCardData[] {
  const q = f.q.trim().toLowerCase();
  const out = events.filter((e) => {
    if (f.category !== "all" && e.category.slug !== f.category) return false;
    if (f.day !== "all" && !runsOnDay(e, Number(f.day))) return false;
    if (q) {
      const hay = `${e.title} ${e.shortDescription} ${e.category.name} ${e.venue?.name ?? ""} ${e.scheduleText}`.toLowerCase();
      if (!q.split(/\s+/).every((term) => hay.includes(term))) return false;
    }
    return true;
  });

  const priceKey = (e: EventCardData, dir: 1 | -1) => e.ticketPrice ?? (dir === 1 ? Infinity : -Infinity);

  return out.sort((a, b) => {
    switch (f.sort) {
      case "time":
        return (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99") || a.title.localeCompare(b.title);
      case "price-asc":
        return priceKey(a, 1) - priceKey(b, 1) || a.title.localeCompare(b.title);
      case "price-desc":
        return priceKey(b, -1) - priceKey(a, -1) || a.title.localeCompare(b.title);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder;
    }
  });
}

/** Categories present in the given events, so filters only show verified offerings. */
export function categoriesOf(events: EventCardData[]) {
  const map = new Map<string, string>();
  for (const e of events) map.set(e.category.slug, e.category.name);
  return [...map].map(([slug, name]) => ({ slug, name }));
}

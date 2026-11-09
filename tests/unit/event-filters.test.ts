import { describe, expect, it } from "vitest";
import { categoriesOf, filterEvents, parseFilters, DEFAULT_FILTERS } from "@/lib/event-filters";
import type { EventCardData } from "@/types/event";

const base: Omit<EventCardData, "id" | "title" | "slug" | "category" | "scheduleDays" | "startTime" | "ticketPrice" | "featured" | "sortOrder"> = {
  shortDescription: "",
  image: null,
  posterWidth: null,
  posterHeight: null,
  venue: null,
  recurrence: "WEEKLY",
  scheduleText: "",
  startDate: null,
  priceNote: null,
  bookingUrl: null,
  bookingProvider: null,
};
const comedy = { name: "Comedy", slug: "comedy" };
const poetry = { name: "Poetry", slug: "poetry" };

const events: EventCardData[] = [
  { ...base, id: "1", title: "All Star Standup Comedy", slug: "a", category: comedy, scheduleDays: [0, 1, 2, 3, 4, 5, 6], startTime: "22:00", ticketPrice: 300, featured: true, sortOrder: 1 },
  { ...base, id: "2", title: "Mass Bunk", slug: "b", category: comedy, scheduleDays: [5, 6, 0], startTime: "16:00", ticketPrice: 199, featured: true, sortOrder: 3 },
  { ...base, id: "3", title: "Poetry Open Mic", slug: "c", category: poetry, scheduleDays: [0, 1], startTime: "14:00", ticketPrice: 250, featured: false, sortOrder: 5 },
  { ...base, id: "4", title: "Comedy Open Mic", slug: "d", category: comedy, scheduleDays: [1], startTime: "19:00", ticketPrice: null, featured: false, sortOrder: 6 },
];

const titles = (list: EventCardData[]) => list.map((e) => e.title);

describe("filterEvents", () => {
  it("filters by category", () => {
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, category: "poetry" }))).toEqual(["Poetry Open Mic"]);
  });
  it("filters by weekday", () => {
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, day: "1" }))).toEqual(["All Star Standup Comedy", "Poetry Open Mic", "Comedy Open Mic"]);
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, day: "6" }))).toEqual(["All Star Standup Comedy", "Mass Bunk"]);
  });
  it("searches with all terms", () => {
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, q: "open mic" }))).toEqual(["Poetry Open Mic", "Comedy Open Mic"]);
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, q: "comedy open" }))).toEqual(["Comedy Open Mic"]);
    expect(filterEvents(events, { ...DEFAULT_FILTERS, q: "jazz" })).toHaveLength(0);
  });
  it("sorts by price with unknown prices last", () => {
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, sort: "price-asc" }))).toEqual(["Mass Bunk", "Poetry Open Mic", "All Star Standup Comedy", "Comedy Open Mic"]);
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, sort: "price-desc" }))[0]).toBe("All Star Standup Comedy");
  });
  it("sorts by start time", () => {
    expect(titles(filterEvents(events, { ...DEFAULT_FILTERS, sort: "time" }))[0]).toBe("Poetry Open Mic");
  });
  it("featured sort keeps featured first, then sortOrder", () => {
    expect(titles(filterEvents(events, DEFAULT_FILTERS))).toEqual(["All Star Standup Comedy", "Mass Bunk", "Poetry Open Mic", "Comedy Open Mic"]);
  });
  it("does not mutate input", () => {
    const copy = [...events];
    filterEvents(events, { ...DEFAULT_FILTERS, sort: "title" });
    expect(events).toEqual(copy);
  });
});

describe("parseFilters / categoriesOf", () => {
  it("sanitises unknown values", () => {
    expect(parseFilters(new URLSearchParams("day=9&sort=evil&category=comedy"))).toEqual({ q: "", category: "comedy", day: "all", sort: "featured" });
  });
  it("lists only categories present", () => {
    expect(categoriesOf(events)).toEqual([comedy, poetry]);
  });
});

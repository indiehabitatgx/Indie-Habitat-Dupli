import "server-only";
import { getArtists, getEvents, getSettings } from "@/lib/data";
import type { Knowledge } from "@/lib/assistant/engine";

/** Live knowledge for the assistant: published events/artists and the current site notice. */
export async function loadKnowledge(): Promise<Knowledge> {
  const [events, artists, settings] = await Promise.all([getEvents(), getArtists(), getSettings()]);
  return {
    events: events.map((e) => ({
      title: e.title,
      slug: e.slug,
      category: e.category.name,
      shortDescription: e.shortDescription,
      days: e.scheduleDays,
      scheduleText: e.scheduleText,
      startTime: e.startTime,
      priceNote: e.priceNote,
      ticketPrice: e.ticketPrice,
      bookingUrl: e.bookingUrl,
      bookingProvider: e.bookingProvider,
    })),
    artists: artists.map((a) => ({ name: a.name, slug: a.slug })),
    announcement: settings.announcementEnabled ? settings.announcement : null,
  };
}

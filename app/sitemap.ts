import type { MetadataRoute } from "next";
import { getArtists, getPublishedEventSlugs } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { venues } from "@/lib/venues";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    ["/", 1, "weekly"],
    ["/events", 0.9, "daily"],
    ["/venue", 0.8, "monthly"],
    ["/corporate-events", 0.8, "monthly"],
    ["/gallery", 0.6, "monthly"],
    ["/about", 0.6, "yearly"],
    ["/contact", 0.7, "yearly"],
    ["/faq", 0.5, "yearly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms-and-conditions", 0.2, "yearly"],
    ["/refund-policy", 0.2, "yearly"],
  ] as const;

  let events: { slug: string; updatedAt: Date }[] = [];
  let artists: { slug: string }[] = [];
  try {
    [events, artists] = await Promise.all([getPublishedEventSlugs(), getArtists()]);
  } catch {
    // Database unavailable — still return static routes.
  }

  return [
    ...staticRoutes.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), priority, changeFrequency })),
    ...venues.map((v) => ({ url: absoluteUrl(`/venue/${v.slug}`), priority: 0.7, changeFrequency: "monthly" as const })),
    ...events.map((e) => ({ url: absoluteUrl(`/events/${e.slug}`), lastModified: e.updatedAt, priority: 0.8, changeFrequency: "weekly" as const })),
    ...(artists.length ? [{ url: absoluteUrl("/artists"), priority: 0.5 }] : []),
    ...artists.map((a) => ({ url: absoluteUrl(`/artists/${a.slug}`), priority: 0.5 })),
  ];
}

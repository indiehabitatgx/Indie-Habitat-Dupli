import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { DEFAULT_ANNOUNCEMENT } from "@/lib/site";
import type { EventCardData, EventDetailData } from "@/types/event";
import type { ArtistCardData } from "@/types/artist";

const eventInclude = {
  category: { select: { name: true, slug: true } },
  venue: { select: { name: true, slug: true } },
} as const;

type EventRow = Prisma.EventGetPayload<{ include: typeof eventInclude }>;

function toCard(e: EventRow): EventCardData {
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    shortDescription: e.shortDescription,
    image: e.thumbnailImage ?? e.bannerImage,
    posterWidth: e.posterWidth,
    posterHeight: e.posterHeight,
    category: e.category,
    venue: e.venue,
    recurrence: e.recurrence,
    scheduleDays: e.scheduleDays,
    scheduleText: e.scheduleText,
    startDate: e.startDate?.toISOString() ?? null,
    startTime: e.startTime,
    ticketPrice: e.ticketPrice,
    priceNote: e.priceNote,
    bookingUrl: e.bookingUrl,
    bookingProvider: e.bookingProvider,
    featured: e.featured,
    sortOrder: e.sortOrder,
  };
}

/** Published events that are recurring, or one-off events that haven't ended yet. */
function upcomingWhere() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return {
    status: "PUBLISHED" as const,
    OR: [
      { recurrence: "WEEKLY" as const },
      { recurrence: "ONE_OFF" as const, startDate: { gte: startOfToday } },
      { recurrence: "ONE_OFF" as const, endDate: { gte: startOfToday } },
    ],
  };
}

export const getEvents = cache(async (): Promise<EventCardData[]> => {
  const rows = await db.event.findMany({
    where: upcomingWhere(),
    include: eventInclude,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { startDate: "asc" }],
  });
  return rows.map(toCard);
});

export const getFeaturedEvents = cache(async (limit = 6) => {
  const rows = await db.event.findMany({
    where: { ...upcomingWhere(), featured: true },
    include: eventInclude,
    orderBy: [{ sortOrder: "asc" }],
    take: limit,
  });
  return rows.map(toCard);
});

export const getEventBySlug = cache(async (slug: string): Promise<EventDetailData | null> => {
  const e = await db.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      ...eventInclude,
      artists: { where: { status: "PUBLISHED" }, select: { name: true, slug: true, profileImage: true } },
    },
  });
  if (!e) return null;
  return {
    ...toCard(e),
    description: e.description,
    bannerImage: e.bannerImage,
    endDate: e.endDate?.toISOString() ?? null,
    terms: e.terms,
    seoTitle: e.seoTitle,
    seoDescription: e.seoDescription,
    artists: e.artists,
    updatedAt: e.updatedAt.toISOString(),
  };
});

export const getRelatedEvents = cache(async (slug: string, categorySlug: string, limit = 3) => {
  const rows = await db.event.findMany({
    where: { ...upcomingWhere(), slug: { not: slug } },
    include: eventInclude,
    orderBy: [{ sortOrder: "asc" }],
  });
  const cards = rows.map(toCard);
  const same = cards.filter((c) => c.category.slug === categorySlug);
  const rest = cards.filter((c) => c.category.slug !== categorySlug);
  return [...same, ...rest].slice(0, limit);
});

export const getPublishedEventSlugs = cache(async () => {
  return db.event.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
});

export const getArtists = cache(async (): Promise<ArtistCardData[]> => {
  const rows = await db.artist.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    biography: a.biography,
    profileImage: a.profileImage,
    socialLinks: (a.socialLinks ?? {}) as ArtistCardData["socialLinks"],
    featured: a.featured,
  }));
});

export const getArtistBySlug = cache(async (slug: string) => {
  return db.artist.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      events: { where: { status: "PUBLISHED" }, include: eventInclude, orderBy: { sortOrder: "asc" } },
    },
  });
});

export const hasPublishedArtists = cache(async () => {
  try {
    return (await db.artist.count({ where: { status: "PUBLISHED" } })) > 0;
  } catch {
    return false;
  }
});

export const getGallery = cache(async () => {
  return db.galleryImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
});

export const getSettings = cache(async () => {
  try {
    const rows = await db.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      announcement: map.announcement ?? DEFAULT_ANNOUNCEMENT,
      announcementEnabled: (map.announcementEnabled ?? "true") === "true",
      aboutStory: map.aboutStory ?? "",
    };
  } catch {
    return { announcement: DEFAULT_ANNOUNCEMENT, announcementEnabled: true, aboutStory: "" };
  }
});

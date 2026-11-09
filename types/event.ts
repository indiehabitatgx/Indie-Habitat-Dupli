export type Recurrence = "ONE_OFF" | "WEEKLY";

export type EventCardData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string | null;
  posterWidth: number | null;
  posterHeight: number | null;
  category: { name: string; slug: string };
  venue: { name: string; slug: string } | null;
  recurrence: Recurrence;
  scheduleDays: number[];
  scheduleText: string;
  startDate: string | null;
  startTime: string | null;
  ticketPrice: number | null;
  priceNote: string | null;
  bookingUrl: string | null;
  bookingProvider: string | null;
  featured: boolean;
  sortOrder: number;
};

export type EventDetailData = EventCardData & {
  description: string;
  bannerImage: string | null;
  endDate: string | null;
  terms: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  artists: { name: string; slug: string; profileImage: string | null }[];
  updatedAt: string;
};

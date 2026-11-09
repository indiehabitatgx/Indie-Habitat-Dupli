import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import type { EventDetailData } from "@/types/event";

const DEFAULT_OG = "/images/hero/stage-bw-hd.webp";

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      site: "@IndieHabitat",
      title: `${title} | ${site.name}`,
      description,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.address.line1,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/images/brand/habitat-logo-k.png"),
    sameAs: [site.social.instagram, site.social.facebook, site.social.x, site.social.youtube],
  };
}

/** ComedyClub is a schema.org LocalBusiness subtype — matches "Comedy and Music Cafe". */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ComedyClub",
    "@id": absoluteUrl("/#venue"),
    name: site.name,
    description: site.description,
    url: site.url,
    image: absoluteUrl(DEFAULT_OG),
    telephone: site.phone,
    email: site.email,
    address: postalAddress,
    openingHours: site.openingHours,
    parentOrganization: { "@id": absoluteUrl("/#organization") },
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
  };
}

export function placeJsonLd(name: string, path: string, description: string, image: string, capacity?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${name} — ${site.name}`,
    description,
    url: absoluteUrl(path),
    image: absoluteUrl(image),
    address: postalAddress,
    ...(capacity ? { maximumAttendeeCapacity: capacity } : {}),
    containedInPlace: { "@id": absoluteUrl("/#venue") },
  };
}

/**
 * Event structured data is only emitted for one-off events with a real start date.
 * Recurring shows have no confirmed upcoming dates (see research/website-audit.md §1),
 * so emitting dated Event markup for them would be fabricating data.
 */
export function eventJsonLd(e: EventDetailData) {
  if (e.recurrence !== "ONE_OFF" || !e.startDate) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.shortDescription,
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: e.bannerImage ? [absoluteUrl(e.bannerImage)] : undefined,
    location: { "@type": "Place", name: e.venue?.name ?? site.name, address: postalAddress },
    organizer: { "@id": absoluteUrl("/#organization") },
    ...(e.ticketPrice != null && e.bookingUrl
      ? { offers: { "@type": "Offer", url: e.bookingUrl, price: e.ticketPrice, priceCurrency: "INR" } }
      : {}),
    performer: e.artists.map((a) => ({ "@type": "Person", name: a.name })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

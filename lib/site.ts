/**
 * Verified business facts. Every value here was published on indiehabitat.com
 * (audited 9 Nov 2026 — see /research/website-audit.md). Do not add unverified claims.
 */
export const site = {
  name: "The Habitat",
  legalName: "M/S The Habitat Studios",
  tagline: "Comedy and Music Cafe",
  description:
    "The Habitat is a comedy and music cafe in Mumbai — an intimate home for stand-up comedy, music, poetry and alternate events, with a larger hall upstairs, a jam room and space for private events.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  phone: "+91 98333 58492",
  phoneHref: "tel:+919833358492",
  feedbackPhone: "+91 98333 58490",
  feedbackPhoneHref: "tel:+919833358490",
  email: "accounts@unicontinental.com",
  hours: "12pm to 12am",
  openingHours: "Mo-Su 12:00-24:00",
  address: {
    line1: "9A, Rajkutir, CTS 853, 3rd Road",
    locality: "Khar West, Mumbai Suburban",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400052",
    country: "IN",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Habitat+Khar+West+Mumbai+400052",
  mapsEmbed:
    "https://www.google.com/maps?q=The+Habitat,+3rd+Road,+Khar+West,+Mumbai+400052&output=embed",
  social: {
    instagram: "https://www.instagram.com/indiehabitat",
    facebook: "https://www.facebook.com/indiehabitat/",
    x: "https://twitter.com/IndieHabitat",
    youtube: "https://www.youtube.com/channel/UCHaexIxXGCAkjiqEQUS0WZg",
    whatsapp: "https://wa.me/message/TA75TONBBKVNC1",
  },
  ticketing: {
    bookmyshow: "https://in.bookmyshow.com/venue/the-habitat-mumbai/TFST",
    insider: "https://insider.in/the-habitat-mumbai/venue",
  },
} as const;

export const fullAddress = `${site.address.line1}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

export const nav = [
  { href: "/events", label: "Events" },
  { href: "/venue", label: "Venue" },
  { href: "/corporate-events", label: "Private & Corporate" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const DEFAULT_ANNOUNCEMENT =
  "Show times and prices are as last published by The Habitat. Please confirm on BookMyShow before you head over.";

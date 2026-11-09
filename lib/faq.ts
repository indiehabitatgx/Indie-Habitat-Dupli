import { fullAddress, site } from "@/lib/site";

/** Every answer is quoted or condensed from the original site's terms, refund policy and venue pages. */
export const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
  { q: "How do I buy tickets?", a: "Tickets are sold on BookMyShow. Each event page links straight to its BookMyShow listing.", link: { href: "/events", label: "See events" } },
  { q: "Is there an age limit?", a: "Yes. Entry is permitted to ages 18+ only, and a government-issued ID may be requested at the gate. If entry is denied for being under age, no refund is issued." },
  { q: "Are seats numbered?", a: "No. Seating is first come, first served — free seating only. A different ticket category or price does not mean a different seating area." },
  { q: "What time should I arrive?", a: "At least 30 minutes before the show. Entry to the venue shuts 5 minutes after the show starts, and late entry is not allowed." },
  { q: "Can I step out during the show?", a: "You can access the washrooms and areas outside the venue, but re-entry into the show isn't allowed so the performance isn't disturbed." },
  { q: "Is there parking?", a: "There is no parking or valet provision at the venue." },
  { q: "Can I get a refund?", a: "Tickets once booked cannot be exchanged or refunded. If a show is cancelled, the refund is processed within 7–10 working days from confirmation of the cancellation.", link: { href: "/refund-policy", label: "Refund policy" } },
  { q: "Will the line-up be exactly as advertised?", a: "Line-ups and billed attractions can change without prior notice, and many shows include surprise acts." },
  { q: "Can I hire the venue?", a: "Yes — The Habitat, Above The Habitat and the Jam Room can be booked for gigs, recordings, conferences and celebrations.", link: { href: "/corporate-events", label: "Private & corporate events" } },
  { q: "How do I perform at The Habitat?", a: "Try the weekly comedy or poetry open mic, or send the team a message choosing “Perform at The Habitat”.", link: { href: "/contact", label: "Contact the team" } },
  { q: "Where is The Habitat and when is it open?", a: `${fullAddress}. Open ${site.hours}.`, link: { href: "/contact", label: "Directions & contact" } },
];

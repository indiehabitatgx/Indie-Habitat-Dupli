/**
 * The Habitat assistant: grounded answer engine.
 *
 * Every answer is composed ONLY from verified sources: lib/site.ts, lib/venues.ts, lib/faq.ts and the
 * published events/artists passed in at request time. It never invents prices, dates, line-ups or policies.
 * Pure module (no I/O) so it can be unit-tested and reused by the optional Claude mode for link selection.
 */
import { fullAddress, site } from "@/lib/site";
import { venues } from "@/lib/venues";
import { DAY_NAMES, formatPrice } from "@/lib/utils";

export type ChatLink = { label: string; href: string; external?: boolean };
export type ChatAnswer = { text: string; links: ChatLink[]; intent: string };

export type KbEvent = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  days: number[];
  scheduleText: string;
  startTime: string | null;
  priceNote: string | null;
  ticketPrice: number | null;
  bookingUrl: string | null;
  bookingProvider: string | null;
};

export type Knowledge = {
  events: KbEvent[];
  artists: { name: string; slug: string }[];
  announcement: string | null;
};

/* ───────────────────────────── text utils ───────────────────────────── */

const STOP = new Set(
  "a an the is are am be to of for in on at and or do does did can could would will i me my we you your our it its this that what whats when which who how any there here with about please tell show shows know want need get have has".split(
    " ",
  ),
);

const SYNONYMS: Record<string, string> = {
  ticket: "ticket", tickets: "ticket", booking: "book", bookings: "book", book: "book", reserve: "book", reservation: "book", buy: "ticket", purchase: "ticket",
  price: "price", prices: "price", cost: "price", costs: "price", fee: "price", fees: "price", charge: "price", rate: "price", rates: "price", cheap: "price", expensive: "price", rupees: "price", rs: "price", inr: "price", "₹": "price",
  comedy: "comedy", comic: "comedy", comics: "comedy", comedian: "comedy", comedians: "comedy", standup: "comedy", "stand-up": "comedy", jokes: "comedy", funny: "comedy", laugh: "comedy",
  poetry: "poetry", poem: "poetry", poems: "poetry", poet: "poetry", poets: "poetry", spoken: "poetry",
  music: "music", gig: "music", gigs: "music", band: "music", bands: "music", concert: "music", concerts: "music", rap: "music", metal: "music", singer: "music", live: "live",
  open: "open", mic: "mic", mics: "mic", openmic: "openmic",
  address: "location", location: "location", located: "location", situated: "location", where: "location", directions: "location", direction: "location", map: "location", reach: "location", find: "location", khar: "location", station: "location",
  parking: "parking", park: "parking", valet: "parking", car: "parking",
  hour: "hours", hours: "hours", timing: "hours", timings: "hours",
  contact: "contact", phone: "contact", call: "contact", number: "contact", email: "contact", mail: "contact", whatsapp: "whatsapp",
  age: "age", old: "age", kid: "age", kids: "age", child: "age", children: "age", minor: "age", minors: "age", teen: "age", "18": "age", underage: "age", id: "age",
  seat: "seat", seats: "seat", seating: "seat", sit: "seat", chair: "seat",
  late: "late", entry: "entry", enter: "entry", arrive: "late", arrival: "late", gate: "entry", reentry: "entry",
  refund: "refund", refunds: "refund", cancel: "refund", cancelled: "refund", cancellation: "refund", money: "refund", exchange: "refund",
  corporate: "private", private: "private", party: "private", parties: "private", banquet: "private", banquets: "private", conference: "private", conferences: "private", seminar: "private", offsite: "private", offsites: "private", wedding: "private", birthday: "private", anniversary: "private", celebration: "private", event: "event", events: "event", hire: "private", rent: "private", team: "private",
  food: "food", menu: "food", eat: "food", drink: "food", drinks: "food", alcohol: "food", bar: "food", cuisine: "food", dinner: "food", lunch: "food", snacks: "food",
  venue: "venue", room: "venue", rooms: "venue", space: "venue", spaces: "venue", hall: "venue", stage: "venue", capacity: "capacity", people: "capacity", pax: "capacity", guests: "capacity", big: "capacity", size: "capacity",
  jam: "jam", studio: "jam", podcast: "jam", podcasts: "jam", record: "recording", recording: "recording", recordings: "recording", drum: "jam", drums: "jam", rehearse: "jam", rehearsal: "jam",
  perform: "perform", performer: "perform", performing: "perform", register: "perform", signup: "perform", slot: "perform", spot: "perform", audition: "perform",
  instagram: "social", insta: "social", youtube: "social", facebook: "social", twitter: "social", social: "social", follow: "social",
  photo: "gallery", photos: "gallery", pictures: "gallery", gallery: "gallery", video: "gallery", videos: "gallery",
  artist: "artist", artists: "artist", lineup: "lineup", "line-up": "lineup", performers: "artist",
  closed: "status", shut: "status", reopen: "status", reopened: "status", operating: "status", status: "status", running: "status",
  hi: "hello", hello: "hello", hey: "hello", hii: "hello", namaste: "hello", yo: "hello",
  thanks: "thanks", thank: "thanks", thx: "thanks", great: "thanks", awesome: "thanks", cool: "thanks",
  refundable: "refund", projector: "venue", screen: "venue", screening: "venue", screenings: "venue", sports: "venue", movie: "venue",
};

const DAY_WORDS: Record<string, number> = {
  sunday: 0, sun: 0, monday: 1, mon: 1, tuesday: 2, tue: 2, tues: 2, wednesday: 3, wed: 3, thursday: 4, thu: 4, thurs: 4, friday: 5, fri: 5, saturday: 6, sat: 6,
};

export function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9₹\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Canonical topic → number of words in the question that point at it. */
function canonCounts(tokens: string[]) {
  const out = new Map<string, number>();
  for (const t of tokens) {
    if (STOP.has(t)) continue;
    const c = SYNONYMS[t] ?? SYNONYMS[t.replace(/s$/, "")] ?? t.replace(/s$/, "");
    out.set(c, (out.get(c) ?? 0) + 1);
  }
  return out;
}

function istDay(offsetDays = 0, now = new Date()) {
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return (ist.getDay() + offsetDays + 7) % 7;
}

/* ───────────────────────────── building blocks ───────────────────────────── */

const L = {
  events: { label: "See all events", href: "/events" },
  bms: { label: "The Habitat on BookMyShow", href: site.ticketing.bookmyshow, external: true },
  contact: { label: "Contact the team", href: "/contact" },
  corporate: { label: "Private & corporate events", href: "/corporate-events" },
  enquire: { label: "Send an event enquiry", href: "/corporate-events#enquire" },
  venue: { label: "The venue", href: "/venue" },
  faq: { label: "FAQ", href: "/faq" },
  terms: { label: "Terms & conditions", href: "/terms-and-conditions" },
  refund: { label: "Refund policy", href: "/refund-policy" },
  maps: { label: "Open in Google Maps", href: site.mapsUrl, external: true },
  whatsapp: { label: "WhatsApp", href: site.social.whatsapp, external: true },
  call: { label: `Call ${site.phone}`, href: site.phoneHref, external: true },
  instagram: { label: "@indiehabitat on Instagram", href: site.social.instagram, external: true },
  youtube: { label: "YouTube channel", href: site.social.youtube, external: true },
  gallery: { label: "Gallery", href: "/gallery" },
  about: { label: "About The Habitat", href: "/about" },
} satisfies Record<string, ChatLink>;

const SCHEDULE_NOTE = "Times and prices are as last published by The Habitat; BookMyShow always has the latest.";

function price(e: KbEvent) {
  return e.priceNote ?? (e.ticketPrice != null ? `from ${formatPrice(e.ticketPrice)}` : "price on BookMyShow");
}

function eventLine(e: KbEvent) {
  return `• ${e.title}: ${e.scheduleText} (${price(e)})`;
}

function eventLinks(e: KbEvent): ChatLink[] {
  const links: ChatLink[] = [{ label: e.title, href: `/events/${e.slug}` }];
  if (e.bookingUrl) links.push({ label: e.bookingProvider?.includes("venue") ? "Find on BookMyShow" : "Book on BookMyShow", href: e.bookingUrl, external: true });
  return links;
}

function eventAnswer(e: KbEvent): ChatAnswer {
  return {
    intent: `event:${e.slug}`,
    text: `${e.title} — ${e.shortDescription}\n\n• When: ${e.scheduleText}\n• Tickets: ${price(e)}\n\n${SCHEDULE_NOTE} Entry is 18+, seating is first come, first served.`,
    links: eventLinks(e),
  };
}

function listEvents(events: KbEvent[], heading: string, intent: string): ChatAnswer {
  if (events.length === 0) {
    return {
      intent,
      text: `I couldn't find a show matching that on the current schedule. Line-ups are announced on Instagram first, and BookMyShow has the latest dates.`,
      links: [L.events, L.instagram, L.bms],
    };
  }
  const sorted = [...events].sort((a, b) => (a.startTime ?? "99").localeCompare(b.startTime ?? "99"));
  return {
    intent,
    text: `${heading}\n${sorted.map(eventLine).join("\n")}\n\n${SCHEDULE_NOTE}`,
    links: [...sorted.slice(0, 3).map((e) => ({ label: e.title, href: `/events/${e.slug}` })), L.bms],
  };
}

/* ───────────────────────────── intents ───────────────────────────── */

type Ctx = { kb: Knowledge; q: string; tokens: Set<string>; now: Date };
type Intent = { id: string; keys: string[]; phrases?: string[]; answer: (c: Ctx) => ChatAnswer };

const venue = (slug: string) => venues.find((v) => v.slug === slug)!;

const intents: Intent[] = [
  {
    id: "hello",
    keys: ["hello"],
    answer: () => ({
      intent: "hello",
      text: "Hey! I'm The Habitat's assistant. I can help with what's on, tickets and prices, the three rooms, private and corporate bookings, house rules, getting here, and how to perform at an open mic. What would you like to know?",
      links: [L.events, L.venue, L.corporate],
    }),
  },
  {
    id: "thanks",
    keys: ["thanks"],
    answer: () => ({ intent: "thanks", text: "Anytime! Enjoy the show. If you need anything else, I'm right here.", links: [L.events] }),
  },
  {
    id: "tickets",
    keys: ["ticket", "price", "book"],
    phrases: ["how much", "how do i book", "where can i book", "buy ticket"],
    answer: ({ kb }) => ({
      intent: "tickets",
      text: `Tickets for The Habitat's shows are sold on BookMyShow — every event page links straight to its listing. Prices as last published:\n${kb.events.map((e) => `• ${e.title}: ${price(e)}`).join("\n")}\n\nAn internet handling fee per ticket may be added by the ticketing site. ${SCHEDULE_NOTE}`,
      links: [L.events, L.bms],
    }),
  },
  {
    id: "comedy",
    keys: ["comedy"],
    answer: ({ kb }) => listEvents(kb.events.filter((e) => e.category.toLowerCase() === "comedy"), "Stand-up comedy at The Habitat:", "comedy"),
  },
  {
    id: "poetry",
    keys: ["poetry"],
    answer: ({ kb }) => listEvents(kb.events.filter((e) => e.category.toLowerCase() === "poetry"), "Poetry at The Habitat:", "poetry"),
  },
  {
    id: "openmic",
    keys: ["mic", "openmic"],
    phrases: ["open mic"],
    answer: ({ kb }) => {
      const mics = kb.events.filter((e) => /open mic/i.test(e.title));
      const base = listEvents(mics, "Weekly open mics:", "openmic");
      return {
        ...base,
        text: `${base.text}\n\nTo get a spot: follow @indiehabitat on Instagram — for poetry, comment "yes" on the latest open mic announcement post and wait for a DM if selected; for comedy, join the Comedy Open Mic community and the team shares the selection process.`,
        links: [...base.links.slice(0, 2), L.instagram],
      };
    },
  },
  {
    id: "music",
    keys: ["music", "live"],
    answer: () => ({
      intent: "music",
      text: "Live music happens across both rooms: The Habitat hosts intimate singer-songwriter and band sets, and Above The Habitat (160 seated / 250 standing) hosts rap, metal and alternative gigs. Both have stereo and multi-track recording. There's no music show on the current weekly schedule, so keep an eye on Instagram and BookMyShow for gigs.",
      links: [{ label: "Above The Habitat", href: "/venue/above-the-habitat" }, L.instagram, L.bms],
    }),
  },
  {
    id: "above",
    keys: ["above"],
    phrases: ["above the habitat", "upstairs", "big room"],
    answer: () => {
      const v = venue("above-the-habitat");
      return {
        intent: "above",
        text: `${v.name} — ${v.summary}\n${v.facts.map((f) => `• ${f.label}: ${f.value}`).join("\n")}\n\nLive tapings here include Son Of Abish, Amazon Prime Video stand-up specials and Aisi Taisi Democracy. Lighting: warm-white and RGB PAR LEDs with a DMX controller; PA: QSC K12.2 tops, rear fills and 4 subs.`,
        links: [{ label: v.name, href: `/venue/${v.slug}` }, { label: "Book this room", href: `/venue/${v.slug}#book` }],
      };
    },
  },
  {
    id: "jam",
    keys: ["jam", "recording"],
    phrases: ["jam room", "recording studio"],
    answer: () => {
      const v = venue("jam-room");
      return {
        intent: "jam",
        text: `The Jam Room is ideal for recording podcasts and doubles up as a jam room for scratch recordings. It's air-conditioned and soundproofed, with a Mapex Mars 5-piece kit (bring your own cymbals and hats), TS/XLR cables and corded mics.\n• Services: drum, vocal and instrument tracking\n• Jam slots: 11:30 am – 4:30 pm, Monday to Thursday\n• Bookable 24 hours in 3 slots: 9 to 4, 5 to 12 and overnight\n\nThe venue also offers live video recording with Canon 80D cameras and in-house videographers and editors.`,
        links: [{ label: v.name, href: `/venue/${v.slug}` }, { label: "Book the Jam Room", href: `/venue/${v.slug}#book` }],
      };
    },
  },
  {
    id: "venue",
    keys: ["venue", "capacity"],
    phrases: ["how many people", "how big"],
    answer: () => ({
      intent: "venue",
      text: venues.map((v) => `• ${v.name}: ${v.summary} ${v.facts.map((f) => `${f.label}: ${f.value}.`).join(" ")}`).join("\n"),
      links: [L.venue, ...venues.map((v) => ({ label: v.name, href: `/venue/${v.slug}` }))],
    }),
  },
  {
    id: "private",
    keys: ["private", "event"],
    phrases: ["corporate event", "private event", "book the venue", "hire the venue"],
    answer: () => ({
      intent: "private",
      text: "Yes — The Habitat hosts banquets and conferences, from parties to meetings to company offsites and pre-wedding functions.\n• Conferences & seminars: AM tea with snacks, lunch (veg / non-veg / mixed), PM tea\n• Cocktail functions: starters and beverage packages (non-alcoholic / alcoholic / mixed)\n• Social functions: standard lunch/dinner menus\n• Cuisines: Punjabi, Continental, Mughlai and Chinese\n• Rooms: The Habitat (55–75) or Above The Habitat (160 seated / 250 standing)\n\nPricing is shared on enquiry — send the form and the team will reply with availability.",
      links: [L.enquire, L.corporate, L.call],
    }),
  },
  {
    id: "food",
    keys: ["food"],
    answer: () => ({
      intent: "food",
      text: "For private events and banquets, The Habitat offers food and beverage packages across Punjabi, Continental, Mughlai and Chinese cuisines, including starters, lunch/dinner menus and alcoholic or non-alcoholic beverage packages. I don't have the café's à la carte menu — the team can help with that.",
      links: [L.corporate, L.call],
    }),
  },
  {
    id: "location",
    keys: ["location"],
    phrases: ["how to reach", "how do i get"],
    answer: () => ({
      intent: "location",
      text: `The Habitat is at ${fullAddress}. There's no parking or valet at the venue, so plan to arrive by cab or train, at least 30 minutes before the show.`,
      links: [L.maps, L.contact],
    }),
  },
  {
    id: "parking",
    keys: ["parking"],
    answer: () => ({ intent: "parking", text: "There's no parking or valet provision at the venue — a cab or train is the easiest way in.", links: [L.maps] }),
  },
  {
    id: "hours",
    keys: ["hours"],
    phrases: ["what time do you open", "opening hours", "when do you open", "when are you open", "what time do you close"],
    answer: () => ({ intent: "hours", text: `The Habitat is open ${site.hours}. Individual show times are on each event page.`, links: [L.events, L.contact] }),
  },
  {
    id: "contact",
    keys: ["contact", "whatsapp"],
    answer: () => ({
      intent: "contact",
      text: `• Phone: ${site.phone}\n• Feedback: ${site.feedbackPhone}\n• Email: ${site.email}\n• WhatsApp: available via the link below\n• Hours: ${site.hours}`,
      links: [L.call, L.whatsapp, L.contact],
    }),
  },
  {
    id: "age",
    keys: ["age"],
    answer: () => ({
      intent: "age",
      text: "Shows are 18+ only. A government-issued ID may be asked for at the gate, and if entry is denied for being under age, no refund is issued — so under-18s can't attend.",
      links: [L.terms, L.faq],
    }),
  },
  {
    id: "seating",
    keys: ["seat"],
    answer: () => ({
      intent: "seating",
      text: "Seating is free and first come, first served — there are no seat numbers, and a different ticket price doesn't mean a different seating area. Arriving 30 minutes early gets you the best pick.",
      links: [L.faq, L.terms],
    }),
  },
  {
    id: "entry",
    keys: ["late", "entry"],
    answer: () => ({
      intent: "entry",
      text: "Please arrive at least 30 minutes before the show. Entry shuts 5 minutes after the show starts and late entry isn't allowed. You can step out to the washrooms, but re-entry into the show isn't permitted so performers aren't disturbed.",
      links: [L.terms],
    }),
  },
  {
    id: "refund",
    keys: ["refund"],
    answer: () => ({
      intent: "refund",
      text: "Tickets once booked can't be exchanged or refunded. If a show is cancelled, the refund is processed within 7–10 working days from confirmation of the cancellation.",
      links: [L.refund, L.terms],
    }),
  },
  {
    id: "perform",
    keys: ["perform"],
    phrases: ["can i perform", "get a spot", "stage time"],
    answer: () => ({
      intent: "perform",
      text: "Two ways in:\n• Open mics — Comedy Open Mic (Mondays 7 pm & 9 pm) and Poetry Open Mic (Sundays 2 pm, Mondays 8 pm). Registration happens through @indiehabitat on Instagram.\n• Pitch a show — send the team a message choosing “Perform at The Habitat”.",
      links: [{ label: "Pitch your show", href: "/contact" }, L.instagram, { label: "Open mic nights", href: "/events?q=open+mic" }],
    }),
  },
  {
    id: "social",
    keys: ["social"],
    answer: () => ({
      intent: "social",
      text: "Line-ups drop on Instagram first (@indiehabitat). Recorded sets and videos are on the YouTube channel, and there's a WhatsApp community too.",
      links: [L.instagram, L.youtube, L.whatsapp],
    }),
  },
  {
    id: "gallery",
    keys: ["gallery"],
    answer: () => ({ intent: "gallery", text: "Have a look around — stages, crowds, private events and the jam room are all in the gallery.", links: [L.gallery, L.instagram] }),
  },
  {
    id: "artist",
    keys: ["artist", "lineup"],
    phrases: ["who is performing", "whos performing", "who's performing"],
    answer: ({ kb }) =>
      kb.artists.length
        ? { intent: "artist", text: `Artists featured on the site:\n${kb.artists.map((a) => `• ${a.name}`).join("\n")}`, links: [{ label: "Artists", href: "/artists" }, ...kb.artists.slice(0, 2).map((a) => ({ label: a.name, href: `/artists/${a.slug}` }))] }
        : {
            intent: "artist",
            text: "Line-ups change show to show and many shows include surprise acts, so I don't have names to share. Line-ups are announced on @indiehabitat on Instagram, and each BookMyShow listing shows the current billing.",
            links: [L.instagram, L.bms],
          },
  },
  {
    id: "status",
    keys: ["status"],
    phrases: ["are you open", "is it open", "still open", "still running"],
    answer: ({ kb }) => ({
      intent: "status",
      text: `${kb.announcement ?? SCHEDULE_NOTE} For today's status, the quickest check is BookMyShow or a call to ${site.phone}.`,
      links: [L.bms, L.call],
    }),
  },
  {
    id: "about",
    keys: [],
    phrases: ["what is the habitat", "tell me about", "who are you"],
    answer: () => ({
      intent: "about",
      text: `${site.description} It's known for its live recording services — several stand-up specials, comedy gigs and poetry videos have been recorded live here.`,
      links: [L.about, L.venue, L.events],
    }),
  },
];

/* ───────────────────────────── matcher ───────────────────────────── */

const EVENT_ALIASES: Record<string, string[]> = {
  "all-star-standup-comedy": ["all star", "allstar", "10 pm", "10pm"],
  "midnight-all-star-standup-comedy": ["midnight", "last comedy show", "late night", "latenight", "12 am", "11:59"],
  "mass-bunk": ["mass bunk", "massbunk", "bunk", "student"],
  "comedy-roulette": ["roulette"],
  "poetry-open-mic": ["poetry open mic"],
  "comedy-open-mic": ["comedy open mic"],
};

function scoreEvent(e: KbEvent, raw: string, tokens: Set<string>) {
  let s = 0;
  const title = e.title.toLowerCase();
  if (raw.includes(title)) s += 8;
  for (const a of EVENT_ALIASES[e.slug] ?? []) if (raw.includes(a)) s += 6;
  for (const w of tokenize(title)) if (!STOP.has(w) && w.length > 3 && tokens.has(SYNONYMS[w] ?? w)) s += 1;
  return s;
}

function dayQuery(raw: string, now: Date): { days: number[]; label: string } | null {
  if (/\b(tonight|today)\b/.test(raw)) return { days: [istDay(0, now)], label: `today (${DAY_NAMES[istDay(0, now)]})` };
  if (/\btomorrow\b/.test(raw)) return { days: [istDay(1, now)], label: `tomorrow (${DAY_NAMES[istDay(1, now)]})` };
  if (/\bweekend\b/.test(raw)) return { days: [5, 6, 0], label: "this weekend (Fri–Sun)" };
  for (const w of tokenize(raw)) if (w in DAY_WORDS) return { days: [DAY_WORDS[w]], label: DAY_NAMES[DAY_WORDS[w]] };
  return null;
}

/** Answers a question from verified knowledge only. */
export function answerQuestion(question: string, kb: Knowledge, now = new Date()): ChatAnswer {
  const raw = question.toLowerCase().trim().slice(0, 500);
  const toks = tokenize(raw);
  const counts = canonCounts(toks);
  const tokens = new Set(counts.keys());

  if (!raw) return intents[0].answer({ kb, q: raw, tokens, now });

  // 1) A specific show named?
  const bestEvent = kb.events
    .map((e) => ({ e, s: scoreEvent(e, raw, tokens) }))
    .sort((a, b) => b.s - a.s)[0];
  // "comedy open mic" / "poetry open mic" outrank the generic open-mic intent
  if (bestEvent && bestEvent.s >= 6) return eventAnswer(bestEvent.e);

  // 2) Day-based "what's on" questions
  const dq = dayQuery(raw, now);
  if (dq && !tokens.has("hours")) {
    let list = kb.events.filter((e) => e.days.some((d) => dq.days.includes(d)));
    if (tokens.has("comedy")) list = list.filter((e) => e.category.toLowerCase() === "comedy");
    if (tokens.has("poetry")) list = list.filter((e) => e.category.toLowerCase() === "poetry");
    return listEvents(list, `On ${dq.label}:`, "day");
  }
  if (/\b(what'?s on|whats on|what is on|happening|upcoming|schedule|line ?up for)\b/.test(raw)) {
    return listEvents(kb.events, "Here's the weekly line-up:", "schedule");
  }

  // 3) Topic intents
  let best: { i: Intent; s: number } | null = null;
  for (const i of intents) {
    let s = 0;
    for (const k of i.keys) s += 2 * (counts.get(k) ?? 0);
    for (const p of i.phrases ?? []) if (raw.includes(p)) s += 3;
    // greetings only win when nothing else matched
    if (i.id === "hello" || i.id === "thanks") s = s > 0 && toks.length <= 4 ? s : s > 0 ? 0.5 : 0;
    if (!best || s > best.s) best = { i, s };
  }
  if (best && best.s >= 2) return best.i.answer({ kb, q: raw, tokens, now });
  if (best && best.s > 0) return best.i.answer({ kb, q: raw, tokens, now });

  // 4) Weak event match as a last resort
  if (bestEvent && bestEvent.s >= 2) return eventAnswer(bestEvent.e);

  return {
    intent: "fallback",
    text: `I don't have that detail in what The Habitat has published, and I'd rather not guess. The team can help directly — call ${site.phone} (${site.hours}) or send a message. I can tell you about shows, tickets, the rooms, private events, house rules or how to get here.`,
    links: [L.contact, L.call, L.faq],
  };
}

/** Plain-text knowledge base for the optional Claude mode's system prompt. */
export function knowledgeText(kb: Knowledge, faqs: { q: string; a: string }[]) {
  const ev = kb.events
    .map((e) => `- ${e.title} [${e.category}] — ${e.shortDescription} Schedule: ${e.scheduleText}. Tickets: ${price(e)}. Page: /events/${e.slug}.`)
    .join("\n");
  const rooms = venues
    .map((v) => `- ${v.name}: ${v.summary} ${v.body.join(" ")} Facts: ${v.facts.map((f) => `${f.label}: ${f.value}`).join("; ")}. Specs: ${v.specs.map((s) => `${s.title}: ${s.items.join(", ")}`).join(" | ")}. Page: /venue/${v.slug}.`)
    .join("\n");
  return [
    `# ${site.name} — ${site.tagline}`,
    site.description,
    `Address: ${fullAddress}. Hours: ${site.hours}. Phone: ${site.phone}. Feedback: ${site.feedbackPhone}. Email: ${site.email}. No parking or valet.`,
    `Tickets: sold on BookMyShow (${site.ticketing.bookmyshow}). Instagram: @indiehabitat. Operator: ${site.legalName}.`,
    `Current site notice: ${kb.announcement ?? "none"}`,
    `\n## Weekly shows (as last published by the venue; confirm on BookMyShow)\n${ev || "- none listed"}`,
    `\n## Rooms\n${rooms}`,
    `\n## Private & corporate events\nConferences/seminars (AM tea with snacks, lunch veg/non-veg/mixed, PM tea); cocktail functions (starters and beverage packages, non-alcoholic/alcoholic/mixed); social functions (lunch/dinner menus); add-ons customisable. Cuisines: Punjabi, Continental, Mughlai, Chinese. Pricing on enquiry via /corporate-events#enquire.`,
    `\n## Open mic registration\nPoetry: go to @indiehabitat on Instagram, comment "yes" on the latest poetry open mic announcement, wait for a DM if selected. Comedy: join the Comedy Open Mic community via @indiehabitat; the team shares the selection process.`,
    `\n## FAQ (house rules, refunds)\n${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}`,
    kb.artists.length ? `\n## Artists on the site\n${kb.artists.map((a) => `- ${a.name} (/artists/${a.slug})`).join("\n")}` : "\n## Artists\nNo artist profiles are published; line-ups are announced on Instagram.",
  ].join("\n");
}

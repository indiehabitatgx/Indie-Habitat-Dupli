/**
 * Seeds ONLY verified content from indiehabitat.com (audit: research/website-audit.md).
 * Idempotent: safe to run repeatedly (upserts by slug / key).
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

// Seeding is an admin task: use the direct connection when available (Neon), else DATABASE_URL (local Postgres).
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL }) });

const BMS_VENUE = "https://in.bookmyshow.com/venue/the-habitat-mumbai/TFST";

// Quoted from /terms-and-conditions and /refund-policy on indiehabitat.com.
const REFUND_TERMS = [
  "Entry is permitted to ages 18+ only. A government-issued ID may be requested at the gate.",
  "Seats are first come, first served — free seating only. Different ticket categories/prices do not indicate a different seating area.",
  "Entry to the venue shuts 5 minutes after the show starts. Re-entry is not allowed during the show.",
  "We recommend arriving at least 30 minutes before the show. There is no parking/valet at the venue.",
  "Line-up or billed attractions are subject to change without prior intimation.",
  "Tickets once booked cannot be exchanged or refunded. If a show/event is cancelled, the refund is processed within 7–10 working days from confirmation of the cancellation.",
  "Rights of admission reserved.",
].join("\n");

const categories = [
  { name: "Comedy", slug: "comedy", sortOrder: 1 },
  { name: "Music", slug: "music", sortOrder: 2 },
  { name: "Poetry", slug: "poetry", sortOrder: 3 },
  { name: "Storytelling", slug: "storytelling", sortOrder: 4 },
  { name: "Special Events", slug: "special-events", sortOrder: 5 },
];

const venues = [
  {
    slug: "the-habitat",
    name: "The Habitat",
    summary: "An intimate 55–70 seater for music, standup comedy, poetry and alternate events.",
    capacity: "55 seated with tables · 75 without tables",
    image: "/images/venue/the-habitat-stage.webp",
    sortOrder: 1,
  },
  {
    slug: "above-the-habitat",
    name: "Above The Habitat",
    summary: "A 150–250 capacity venue for gigs, Comedy Specials and for Recordings.",
    capacity: "160 seated (theatre style) · 250 standing",
    image: "/images/venue/above-the-habitat-stage.webp",
    sortOrder: 2,
  },
  {
    slug: "jam-room",
    name: "The Jam Room",
    summary: "Ideal for recording podcasts and also doubles up as a Jam Room.",
    capacity: null,
    image: "/images/venue/jam-room.webp",
    sortOrder: 3,
  },
];

type SeedEvent = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  w: number;
  h: number;
  scheduleDays: number[];
  scheduleText: string;
  startTime: string;
  ticketPrice: number;
  priceNote: string;
  bookingUrl: string;
  bookingProvider: string;
  featured: boolean;
  sortOrder: number;
};

// Descriptions are quoted from the site; "From the poster" lines are transcribed from the official posters.
const events: SeedEvent[] = [
  {
    slug: "all-star-standup-comedy",
    title: "All Star Standup Comedy",
    category: "comedy",
    shortDescription: "The best in stand-up comedy performing fresh material. May or may not include surprise acts.",
    description:
      "Start the week with the best in Stand-up Comedy performing fresh material – may or may not include surprise acts.\n\nFrom the poster: 4 acts, 20 mins each. Includes surprise spots by the best in standup comedy. Fresh jokes only.",
    image: "/images/events/all-star-standup-comedy.webp",
    w: 1200,
    h: 1697,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    scheduleText: "Daily · 10:00 PM",
    startTime: "22:00",
    ticketPrice: 300,
    priceNote: "Mon–Fri ₹300 · Sat–Sun ₹500",
    bookingUrl: "https://in.bookmyshow.com/events/all-star-standup-comedy/ET00327409",
    bookingProvider: "BookMyShow",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "midnight-all-star-standup-comedy",
    title: "Midnight All Star Standup Comedy",
    category: "comedy",
    shortDescription: "The last comedy show in the city — the best in stand-up, every night at midnight.",
    description:
      "The best in Stand-up Comedy performing their best material from Monday to Sunday. May or may not include surprise acts.\n\nFrom the poster: Jokes best for a happy high weeknight. Every night at 11:59 PM.",
    image: "/images/events/midnight-all-star-standup-comedy.webp",
    w: 1200,
    h: 1697,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    scheduleText: "Every night · midnight",
    startTime: "23:59",
    ticketPrice: 300,
    priceNote: "Mon–Fri ₹300 · Sat–Sun ₹500",
    bookingUrl: "https://in.bookmyshow.com/events/last-comedy-show-in-the-city/ET00336827",
    bookingProvider: "BookMyShow",
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "mass-bunk",
    title: "Mass Bunk",
    category: "comedy",
    shortDescription:
      "The uproarious stand-up show that celebrates the spirit of students everywhere — the only attendance required is to laugh.",
    description:
      "Get ready to unleash your inner rebel and embark on a laughter-filled adventure with “Mass Bunk,” the uproarious stand-up comedy show that celebrates the spirit of students everywhere.\n\nAn hour-long showcase of some of the best in the standup comedy circuit sharing the freshest jokes just for you, so step into a world where the only attendance required is to laugh till your sides ache!",
    image: "/images/events/mass-bunk.webp",
    w: 500,
    h: 750,
    scheduleDays: [5, 6, 0],
    scheduleText: "Fri 6:00 PM · Sat & Sun 4:00 PM",
    startTime: "16:00",
    ticketPrice: 199,
    priceNote: "Every Friday, Saturday & Sunday · ₹199",
    bookingUrl: "https://in.bookmyshow.com/events/mass-bunk-stand-up-comedy/ET00365779",
    bookingProvider: "BookMyShow",
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "comedy-roulette",
    title: "Comedy Roulette",
    category: "comedy",
    shortDescription: "Any 5–6 hand-picked comics from the poster, plus a host to tie them together.",
    description:
      "We've handpicked the best stand-up comics out there for an evening filled with laughter just for you! Any 5–6 acts from the poster along with a host to tie them together – the lineup brings to you almost 2 hours of guaranteed fun every Thursday and Friday. Get a chance to watch the best-curated line-ups which may include some of the most sought after comics on this side of the hemisphere.\n\nFrom the poster: 90 mins+ of laughter amongst the best new comics + surprise acts.",
    image: "/images/events/comedy-roulette.webp",
    w: 1200,
    h: 1697,
    scheduleDays: [4, 5],
    scheduleText: "Thu & Fri · 8:00 PM",
    startTime: "20:00",
    ticketPrice: 300,
    priceNote: "Every Thursday & Friday · ₹300",
    bookingUrl: "https://in.bookmyshow.com/events/comedy-roulette/ET00308527",
    bookingProvider: "BookMyShow",
    featured: true,
    sortOrder: 4,
  },
  {
    slug: "poetry-open-mic",
    title: "Poetry Open Mic",
    category: "poetry",
    shortDescription: "A weekly celebration of poetic expression, where words come alive and emotions unfold.",
    description:
      "Join us every Sunday at 2pm and Monday at 8pm at The Habitat for a captivating Poetry Open Mic, where words come alive and emotions unfold. Immerse yourself in the rhythm of verse and share your soul on stage in this weekly celebration of poetic expression.\n\nHow to register (from the poster): Step 1 — go to @indiehabitat on Instagram. Step 2 — look for the latest poetry open mic announcement post and comment \"yes\". Step 3 — wait for a DM with the details in case you're selected.\n\nCan't come? Watch the livestream on YouTube @thehabitatstudios.",
    image: "/images/events/poetry-open-mic.webp",
    w: 1200,
    h: 1697,
    scheduleDays: [0, 1],
    scheduleText: "Sun 2:00 PM · Mon 8:00 PM",
    startTime: "14:00",
    ticketPrice: 250,
    priceNote: "Ticket cost · ₹250",
    bookingUrl: BMS_VENUE,
    bookingProvider: "BookMyShow venue page",
    featured: false,
    sortOrder: 5,
  },
  {
    slug: "comedy-open-mic",
    title: "Comedy Open Mic",
    category: "comedy",
    shortDescription: "Monday comedy open mic nights at 7pm and 9pm — non-stop laughs and good vibes.",
    description:
      "Embark on a laughter-filled journey every Monday at The Habitat, as we present Comedy Open Mic nights at 7pm and 9pm. Join us for an exclusive weekly celebration of comedic expression that promises non-stop laughs and good vibes!\n\nHow to register (from the poster): Step 1 — go to @indiehabitat on Instagram. Step 2 — join the Comedy Open Mic community. Step 3 — wait for the team to share details and the selection process for the upcoming show.",
    image: "/images/events/comedy-open-mic.webp",
    w: 1200,
    h: 1697,
    scheduleDays: [1],
    scheduleText: "Mon · 7:00 PM & 9:00 PM",
    startTime: "19:00",
    ticketPrice: 300,
    priceNote: "Ticket cost · ₹300",
    bookingUrl: BMS_VENUE,
    bookingProvider: "BookMyShow venue page",
    featured: false,
    sortOrder: 6,
  },
];

const gallery = [
  { title: "The Habitat stage", alt: "Mic stand and bar stool in front of the circled-H logo on The Habitat's slatted timber wall", src: "/images/venue/the-habitat-stage.webp", width: 1114, height: 626, category: "Venue" },
  { title: "Above The Habitat", alt: "Wide low stage against an exposed brick wall with rows of chairs in a dark room", src: "/images/venue/above-the-habitat-stage.webp", width: 1920, height: 1080, category: "Venue" },
  { title: "The audience", alt: "Audience members seen from behind, one laughing with head thrown back during a show", src: "/images/gallery/audience.webp", width: 2000, height: 1180, category: "Comedy" },
  { title: "Stage, black & white", alt: "Black-and-white view of the empty Habitat stage with mic stand and logo", src: "/images/hero/stage-bw.webp", width: 1920, height: 1080, category: "Comedy" },
  { title: "Dressed for a celebration", alt: "Stage decorated with red and gold drapes, fairy lights, flowers and two ornate chairs", src: "/images/gallery/stage-decor.webp", width: 2000, height: 1334, category: "Events" },
  { title: "Celebration table", alt: "Pink tiered cake with flowers beside a bottle of champagne and glasses", src: "/images/gallery/celebration.webp", width: 2000, height: 1333, category: "Events" },
  { title: "Community meet-up", alt: "A large group seated around long tables in the café for a meeting", src: "/images/gallery/community-meetup.webp", width: 2000, height: 1333, category: "Community" },
  { title: "Terrace seating", alt: "Outdoor terrace tables with orange and blue chairs under a vine-covered trellis at night", src: "/images/venue/terrace.webp", width: 978, height: 650, category: "Venue" },
  { title: "The Jam Room", alt: "Drum kit and mic stands in a room lined with navy acoustic panels", src: "/images/venue/jam-room.webp", width: 1280, height: 720, category: "Studio" },
];

const videos = [
  { title: "ABDC Show 02 — The Habitat fill-up timelapse", alt: "Timelapse of The Habitat filling up before a show", src: "/images/backgrounds/video-abdc-timelapse.webp", videoId: "Nuy-v8M6ong", category: "Comedy" },
  { title: "prabhdeep (video by Mongrel Design)", alt: "Video still: prabhdeep", src: "/images/backgrounds/video-prabhdeep.webp", videoId: "JgSaV2NDqHI", category: "Music" },
  { title: "Jam Room @ The Habitat", alt: "Video still of the Jam Room", src: "/images/backgrounds/video-jam-room.webp", videoId: "MP9vWWP186w", category: "Studio" },
];

async function main() {
  for (const c of categories) {
    await db.eventCategory.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  for (const v of venues) {
    await db.venue.upsert({ where: { slug: v.slug }, update: v, create: v });
  }
  const cats = Object.fromEntries((await db.eventCategory.findMany()).map((c) => [c.slug, c.id]));

  for (const e of events) {
    const data = {
      title: e.title,
      shortDescription: e.shortDescription,
      description: e.description,
      bannerImage: e.image,
      thumbnailImage: e.image,
      posterWidth: e.w,
      posterHeight: e.h,
      categoryId: cats[e.category],
      venueId: null, // the original site does not say which room each show uses
      recurrence: "WEEKLY" as const,
      scheduleDays: e.scheduleDays,
      scheduleText: e.scheduleText,
      startTime: e.startTime,
      ticketPrice: e.ticketPrice,
      priceNote: e.priceNote,
      bookingUrl: e.bookingUrl,
      bookingProvider: e.bookingProvider,
      terms: REFUND_TERMS,
      status: "PUBLISHED" as const,
      featured: e.featured,
      sortOrder: e.sortOrder,
      seoTitle: `${e.title} at The Habitat, Mumbai`.slice(0, 70),
      seoDescription: e.shortDescription.slice(0, 160),
    };
    // Create-only: never overwrite edits made in the admin panel. Set SEED_RESET=1 to restore the audited originals.
    await db.event.upsert({ where: { slug: e.slug }, update: process.env.SEED_RESET === "1" ? data : {}, create: { slug: e.slug, ...data } });
  }

  if ((await db.galleryImage.count()) === 0) {
    let i = 0;
    for (const g of gallery) await db.galleryImage.create({ data: { ...g, sortOrder: i++ } });
    for (const v of videos)
      await db.galleryImage.create({ data: { ...v, width: 1280, height: 720, mediaType: "VIDEO", sortOrder: i++ } });
  }

  await db.siteSetting.upsert({
    where: { key: "announcementEnabled" },
    update: {},
    create: { key: "announcementEnabled", value: "true" },
  });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && (await db.adminUser.count()) === 0) {
    await db.adminUser.create({
      data: { email: email.toLowerCase(), name: "Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`Created admin user ${email}`);
  }

  console.log(
    `Seeded: ${await db.eventCategory.count()} categories, ${await db.venue.count()} venues, ${await db.event.count()} events, ${await db.galleryImage.count()} gallery items`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

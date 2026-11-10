// One-off sync of The Habitat's current BookMyShow listings (from the venue page saved on 11 Nov 2026).
// BookMyShow's venue page lists names, categories and links only — no dates, times or prices — so those
// stay unset here and the site points people to BookMyShow for showtimes.
// Usage: node --env-file=.env scripts/sync-bookmyshow.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
const BMS = "https://in.bookmyshow.com";
const CDN = "https://assets-in.bmscdn.com/discovery-catalog/events/";

// [title, BMS path, category, poster file on BMS CDN (null if not in the saved page)]
const SHOWS = [
  ["All Star Standup Comedy", "/events/all-star-standup-comedy-february-onwards/ET00429759", "comedy", "et00429759-nypedvnsdq-portrait.jpg", "all-star-standup-comedy"],
  ["Midnight All Stars", "/events/midnight-all-stars-february-onwards/ET00429710", "comedy", null, "midnight-all-star-standup-comedy"],
  ["Ufff... Yellam Sari Agidum", "/plays/ufff-yellam-sari-agidum/ET00490625", "storytelling", "et00490625-fzusxgfavx-portrait.jpg"],
  ["FUGLIES - A Standup Comedy Lineup Show", "/events/fuglies-a-standup-comedy-lineup-show/ET00520306", "comedy", "et00520306-yqxvpcpssz-portrait.jpg"],
  ["Rohan Gujral Live", "/events/rohan-gujral-live/ET00453600", "comedy", "et00453600-xhymxrcxmr-portrait.jpg"],
  ["In Darkness & In Death: A Supernatural Storytelling", "/plays/in-darkness-in-death-a-supernatural-storytellin/ET00521144", "storytelling", "et00521144-cfcpbvlclk-portrait.jpg"],
  ["Last Two Braincells", "/events/last-two-braincells/ET00525109", "comedy", "et00525109-jjfvbtttac-portrait.jpg"],
  ["Son of Abish", "/events/son-of-abish/ET00509205", "comedy", "et00509205-yfaluvhmqd-portrait.jpg"],
  ["Yuvaa Shayar LIVE", "/plays/yuvaa-shayar-live/ET00524697", "poetry", "et00524697-dqqupkepdd-portrait.jpg"],
  ["Not a Crowdwork Comedy Show", "/events/not-a-crowdwork-comedy-show-february-onwards/ET00429805", "comedy", "et00429805-ycrlljgqfx-portrait.jpg"],
  ["Rajdhani Express ft. Manish & Harsh", "/events/rajdhani-express-ft-manish-harsh/ET00524716", "special-events", "et00524716-vhlsjxajcb-portrait.jpg"],
  ["Gujarati All Stars", "/events/gujarati-all-stars/ET00521804", "comedy", "et00521804-xrekgdsffu-portrait.jpg"],
  ["Bete Khwaab Dekho Tum by Vimal Chitra", "/events/bete-khwaab-dekho-tum-by-vimal-chitra/ET00522332", "poetry", "et00522332-ysduslelrn-portrait.jpg"],
  ["Almost All Stars - Standup Comedy", "/events/almost-all-stars-standup-comedy/ET00429762", "comedy", "et00429762-lmybfsldtp-portrait.jpg"],
  ["Maa Da Laadla - A Story by Parminder", "/plays/maa-da-laadla-a-story-by-parminder/ET00523420", "storytelling", "et00523420-bmhcrsvdns-portrait.jpg"],
  ["Beta Male by Varun Nair", "/events/beta-male/ET00514711", "comedy", "et00514711-bfphjttnmk-portrait.jpg"],
  ["Rameshwaram - Your Emotions in the Ramayan", "/plays/rameshwaram-your-emotions-in-the-ramayan/ET00524108", "storytelling", "et00524108-tpachbkbqt-portrait.jpg"],
  ["Say My Name", "/events/say-my-name/ET00523393", "special-events", "et00523393-ccnllrkcjp-portrait.jpg"],
  ["Storytellers Night", "/plays/storytellers-night/ET00433227", "storytelling", "et00433227-tapnaqpwzm-portrait.jpg"],
  ["Don Pidhya Donhi Vedya", "/events/don-pidhya-donhi-vedya/ET00522221", "comedy", "et00522221-quaequnpjl-portrait.jpg"],
  ["Father of None: Ankit Arora Live", "/events/feminist-a-stand-up-comedy-show-by-ankit-arora/ET00341017", "comedy", "et00341017-awzctvsvbd-portrait.jpg"],
  ["The Poetry Lineup", "/plays/the-poetry-lineup/ET00438053", "poetry", null],
  ["Vinay Sharma Live", "/events/vinay-sharma-live/ET00494576", "comedy", null],
  ["Karan Singh Magic: 13", "/events/karan-singh-magic-13/ET00514327", "special-events", null],
  ["Manish Chaudhary Live", "/plays/manish-chaudhary-live/ET00524701", "storytelling", null],
  ["Gaurav Aher's Adopted Opinions - A Stand-Up Solo", "/events/gaurav-aher-s-adopted-opinions-a-stand-up-solo/ET00510349", "comedy", null],
  ["Rock Bottom - A Standup Solo by Shubham Pujari", "/events/chhoti-soch-a-standup-solo-by-shubham-pujari/ET00479853", "comedy", null],
  ["Ashwyn Singh: The Imperfect Ally Tour", "/events/ashywn-singh-the-imperfect-ally-tour/ET00523130", "comedy", null],
  ["AIR 1: Standup Comedy by Harshit Mahawar", "/events/linkedin-park/ET00428344", "comedy", null],
  ["Everything, in Time by Shreyash Patil", "/plays/everything-in-time-by-shreyash-pati/ET00524845", "storytelling", null],
  ["Shlok Oza Live", "/events/shlok-oza-live/ET00522116", "comedy", null],
  ["OML Comedy Pit Stop", "/events/oml-comedy-show/ET00312421", "comedy", null],
  ["Never See You 2026", "/events/never-see-you-2026/ET00525320", "comedy", null],
];

const KIND = { comedy: "Stand-up comedy", storytelling: "Storytelling", poetry: "Poetry", "special-events": "A special act" };
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cats = Object.fromEntries((await sql`select id, slug from "EventCategory"`).map((c) => [c.slug, c.id]));
const venue = (await sql`select id from "Venue" where name = 'The Habitat'`)[0]?.id ?? null;
const outDir = path.join(process.cwd(), "public/images/events/bms");
await mkdir(outDir, { recursive: true });

const keep = [];
let order = 0;
for (const [title, bmsPath, cat, posterFile, existingSlug] of SHOWS) {
  const slug = existingSlug ?? slugify(title);
  keep.push(slug);
  order += 1;

  let image = null, w = null, h = null;
  if (posterFile) {
    const res = await fetch(CDN + posterFile);
    if (res.ok) {
      const buf = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const meta = await sharp(buf).metadata();
      await writeFile(path.join(outDir, `${slug}.webp`), buf);
      image = `/images/events/bms/${slug}.webp`;
      w = meta.width; h = meta.height;
    } else console.warn(`poster ${posterFile}: HTTP ${res.status}`);
  }

  const kind = KIND[cat];
  const short = `${kind} at The Habitat, Khar West. Check BookMyShow for show dates, timings and tickets.`;
  const desc = `${title} is on at The Habitat, Mumbai's home for stand-up, poetry, storytelling and music in Khar West.\n\nShow dates, timings and ticket prices are listed on BookMyShow, where you can book your seats.`;
  const bookingUrl = BMS + bmsPath;
  const featured = Boolean(image) && order <= 9;

  const existing = (await sql`select id, "scheduleText", "ticketPrice", "thumbnailImage" from "Event" where slug = ${slug}`)[0];
  if (existing) {
    // Keep the schedule/price/poster we already published for long-running shows; refresh title, link and status.
    await sql`update "Event" set title = ${title}, "bookingUrl" = ${bookingUrl}, "bookingProvider" = 'BookMyShow',
      status = 'PUBLISHED', featured = ${true}, "sortOrder" = ${order},
      "thumbnailImage" = coalesce(${image}, "thumbnailImage"), "bannerImage" = coalesce(${image}, "bannerImage"),
      "posterWidth" = coalesce(${w}, "posterWidth"), "posterHeight" = coalesce(${h}, "posterHeight"), "updatedAt" = now()
      where id = ${existing.id}`;
    console.log(`updated   ${slug}`);
  } else {
    await sql`insert into "Event" (id, title, slug, "shortDescription", description, "bannerImage", "thumbnailImage",
      "posterWidth", "posterHeight", "categoryId", "venueId", recurrence, "scheduleDays", "scheduleText",
      "bookingUrl", "bookingProvider", status, featured, "sortOrder", "updatedAt")
      values (${"bms" + bmsPath.split("/").pop().toLowerCase()}, ${title}, ${slug}, ${short}, ${desc}, ${image}, ${image},
      ${w}, ${h}, ${cats[cat]}, ${venue}, 'WEEKLY', ${[]}, ${"Dates & times on BookMyShow"},
      ${bookingUrl}, 'BookMyShow', 'PUBLISHED', ${featured}, ${order}, now())
      on conflict (slug) do nothing`;
    console.log(`created   ${slug}${image ? "" : "  (no poster)"}`);
  }
}

// Anything published that is no longer on BookMyShow goes back to draft (kept, not deleted).
const hidden = await sql`update "Event" set status = 'DRAFT', featured = false, "updatedAt" = now()
  where status = 'PUBLISHED' and slug <> all(${keep}) returning slug`;
for (const r of hidden) console.log(`drafted   ${r.slug}`);
console.log(`\n${keep.length} live, ${hidden.length} moved to draft`);

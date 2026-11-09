# Website Audit — indiehabitat.com

Audit date: 9 November 2026
Auditor: rebuild team (automated fetch + manual review)

Legend: **[V]** = verified directly on indiehabitat.com on the audit date · **[P]** = verified in third‑party press/listings · **[I]** = inferred, not verified · **[?]** = unknown / missing

---

## 1. Availability

| URL | Result |
|---|---|
| `https://indiehabitat.com/` | **[V]** HTTP 200, live (WordPress) |
| `https://www.indiehabitat.com/` | **[V]** 301 → `https://indiehabitat.com/` |
| Wayback Machine CDX API | Timed out during audit — not needed, live site was available |

**Platform [V]:** WordPress, theme *Spark* (Visualmodo) + child theme, WPBakery (`js_composer`), Ultimate VC Addons, Contact Form 7, Instagram Feed Pro (broken: shows *"There is no connected account"* to visitors), YourChannel (YouTube), Shortcodes Ultimate, Akismet. Email addresses are obfuscated via Cloudflare.

### Operating status — IMPORTANT
- **[P]** In March 2025 the venue was vandalised after a Kunal Kamra show recorded there; it then announced a temporary closure ([Hollywood Reporter India](https://www.hollywoodreporterindia.com/features/insight/kunal-kamra-row-habitat-comedy-club-shuts-down-cm-devendra-fadnavis-reacts), [Exchange4media](https://www.exchange4media.com/media-others-news/habitat-comedy-club-shuts-down-over-artistic-freedom-and-security-concerns-142012.html), [Newslaundry](https://www.newslaundry.com/2025/03/24/january-show-march-upload-sunday-night-raid-mumbai-clubs-fall-after-kunal-kamras-joke)).
- **[?]** No public report of reopening was found. The live site still shows its weekly schedule and a COVID‑era line ("Safe, sterilised and socially‑distanced shows"), so the schedule is probably out of date.
- **Decision:** the rebuild shows the schedule *as last published*, sends every booking to the real BookMyShow page, and has an **admin‑editable status notice** (announcement bar). The rebuild never states that shows are currently running or that the venue is closed. **The client must confirm status before launch.**

## 2. Discovered pages [V]

| Original URL | Title / purpose | New route |
|---|---|---|
| `/` | "Habitat – Comedy and Music Cafe" — one‑page home with anchors `#EVENTS #VIDEOS #VENUE #FOOD #CONTACT` | `/` |
| `/the-habitat/` | The Habitat (main room) specs + booking form + video | `/venue/the-habitat` (301 from old URL) |
| `/above-the-habitat/` | Above The Habitat specs + booking form + video | `/venue/above-the-habitat` (301) |
| `/jam-room/` | Jam Room / recording studio + booking form + video | `/venue/jam-room` (301) |
| `/banquets-conferences/` | Banquets & conferences packages + floor plans + enquiry form | `/corporate-events` (301) |
| `/privacy-policy/` | Privacy policy | `/privacy-policy` |
| `/terms-and-conditions/` | Terms | `/terms-and-conditions` |
| `/refund-policy/` | Refund policy | `/refund-policy` (+ `/cancellation-policy` 301) |

There are no artist, gallery, FAQ, press or careers pages on the original site.

## 3. Navigation [V]
Header: `EVENTS · VIDEOS · VENUE · BANQUETS · CONTACT · TICKETS ▾ (bookmyshow, INSIDER.IN) · Friends Of Habitat`
Footer: Map / phone / hours / address / email · newsletter "Subscribe" · Important Links (Privacy, Terms, Refund) · Instagram widget (broken) · "©️ 2025 M/S THE HABITAT STUDIOS. All rights reserved."

## 4. Brand identity
- **Name [V]:** "The Habitat" (logo wordmark); site title "Habitat – Comedy and Music Cafe"; legal entity "M/S The Habitat Studios"; handle `indiehabitat`.
- **Logo [V]:** circled "H" monogram + "THE HABITAT" geometric bold sans. Files: `Habita-Logo-K.png` (black), `Habita-Logo-W.png` (white), `Habita-Logo-K-mobile.png` — only 471×96 PNGs; **no vector source found**.
- **Colours [V]:** black `#000000` / `#0a0a0a`, white, warm amber accent `#fcb232` (theme accent used in buttons and highlights). The rest of the CSS palette is WordPress block defaults.
- **Type [V]:** Montserrat (headings/nav), Raleway (body; full weight range loaded).
- **Voice [V]:** hashtag section labels (`#gigs`, `#thevenue`, `#thehabitatstudios`, `#banquets & #conferences`, `#contact`); casual, punchy, comedy‑first.
- **Photography [V]:** dark rooms, single spotlight, mic stand in front of the circled‑H logo; the homepage background is a **black‑and‑white** stage shot.
- See `/research/brand-guidelines.md`.

## 5. Content categories (verified offerings)
- **The Habitat [V]:** "An intimate 55‑70 seater for music, standup comedy, poetry and alternate events". Detail page: stand‑up, improv, storytelling, intimate music gigs, performance poetry, movie screenings, live sports screenings, open mics, smaller conferences; known for live gig recording.
- **Above The Habitat [V]:** "A 150‑250 capacity venue for gigs, Comedy Specials and for Recordings". Rap, metal, alternative music, poetry, improv, stand‑up, theatre, short‑film screenings. Specs: stage 27×12 ft, 18" high; 160 seated theatre‑style / 250 standing; room 60×32 ft; adjacent smoking zone; lighting and PA list. Recordings mentioned: Son Of Abish, Amazon Prime Video stand‑up specials, Aisi Taisi Democracy, brand ad shoots.
- **Jam Room [V]:** podcast recording and band rehearsal; Mapex Mars 5‑piece kit; air‑conditioned, soundproofed; drum, vocal and instrument tracking.
- **Banquets & conferences [V]:** conference packages (AM tea, lunch, PM tea), cocktail packages, social functions; cuisines Punjabi, Continental, Mughlai, Chinese; floor plans for both rooms.
- **Food [V/I]:** `#FOOD` anchor exists in the nav but there is no section on the page **[V]**. Banquet page says "our restaurants specialise in…" **[V]**. Press says the venue is inside Hotel Unicontinental, Khar West **[P]**.

### Weekly shows as last published [V]
| Show | Schedule | Price | Ticket link |
|---|---|---|---|
| All Star Standup Comedy | 10:00 PM daily | Mon–Fri ₹300 · Sat–Sun ₹500 | BMS ET00327409 |
| Midnight All Star Standup Comedy (BMS: "Last Comedy Show In The City") | "12:00 AM DAILY" (poster says 11:59 PM) | Mon–Fri ₹300 · Sat–Sun ₹500 | BMS ET00336827 |
| Mass Bunk | Fri 6 PM · Sat & Sun 4 PM | ₹199 | BMS ET00365779 |
| Comedy Roulette | Thu & Fri 8 PM | ₹300 | BMS ET00308527 |
| Poetry Open Mic | Sun 2 PM · Mon 8 PM | ₹250 | none (venue page) |
| Comedy Open Mic | Mon 7 PM & 9 PM | ₹300 | none (venue page) |

Inconsistencies kept as published (the client should confirm): the Mass Bunk poster says "Saturdays at 4PM" while the site text says Fri 6 PM and Sat & Sun 4 PM; the All Star copy reads "Start the week…" although it runs daily; the Midnight time differs between site and poster; Roulette is "almost 2 hours" on the site and "90 mins+" on the poster.

## 6. Contact [V]
- Phone: +91 98333 58492 · Feedback: 98333 58490 · WhatsApp: `wa.me/message/TA75TONBBKVNC1`
- Hours: 12pm to 12am
- Address: 9A, Rajkutir, CTS 853, 3rd Road, Mumbai Suburban, Pin 400052, Maharashtra (Khar West **[P]**)
- Email (decoded from Cloudflare): `accounts@unicontinental.com` — this is the hotel group's accounts inbox **[I]**; **ask the client for the preferred public address.**
- Social: instagram.com/indiehabitat · facebook.com/indiehabitat · twitter.com/IndieHabitat · YouTube channel `UCHaexIxXGCAkjiqEQUS0WZg`

## 7. External integrations [V]
- BookMyShow venue `the-habitat-mumbai/TFST` + four event pages
- Insider.in venue page (Insider is now "District" by Zomato **[P]**; link kept as published)
- YouTube embeds: `Nuy-v8M6ong` ("ABDC Show 02 The Habitat fillup Timelapse", The Habitat Studios), `JgSaV2NDqHI` ("prabhdeep", Mongrel Design), `MP9vWWP186w` ("Jam Room @ The Habitat", Mongrel Design)
- Google Maps link, WhatsApp, Contact Form 7 (submissions emailed; no stored DB)

## 8. Missing information [?]
- Current operating status (see §1).
- Founding story on the official site — press says it was founded in 2016 by Balraj Singh Ghai as "Tuning Fork" **[P]**. Not shown on the new site until the client approves.
- Artist roster. Press names comedians who have performed there **[P]**, but there are no official profiles or authorised photos, so `/artists` is CMS‑driven and starts empty.
- Menu / food details, press kit, careers, FAQ, an official preferred email.
- High‑resolution or vector logo.
- Written image‑reuse authorisation (see image inventory).
- "Friends Of Habitat" programme details (only "Get 2 #FREE tickets every Tuesday, Wednesday and Thursday!" and a WhatsApp link).

## 9. Reconstruction strategy
1. Keep the brand: original logo files untouched, black + amber palette, Montserrat/Raleway, hashtag eyebrows, B&W stage photography.
2. Turn the single long page into a proper information architecture: Events, Venue (3 spaces), Corporate/Banquets, Gallery, About, Contact, policies; 301 the old WordPress URLs.
3. Every factual claim comes from §5–§7. Unknowns become CMS fields or clearly labelled notices — never invented copy.
4. Bookings deep‑link to BookMyShow (the real ticketing provider). No on‑site payment, no fake availability.
5. Replace the email‑only Contact Form 7 with validated forms stored in PostgreSQL, viewable in `/admin`.
6. Fix existing defects: broken Instagram widget (replaced by a static link‑out grid of venue photos), COVID‑era copy, dead `#FOOD` anchor, 8000‑px floor plans (now resized).

# The Habitat: website rebuild

A full rebuild of [indiehabitat.com](https://indiehabitat.com), the site for **The Habitat, Comedy and Music Cafe** in Khar West, Mumbai. It includes:

- A public site: home, events with search and filters, event detail pages, three venue pages, private and corporate events, gallery, about, contact, FAQ and policy pages.
- Contact, venue-booking, corporate-enquiry and newsletter forms, stored in PostgreSQL.
- An admin CMS at `/admin` for events, artists, gallery, enquiries, subscribers and site settings.

All content comes from the audited original site. See [`research/website-audit.md`](research/website-audit.md); nothing there is invented. Ticket sales hand off to BookMyShow, the venue's real ticketing provider.

## Run it locally (one command)

Requirements: **Node 20+** and **PostgreSQL 15+** (`brew install postgresql@17`).

```bash
npm install
npm run local            # production build → http://localhost:3210
npm run local -- dev     # hot-reload dev server on the same port
PORT=4321 npm run local  # choose another port
```

`scripts/local.sh` takes care of setup:

1. Creates and starts a **project-local** PostgreSQL cluster in `.pgdata` on port **5433**. Your other databases are left alone.
2. Writes `.env` if it doesn't exist.
3. Runs migrations and seeds the verified content.
4. Builds and starts the site.

**Admin:** http://localhost:3210/admin. Use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (default `admin@indiehabitat.local` / `change-me-habitat-2026`). **Change these before any deployment.**

Stop the database with `npm run db:stop`. Start it again with `npm run db:start`.

## Scripts

| Script | What it does |
|---|---|
| `npm run local` | Full local setup and run (see above) |
| `npm run dev` / `build` / `start` | Standard Next.js commands (need `.env` and a running database) |
| `npm run typecheck` / `lint` | TypeScript / ESLint |
| `npm test` | Vitest unit tests (filters, validation, utilities) |
| `npm run test:e2e` | Playwright end-to-end tests. Starts `next start -p 3210` if nothing is running there; build first. |
| `npm run db:migrate` / `db:deploy` / `db:seed` | Prisma migrations and seed. `SEED_RESET=1 npm run db:seed` restores the six audited shows. |
| `npm run images` | Re-optimise source images from `research/source-assets` into `public/images` |

## Habitat Assistant (chatbot)

A chat assistant (bottom-right on every page) answers visitor questions: what's on today, tickets and prices, the three rooms, private and corporate bookings, house rules, getting there, and open-mic sign-ups. Every reply comes with links to the relevant pages.

- **Default (no API cost):** a built-in answer engine (`lib/assistant/engine.ts`). It uses only the verified site facts and the published events from the database, so it never invents details. If it doesn't know something, it says so and points to the team.
- **Optional Claude mode:** set `ASSISTANT_MODE=claude` and provide Anthropic credentials (`ANTHROPIC_API_KEY`). Replies are then written by Claude (`claude-opus-5-5`, low effort, streamed) using the same knowledge base, with refusal fallbacks enabled. Page links still come from the site's own vetted set. On any API error it falls back to the built-in engine.
- **Protection:** the API at `/api/chat` is rate-limited (20 messages per 5 minutes per IP), validates input and checks the request origin.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Radix primitives with shadcn-style components (`cva` + `Slot`) · Lucide · React Hook Form + Zod · PostgreSQL + Prisma 7 · jose (JWT sessions) + bcrypt · Sharp · Vitest · Playwright.

## Project map

```
app/(site)/…          public pages (ISR, revalidated every 5 min and on every admin change)
app/admin/…           CMS (auth via proxy.ts + requireAdmin() in every page and action)
app/api/…             public form endpoints + admin CSV export
app/uploads/[...path] serves CMS uploads from storage/uploads
components/           layout, home, events, gallery, forms, admin, motion, ui
lib/                  db, auth, data access, validation, SEO, verified site facts (site.ts, venues.ts)
content/policies.json legal pages, reproduced verbatim from the original site
prisma/               schema, migrations, seed (verified data only)
research/             audit, image inventory, brand guidelines, sitemap, original assets
docs/                 architecture, database schema, deployment guide
tests/                unit (Vitest) and e2e (Playwright)
```

## Documentation

- [Website audit](research/website-audit.md) · [Image inventory](research/image-inventory.md) · [Brand guidelines](research/brand-guidelines.md) · [Sitemap](research/sitemap.md)
- [Technical architecture](docs/technical-architecture.md) · [Database schema](docs/database-schema.md) · [Deployment guide](docs/deployment-guide.md)

## Before launch: decisions for the client

1. **Operating status.** The venue announced a closure in March 2025, and we found no public report that it has reopened. Set the announcement bar in **Admin → Settings**.
2. **Schedule.** Confirm the six shows, times and prices; the audit lists four inconsistencies in the original.
3. **Images.** Give written permission to reuse the site's photos. Two video posters belong to Mongrel Design. A vector logo would also help.
4. **Public email.** The site currently shows the only published address, `accounts@unicontinental.com`.
5. **Copy.** Approve the "Our story" text (Admin → Settings). Artist profiles can be added once performers agree.
6. **Legal.** Review the privacy policy. It is reproduced verbatim and mentions features the new site doesn't have, such as social login.

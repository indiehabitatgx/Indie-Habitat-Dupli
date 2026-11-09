# Technical Architecture

## Overview

```
Browser ──► Next.js 16 (Node runtime)
              ├─ proxy.ts ……………… guards /admin/* and /api/admin/* (JWT cookie check)
              ├─ app/(site) ………… public pages (Server Components, ISR 300 s)
              ├─ app/admin ………… CMS (dynamic; Server Actions)
              ├─ app/api/* ……… public form endpoints (JSON)
              └─ app/uploads/* … serves CMS uploads from disk
                     │
                     ▼
              Prisma 7 (driver adapter @prisma/adapter-pg) ──► PostgreSQL
```

## Rendering strategy

| Route | Mode | Why |
|---|---|---|
| `/`, `/venue/*`, `/gallery`, `/about`, `/contact`, `/faq`, `/corporate-events`, policies | Static + ISR (300 s) | Content changes rarely; served from cache |
| `/events/[slug]` | SSG via `generateStaticParams` + ISR; new slugs rendered on demand | Fast detail pages |
| `/events` | Dynamic (reads `searchParams`) | Shared filter URLs render correctly on first paint (no skeleton or layout shift) |
| `/admin/*` | Dynamic, `no-store` | Always fresh, never indexed |

Every admin mutation calls `revalidatePath("/", "layout")`, so the public site updates immediately.

## Client vs server

Server Components are the default. Client components cover interactivity only: header scroll state, mobile menu (Radix Dialog), event explorer, gallery and lightbox, forms, YouTube facade, scroll reveals, and the admin form widgets.

Performance choices that came out of the Lighthouse runs:

- Hero and above-the-fold entrances use **CSS keyframes**, not JS, so content is visible before hydration.
- The page transition (`app/(site)/template.tsx`) animates only on client-side navigations, never on first load.
- Montserrat and Raleway load as **variable fonts** through `next/font`: one preloaded file per family. The ₹ sign renders from a local font through a `unicode-range` face, so the latin-ext subset is never downloaded.
- The footer newsletter form avoids Zod and React Hook Form to keep the shared JS small. The API still validates with Zod.
- YouTube embeds use a click-to-load facade on `youtube-nocookie.com` with locally hosted posters.

## Data & content sources

- `lib/site.ts`, `lib/venues.ts`, `content/policies.json`: **verified, code-managed** facts from the original site. Changes go through code review.
- PostgreSQL: CMS-managed content (events, artists, gallery, settings) and submissions (enquiries, subscribers).
- `prisma/seed.ts` loads only audited data. It never overwrites admin edits unless `SEED_RESET=1` is set.

## Security

- **Auth:** email and password (bcrypt, cost 12) produce an HS256 JWT in an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production) that lasts 8 h.
  - Defence in depth: `proxy.ts` redirects unauthenticated users, and every admin page and Server Action calls `requireAdmin()`, which re-checks the user in the database.
  - Roles: `ADMIN` can do everything. `EDITOR` can edit content but cannot delete, change settings or export subscribers.
- **Login:** rate-limited (8 attempts / 15 min / IP), with constant-time comparison against a dummy hash for unknown emails.
- **Public forms:** Origin check, per-IP rate limit, Zod validation, honeypot field, and a generic error on failure.
- **Uploads:** MIME allow-list, 8 MB cap, decoded and re-encoded by Sharp (which strips EXIF/GPS metadata), random UUID filenames, and path-traversal guards when serving.
- **Output:** JSON-LD is escaped (`<` → `<`). URLs entered in the CMS must be `http(s)` and are re-checked at render time. The CSV export neutralises formula injection.
- **Headers:** `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. Admin responses send `X-Robots-Tag: noindex` and `Cache-Control: no-store`.

## SEO

- Per-page metadata: title, description, canonical URL, Open Graph and Twitter cards (`lib/seo.ts`).
- `app/sitemap.ts` (static pages, venues, published events and artists) and `app/robots.ts` (disallows `/admin` and `/api`).
- JSON-LD: `Organization`, `ComedyClub` (a LocalBusiness subtype), `Place` per room, `BreadcrumbList`, `FAQPage` and `Person`. `Event` markup is emitted **only for one-off events with a real date**. Recurring shows have no confirmed upcoming dates, so emitting it for them would invent data.
- 301/308 redirects from the old WordPress URLs.

## Accessibility

- A skip link is the first focusable element. Navigation, lightbox and mobile menu are fully keyboard-operable (Radix focus traps).
- Every image has alt text. Forms have labels, `aria-invalid`/`aria-describedby` and live status regions.
- Animations respect `prefers-reduced-motion`. Tap targets are at least 44 px.
- Lighthouse Accessibility scored 100 on every tested page.

## Testing

- `tests/unit`: event filtering and sorting, validation schemas (including IST date handling), utilities. 28 tests.
- `tests/e2e`: every public page (single h1, canonical URL, alt text, no horizontal overflow, no console errors), 404s, legacy redirects, navigation, internal link check, skip link, event filters, search and URL sync, booking links, gallery lightbox, all forms, API hardening, admin auth, event create/update/delete reaching the public site, duplicate slugs, enquiries, CSV export, settings, logout, and mobile navigation. 42 tests.

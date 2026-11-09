# Deployment Guide

The app is a standard Node.js Next.js server with PostgreSQL. Two supported targets are described below.

## 1. Prerequisites
- Node.js 20+ (22 LTS recommended)
- PostgreSQL 15+ (managed options: Neon, Supabase, RDS, Cloud SQL, Railway, …)
- A domain with HTTPS

## 2. Environment variables
Copy `.env.example` and set:

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/indie_habitat?sslmode=require` | |
| `NEXT_PUBLIC_SITE_URL` | `https://indiehabitat.com` | Used for canonical URLs, sitemap and OG tags. **Set at build time.** |
| `AUTH_SECRET` | 32+ random bytes | `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | | Used once by the seed to create the first admin. Remove them from the environment afterwards. |
| `UPLOAD_DIR` (optional) | `/var/lib/habitat/uploads` | Persistent directory for CMS uploads. Default: `storage/uploads`. |

Never commit `.env`. It is already in `.gitignore`.

## 3. Option A: a single VM or container (recommended for uploads)

```bash
npm ci
npx prisma migrate deploy
npm run db:seed                 # first deploy only
npm run build
PORT=3000 npm start             # put it behind Nginx/Caddy with HTTPS
```

- Run it under a process manager (systemd, pm2 or Docker) with `NODE_ENV=production`.
- Mount `UPLOAD_DIR` on a persistent volume and include it in backups.
- The in-memory rate limiter assumes **one instance**. If you scale out, swap `lib/rate-limit.ts` for Redis or Upstash.

Minimal Dockerfile:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json prisma ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build
ENV NODE_ENV=production PORT=3000
CMD npx prisma migrate deploy && npm start
```

Note: `next build` pre-renders pages from the database, so `DATABASE_URL` must be reachable at build time. If it isn't, pages are generated on the first request instead.

## 4. Option B: Vercel (or another serverless host)
- Set the environment variables in the dashboard. Add `npx prisma migrate deploy` before `next build` in the build command.
- **Uploads:** serverless filesystems are ephemeral. Replace `saveImageUpload`, `readUpload` and `deleteUpload` in `lib/uploads.ts` with S3, R2 or Vercel Blob calls, and point `images.remotePatterns` in `next.config.ts` at the bucket.
- Use a shared store for rate limiting (Upstash Redis).

## 5. Post-deploy checklist
- [ ] Sign in at `/admin`, **change the admin password** (create a new admin user and remove the seeded one), and remove `ADMIN_PASSWORD` from the environment.
- [ ] Set the announcement bar to the venue's confirmed status (Admin → Settings).
- [ ] Confirm each show's schedule, price and BookMyShow link (Admin → Events).
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console. Check that the old WordPress URLs redirect.
- [ ] Set up monitoring and a daily database backup.
- [ ] Re-run Lighthouse against the live URL; local numbers are in the final report.
- [ ] Optional: forward new enquiries by email. Add a provider such as Resend or SES in the API route handlers after the database write.

## 6. Instagram feed (live posts on the homepage)
The homepage shows the latest @indiehabitat posts through the **official Instagram API** (scraping is against Instagram's terms and is blocked). One-time setup, done by whoever controls the account:

1. Make sure @indiehabitat is a **Professional** account (Business or Creator): Instagram app → Settings → Account type.
2. At <https://developers.facebook.com/apps> create an app (type **Business**) and add the **Instagram** product → *API setup with Instagram login*.
3. Under *Generate access tokens*, add the @indiehabitat account, log in, and copy the generated **long-lived token**. The permission needed is `instagram_business_basic`.
4. Paste it into **Admin → Settings → Instagram feed → Verify & connect**. The token is checked against Instagram before it's saved.

After that:
- The feed refreshes hourly; **Sync now** refreshes it immediately.
- The token is refreshed automatically every week, well before its 60-day expiry.
- If Instagram is unreachable or the token is revoked, the section quietly falls back to venue photos, and the error is shown in Admin → Settings.
- Images come from Instagram's CDN through Next's image optimiser, so visitors load them from this site, cached.

## 7. Updating content without code
Admin → Events / Artists / Gallery / Settings. Changes go live immediately (on-demand revalidation).

## 8. Re-optimising images
Put originals in `research/source-assets/`, add a line to `scripts/optimize-images.mjs`, then run `npm run images`.

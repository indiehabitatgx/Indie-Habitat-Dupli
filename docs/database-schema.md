# Database Schema

PostgreSQL via Prisma 7. Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma). Migrations live in `prisma/migrations/`.

```
EventCategory 1─* Event *─1 Venue
                    │
                    *─* Artist          (implicit join table _ArtistToEvent)

GalleryImage   MediaAsset   ContactEnquiry   CorporateEnquiry   NewsletterSubscriber   AdminUser   SiteSetting
```

## Models

### Event
| Field | Type | Notes |
|---|---|---|
| id, slug (unique), title | String | |
| shortDescription, description | String | Paragraphs separated by blank lines |
| bannerImage, thumbnailImage | String? | `/images/…` or `/uploads/…` only (validated) |
| posterWidth, posterHeight | Int? | |
| categoryId → EventCategory | String | `onDelete: Restrict` |
| venueId → Venue | String? | Null when the room isn't confirmed (all seeded shows) |
| recurrence | `ONE_OFF` \| `WEEKLY` | |
| scheduleDays | Int[] | 0 = Sunday … 6 = Saturday (weekly shows) |
| scheduleText | String | Schedule exactly as published |
| startDate, endDate | DateTime? | One-off events; admin input is read as IST |
| startTime | String? | "HH:mm", used for sorting |
| ticketPrice | Int? | Lowest price in INR; null means not published |
| priceNote | String? | e.g. "Mon–Fri ₹300 · Sat–Sun ₹500" |
| bookingUrl, bookingProvider | String? | External ticketing (BookMyShow) |
| terms | String? | One rule per line |
| status | `DRAFT` \| `PUBLISHED` \| `ARCHIVED` | Only PUBLISHED is public |
| featured, sortOrder | Boolean, Int | |
| seoTitle, seoDescription | String? | |
| createdAt, updatedAt | DateTime | |

Indexes: `(status, featured)`, `categoryId`, `venueId`, `startDate`.

A show appears on the public site when it is published and either `WEEKLY`, or `ONE_OFF` with a start or end date from today onwards.

### Artist
`id, name, slug (unique), biography, profileImage?, socialLinks Json ({instagram, youtube, x, website}), featured, status, events[], timestamps`. Index `(status, featured)`. The public Artists page and nav link appear only once an artist is published.

### EventCategory
`id, name (unique), slug (unique), sortOrder`. Seeded with Comedy, Music, Poetry, Storytelling and Special Events. Public filters show only categories that published events actually use.

### Venue
`id, name, slug (unique), summary, capacity?, image?, sortOrder`. Seeded with the three verified rooms. Rich venue content lives in `lib/venues.ts`.

### GalleryImage
`id, title, alt, src, width, height, category, mediaType (IMAGE|VIDEO), videoId?, sortOrder, published, createdAt`. Index `(published, category)`.

### MediaAsset
Audit record for every upload: `filename, path (unique), mimeType, size, width, height, alt, uploadedBy, createdAt`.

### ContactEnquiry
`source ("contact" | "venue:<slug>"), name, email, phone?, purpose, guests?, message?, status (NEW|IN_PROGRESS|RESOLVED|SPAM), createdAt`. Index `(status, createdAt)`.

### CorporateEnquiry
`name, company?, email, phone, eventType, preferredDate?, attendees, duration?, foodBeverage?, technical String[], message?, status, createdAt`. Option lists match the original banquets form exactly.

### NewsletterSubscriber
`email (unique), confirmed, unsubscribedAt?, createdAt`. Subscribing is idempotent, and the response is the same whether or not the email already exists (no enumeration).

### AdminUser
`email (unique), name, passwordHash (bcrypt), role (ADMIN|EDITOR), lastLoginAt?, createdAt`. The first admin is created by the seed from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, and only if no admin exists yet.

### SiteSetting
Key/value pairs: `announcement`, `announcementEnabled`, `aboutStory`.

## Data minimisation
- No payment data and no ticket data: that stays with BookMyShow.
- Enquiries hold only what the visitor typed. IP addresses are not stored; they are used only in memory for rate limiting.
- Delete enquiries and subscribers from the admin panel (ADMIN role) when they are no longer needed.

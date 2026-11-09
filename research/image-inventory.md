# Image & Media Inventory

All assets were downloaded from the client's own website (`https://indiehabitat.com/wp-content/uploads/…`) or the client's own YouTube embeds. Nothing is hotlinked: every file is served from `/public`. Unoptimised originals are kept in `research/source-assets/` (not deployed). Optimised masters are produced by `npm run images` (`scripts/optimize-images.mjs`).

**Licence status (applies to every row):** *Client‑owned — published by M/S The Habitat Studios on indiehabitat.com. Reuse on the client's own rebuilt website assumed; **written confirmation from the client is pending**.* Two video posters come from videos uploaded by **Mongrel Design** (a third party); the client must confirm permission for those. No stock or AI‑generated imagery is used anywhere.

| Asset | Source URL (uploads/…) | Category | Licence / permission | Local path | Usage |
|---|---|---|---|---|---|
| Logo — black | 2019/04/Habita-Logo-K.png | Brand | Client‑owned, pending written OK | /public/images/brand/habitat-logo-k.png | Header on light surfaces, favicon source |
| Logo — white | 2019/04/Habita-Logo-W.png | Brand | Client‑owned, pending written OK | /public/images/brand/habitat-logo-w.png | Header/footer on dark surfaces |
| Logo — mobile | 2019/04/Habita-Logo-K-mobile.png | Brand | Client‑owned, pending written OK | /public/images/brand/habitat-logo-k-mobile.png | Reserve |
| B&W stage, circled‑H wall | 2019/04/Habitat-bw-bg.png | Hero | Client‑owned, pending written OK | /public/images/hero/stage-bw.webp | Home hero, OG image |
| The Habitat stage (colour) | 2019/06/habitat-cafe-comedy-music-poetry-khar.jpg | Venue | Client‑owned, pending written OK | /public/images/venue/the-habitat-stage.webp | Venue pages, home venue section |
| Above The Habitat room | 2019/06/Above-the-habitat-comedy-music-poetry-khar.jpg | Venue | Client‑owned, pending written OK | /public/images/venue/above-the-habitat-stage.webp | Venue, corporate, about |
| Jam Room | 2019/06/habitat-jam-room-comedy-music-poetry-khar.jpg | Venue | Client‑owned, pending written OK | /public/images/venue/jam-room.webp | Jam Room page |
| Terrace seating | 2019/06/habitat-khar-banquet-conference.png | Venue | Client‑owned, pending written OK | /public/images/venue/terrace.webp | Corporate, gallery |
| Floor plan — The Habitat | 2019/06/TH-Floor-Plan.jpg (8000 px → 2400 px) | Venue | Client‑owned, pending written OK | /public/images/venue/floor-plan-the-habitat.webp | Corporate, venue pages |
| Floor plan — Above The Habitat | 2019/06/ATH-Floor-Plan.jpg | Venue | Client‑owned, pending written OK | /public/images/venue/floor-plan-above-the-habitat.webp | Corporate, venue pages |
| Audience laughing | 2021/01/IMG_1006-scaled.jpg | Gallery / Comedy | Client‑owned, pending written OK | /public/images/gallery/audience.webp | Home, about, gallery |
| Decorated stage (event set‑up) | 2024/01/IMG_9533-scaled.webp | Gallery / Events | Client‑owned, pending written OK | /public/images/gallery/stage-decor.webp | Corporate, gallery |
| Celebration cake & champagne | 2019/06/IMG_3285.jpg | Gallery / Events | Client‑owned, pending written OK | /public/images/gallery/celebration.webp | Corporate, gallery |
| Community meet‑up in the café | 2019/06/IMG_9936.jpg | Gallery / Community | Client‑owned, pending written OK. **Identifiable people — confirm consent** | /public/images/gallery/community-meetup.webp | Gallery, corporate |
| Poster — All Star Standup Comedy | 2024/03/AllStar.webp | Events | Client‑owned, pending written OK | /public/images/events/all-star-standup-comedy.webp | Event card/detail |
| Poster — Midnight All Star | 2024/03/Midnight.webp | Events | Client‑owned, pending written OK | /public/images/events/midnight-all-star-standup-comedy.webp | Event card/detail |
| Poster — Mass Bunk | 2024/03/blue-vertical-mass-bunk-424x600.webp (only 500 px available) | Events | Client‑owned, pending written OK | /public/images/events/mass-bunk.webp | Event card/detail |
| Poster — Comedy Roulette | 2024/03/Roulette.webp | Events | Client‑owned, pending written OK | /public/images/events/comedy-roulette.webp | Event card/detail |
| Poster — Poetry Open Mic | 2024/03/PoetryOpenMic.webp | Events | Client‑owned, pending written OK | /public/images/events/poetry-open-mic.webp | Event card/detail |
| Poster — Comedy Open Mic | 2024/03/ComedyOpenMic.webp | Events | Client‑owned, pending written OK | /public/images/events/comedy-open-mic.webp | Event card/detail |
| Video poster — "ABDC Show 02 The Habitat fillup Timelapse" | YouTube `Nuy-v8M6ong` (The Habitat Studios) | Video | Client‑owned | /public/images/backgrounds/video-abdc-timelapse.webp | Videos section |
| Video poster — "prabhdeep" | YouTube `JgSaV2NDqHI` (Mongrel Design) | Video | **Third party — confirm** | /public/images/backgrounds/video-prabhdeep.webp | Videos section |
| Video poster — "Jam Room @ The Habitat" | YouTube `MP9vWWP186w` (Mongrel Design) | Video | **Third party — confirm** | /public/images/backgrounds/video-jam-room.webp | Jam Room page |

## Not collected (and why)
- **Instagram / Facebook photos:** discovery only. They aren't downloaded because there's no licence record, and scraping social platforms is outside policy. The client can upload them through `/admin/gallery`.
- **Press photography** (Quint, Hollywood Reporter India etc.): owned by the publications.
- **Artist headshots:** no authorised source. Artist profiles take uploads via `/admin/artists`.
- **Hero video:** no authorised background video file exists; YouTube videos are embedded with a click‑to‑load facade instead.

## Known quality gaps
- The logo exists only as a 471×96 PNG. Request an SVG/AI master from the client.
- Mass Bunk poster: only a 500×750 version is published.
- Hero image is 1920×1080 at most; a higher‑resolution original would help on 4K screens.

## Derived brand assets
| Asset | Source | Category | Licence / permission | Local path | Usage |
|---|---|---|---|---|---|
| Circled-H mark (square) | Cropped, unmodified, from 2019/04/Habita-Logo-W.png | Brand | Client-owned, pending written OK | /public/images/brand/habitat-mark-w.png | Page loader centre, Instagram card avatar |
| Hero HD master | Upscaled 2.3× from 2019/06/habitat-cafe-comedy-music-poetry-khar.jpg (1114×626, the largest published) | Hero | Client-owned, pending written OK | /public/images/hero/stage-color-hd.webp | Home hero, default OG image |

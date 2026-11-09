# The Habitat — Brand Guidelines (reconstructed)

Everything below comes from the live site (theme CSS, logo files, photography). Items marked *(system)* are additions made for the rebuild; they extend the brand without replacing it.

## Logo
- Official files only: `/public/images/brand/habitat-logo-w.png` (white, for dark backgrounds) and `habitat-logo-k.png` (black, for light backgrounds).
- Never recolour, redraw, stretch or crop. Minimum display width 120 px. Clear space = the height of the circled "H".
- The circled‑H mounted on the stage wall is the brand's real‑world icon, so photography that shows it is preferred for hero use.

## Colour tokens (`app/globals.css`)
| Token | Value | Origin |
|---|---|---|
| `--brand-background` | `#0a0a0a` | site `#0a0a0a` / black sections |
| `--brand-surface` | `#141414` | *(system)* raised dark surface |
| `--brand-surface-2` | `#1d1d1d` | *(system)* cards / inputs |
| `--brand-text` | `#f5f2ea` | warm white *(system; close to site `#fcf9f2`)* |
| `--brand-muted` | `#a39e94` | *(system)* secondary text, ≥ 4.5:1 on background |
| `--brand-primary` | `#fcb232` | **site accent** amber |
| `--brand-primary-ink` | `#0a0a0a` | text on amber |
| `--brand-line` | `#2a2a2a` | *(system)* hairlines |
| `--brand-paper` | `#f5f2ea` | light editorial sections |

Contrast: amber on black = 11.0:1; muted on black = 7.6:1; black on amber = 11.0:1.

The site is dark‑first; light "paper" sections give the long pages rhythm. Colour comes from the photography and posters; the UI stays black/white/amber.

## Typography
- **Display / headings:** Montserrat 800–900, uppercase, tight tracking (−0.02em), set very large (clamp 3rem → 9rem). Matches the geometric logo wordmark.
- **Body:** Raleway 400/500, 17–18 px, line‑height 1.6.
- **Eyebrows:** hashtags in Montserrat 700, letter‑spacing 0.18em, amber. Examples kept from the original: `#gigs`, `#thevenue`, `#thehabitatstudios`, `#banquets & #conferences`, `#contact`.
- Loaded with `next/font/google` (self‑hosted at build, no layout shift).

## Graphic language *(system, derived from the venue)*
- **Ring:** a thin circle outline echoing the circled‑H. Used for spotlights, cursor‑free hover states and numbered list markers. Never placed over or around the actual logo.
- **Spotlight:** radial amber‑to‑black gradient, standing in for the single stage light in the photos.
- **Slat lines:** thin diagonal stripes from the timber stage wall, used sparingly as section dividers.
- **Marquee ticker:** show names scrolling like a club marquee.

## Photography
- Dark, low‑key, a single light source on stage. Hero images are converted to B&W in CSS (`grayscale`) and regain colour on hover/focus in galleries.
- Posters are shown in full colour, uncropped (portrait 1:1.414).
- People: prefer audience‑from‑behind shots; get consent for identifiable faces.

## Voice
Short, playful, comedy‑first. Prices with ₹ and "/-" are reformatted to "₹300". Factual claims (capacity, gear, times, prices) are only ever quoted from verified sources.

## Buttons & UI
- Primary: amber fill, black text, square corners (radius 2 px), uppercase Montserrat 700. Hover: the fill slides out to black with an amber outline.
- Secondary: 1 px warm‑white outline.
- Focus: 2 px amber outline, 3 px offset, always visible.
- Cards: no heavy rounding (≤ 4 px), hairline borders, images bleed to the edge.

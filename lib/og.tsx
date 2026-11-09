import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Branded link previews (Open Graph / Twitter / WhatsApp / iMessage / Slack…), rendered with next/og.
 * 1200×630, The Habitat's black + amber identity, official logo, B&W stage photography.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const AMBER = "#fcb232";
const INK = "#0a0a0a";
const TEXT = "#f5f2ea";
const MUTED = "#b8b2a6";

const root = /*turbopackIgnore: true*/ process.cwd();

async function fonts() {
  const [display, body] = await Promise.all([
    readFile(path.join(root, "assets/og/Montserrat-ExtraBold.ttf")),
    readFile(path.join(root, "assets/og/Raleway-Medium.ttf")),
  ]);
  return [
    { name: "Montserrat", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Raleway", data: body, weight: 500 as const, style: "normal" as const },
  ];
}

/** Loads a /public image (any format incl. WebP) and returns a JPEG/PNG data URL that the renderer supports. */
async function img(publicPath: string, opts: { width: number; grayscale?: boolean; png?: boolean }) {
  try {
    const file = path.join(root, "public", publicPath.replace(/^\//, ""));
    let pipeline = sharp(await readFile(file)).resize({ width: opts.width, withoutEnlargement: true });
    if (opts.grayscale) pipeline = pipeline.grayscale();
    const buf = opts.png ? await pipeline.png().toBuffer() : await pipeline.jpeg({ quality: 82 }).toBuffer();
    return `data:image/${opts.png ? "png" : "jpeg"};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function domain() {
  try {
    return new URL(site.url).host.replace(/^www\./, "");
  } catch {
    return "indiehabitat.com";
  }
}

type CardInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  photo?: string;
  /** Portrait event poster shown on the right */
  poster?: string;
  /** Small chips under the title, e.g. schedule and price */
  chips?: string[];
};

export async function ogCard({ eyebrow, title, subtitle, photo = "/images/hero/stage-bw-hd.webp", poster, chips = [] }: CardInput) {
  const [fontData, bg, logo, posterSrc] = await Promise.all([
    fonts(),
    img(photo, { width: 1200, grayscale: true }),
    img("/images/brand/habitat-logo-w.png", { width: 471, png: true }),
    poster ? img(poster, { width: 420 }) : Promise.resolve(null),
  ]);
  const titleSize = title.length > 34 ? 60 : title.length > 22 ? 72 : 86;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: INK, fontFamily: "Raleway" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.5 }} />
        )}
        {/* legibility + stage spotlight */}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.82) 45%, rgba(10,10,10,0.35) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(135deg, rgba(252,178,50,0.20) 0%, rgba(252,178,50,0.06) 30%, rgba(252,178,50,0) 55%)" }} />
        {/* ring motif (echoes the circled H, does not reproduce the logo) */}
        {!poster && (
          <div style={{ position: "absolute", right: 70, bottom: 60, width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9999, border: `2px solid rgba(252,178,50,0.55)` }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: AMBER, display: "flex" }} />
          </div>
        )}
        {/* amber edge stripe */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: AMBER, display: "flex" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: poster ? 760 : 1200, height: "100%", padding: "56px 64px 52px 74px" }}>
          {/* top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={236} height={48} style={{ width: 236, height: 48 }} />
            ) : (
              <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 34, color: TEXT }}>THE HABITAT</div>
            )}
            {!poster && <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 22, letterSpacing: 4, color: AMBER }}>#indiehabitat</div>}
          </div>

          {/* main */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ width: 46, height: 3, background: AMBER, display: "flex" }} />
              <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 22, letterSpacing: 5, color: AMBER, textTransform: "uppercase" }}>{eyebrow}</div>
            </div>
            <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: titleSize, lineHeight: 0.98, letterSpacing: -2, color: TEXT, textTransform: "uppercase", maxWidth: poster ? 640 : 980 }}>
              {title}
            </div>
            {subtitle && <div style={{ display: "flex", marginTop: 22, fontSize: 30, lineHeight: 1.3, color: MUTED, maxWidth: poster ? 620 : 860 }}>{subtitle}</div>}
            {chips.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
                {chips.map((c, i) => (
                  <div
                    key={c}
                    style={{
                      display: "flex",
                      padding: "10px 20px",
                      borderRadius: 9999,
                      fontFamily: "Montserrat",
                      fontSize: 22,
                      color: i === 0 ? INK : TEXT,
                      background: i === 0 ? AMBER : "rgba(255,255,255,0.08)",
                      border: i === 0 ? `2px solid ${AMBER}` : "2px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 24, color: TEXT }}>{domain()}</div>
            <div style={{ width: 60, height: 2, background: "rgba(252,178,50,0.7)", display: "flex" }} />
            <div style={{ display: "flex", fontSize: 22, color: MUTED }}>{poster ? "Khar, Mumbai" : "Comedy and Music Cafe · Khar, Mumbai"}</div>
          </div>
        </div>

        {posterSrc && (
          <div style={{ position: "absolute", right: 70, top: 58, display: "flex", transform: "rotate(3deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.75)", border: "8px solid #141414", borderRadius: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterSrc} alt="" width={340} height={481} style={{ width: 340, height: 481, objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: fontData },
  );
}

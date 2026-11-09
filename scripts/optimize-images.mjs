// Converts the original assets in research/source-assets into optimised WebP masters under public/images.
// next/image then serves responsive AVIF/WebP variants from these masters at request time.
// Usage: npm run images
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const SRC = "research/source-assets";
const OUT = "public/images";

/** [source file, output path (relative to public/images), max width, options] */
const jobs = [
  // hero
  ["Habitat-bw-bg.png", "hero/stage-bw.webp", 2400],
  // venue
  ["habitat-cafe-comedy-music-poetry-khar.jpg", "venue/the-habitat-stage.webp", 1600],
  ["Above-the-habitat-comedy-music-poetry-khar.jpg", "venue/above-the-habitat-stage.webp", 2400],
  ["habitat-jam-room-comedy-music-poetry-khar.jpg", "venue/jam-room.webp", 1600],
  ["habitat-khar-banquet-conference.png", "venue/terrace.webp", 1600],
  ["TH-Floor-Plan.jpg", "venue/floor-plan-the-habitat.webp", 2400, { quality: 88 }],
  ["ATH-Floor-Plan.jpg", "venue/floor-plan-above-the-habitat.webp", 2400, { quality: 88 }],
  // gallery
  ["IMG_1006-scaled.jpg", "gallery/audience.webp", 2000],
  ["IMG_9533-scaled.webp", "gallery/stage-decor.webp", 2000],
  ["IMG_3285.jpg", "gallery/celebration.webp", 2000],
  ["IMG_9936.jpg", "gallery/community-meetup.webp", 2000],
  // event posters (portrait 1414x2000 originals)
  ["AllStar.webp", "events/all-star-standup-comedy.webp", 1200],
  ["Midnight.webp", "events/midnight-all-star-standup-comedy.webp", 1200],
  ["blue-vertical-mass-bunk.webp", "events/mass-bunk.webp", 1200],
  ["Roulette.webp", "events/comedy-roulette.webp", 1200],
  ["PoetryOpenMic.webp", "events/poetry-open-mic.webp", 1200],
  ["ComedyOpenMic.webp", "events/comedy-open-mic.webp", 1200],
  // video posters (client's own YouTube uploads)
  ["yt-Nuy-v8M6ong.jpg", "backgrounds/video-abdc-timelapse.webp", 1280],
  ["yt-JgSaV2NDqHI.jpg", "backgrounds/video-prabhdeep.webp", 1280],
  ["yt-MP9vWWP186w.jpg", "backgrounds/video-jam-room.webp", 1280],
];

for (const [src, out, width, opts = {}] of jobs) {
  const dest = path.join(OUT, out);
  await mkdir(path.dirname(dest), { recursive: true });
  const info = await sharp(path.join(SRC, src))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: opts.quality ?? 80, effort: 5 })
    .toFile(dest);
  console.log(`${out.padEnd(48)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}

// HD hero master. The only published original is 1114×626, so it is upscaled 2.3× with Lanczos
// and a gentle unsharp mask; film grain + vignette in the hero CSS hide the remaining softness.
{
  const dest = path.join(OUT, "hero/stage-color-hd.webp");
  const info = await sharp(path.join(SRC, "habitat-cafe-comedy-music-poetry-khar.jpg"))
    .resize({ width: 2560, kernel: "lanczos3", withoutEnlargement: false })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .sharpen({ sigma: 1.1, m1: 0.6, m2: 1.8 })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(dest);
  console.log(`${"hero/stage-color-hd.webp".padEnd(48)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}

// HD black-and-white hero from the client-supplied 6000×3375 photo of Above The Habitat.
// B&W is baked in (smaller file, no runtime CSS filter); a gentle contrast lift keeps the stage light punchy.
{
  const dest = path.join(OUT, "hero/stage-bw-hd.webp");
  const info = await sharp(path.join(SRC, "above-the-habitat-hd-original.png"))
    .resize({ width: 2880, kernel: "lanczos3", withoutEnlargement: true })
    .grayscale()
    .linear(1.12, -10)
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 84, effort: 6 })
    .toFile(dest);
  console.log(`${"hero/stage-bw-hd.webp".padEnd(48)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}

// Logos are copied untouched (brand rule: never modify the official logo).
await mkdir(path.join(OUT, "brand"), { recursive: true });
for (const f of ["Habita-Logo-K.png", "Habita-Logo-W.png", "Habita-Logo-K-mobile.png"]) {
  await copyFile(path.join(SRC, f), path.join(OUT, "brand", f.replace("Habita-", "habitat-").toLowerCase()));
}
console.log("logos copied");

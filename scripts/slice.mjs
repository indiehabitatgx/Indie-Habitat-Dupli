// Slices a tall screenshot into viewable segments: node scripts/slice.mjs file.png segmentHeight scale
import sharp from "sharp";
const [file, segH = "1800", scale = "0.5"] = process.argv.slice(2);
const meta = await sharp(file).metadata();
const n = Math.ceil(meta.height / Number(segH));
for (let i = 0; i < n; i++) {
  const top = i * Number(segH);
  const h = Math.min(Number(segH), meta.height - top);
  await sharp(file).extract({ left: 0, top, width: meta.width, height: h }).resize({ width: Math.round(meta.width * Number(scale)) }).jpeg({ quality: 70 }).toFile(file.replace(".png", `-part${i + 1}.jpg`));
}
console.log(file, meta.width, meta.height, "→", n, "parts");

// Visual QA helper: node scripts/screenshots.mjs [baseUrl] [outDir]
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3210";
const out = process.argv[3] ?? ".cache/shots";
const pages = (process.env.PAGES ?? "/,/events,/events/comedy-roulette,/venue,/venue/above-the-habitat,/corporate-events,/gallery,/about,/contact,/faq").split(",");
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);

const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Scroll through so in-view animations and lazy images resolve.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${out}/${w}${p === "/" ? "-home" : p.replaceAll("/", "-")}.png`;
    await page.screenshot({ path: name, fullPage: true });
    console.log(`${w}px ${p} overflowX=${overflow}`);
  }
  if (errors.length) console.log("console errors:", [...new Set(errors)].join("\n"));
  await ctx.close();
}
await browser.close();

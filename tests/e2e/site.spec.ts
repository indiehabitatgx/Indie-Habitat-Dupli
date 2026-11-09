import { expect, test } from "@playwright/test";

const pages = [
  ["/", /stand-up/i],
  ["/events", /what.s on/i],
  ["/events/comedy-roulette", /comedy roulette/i],
  ["/venue", /three rooms/i],
  ["/venue/the-habitat", /the habitat/i],
  ["/venue/above-the-habitat", /above the habitat/i],
  ["/venue/jam-room", /jam room/i],
  ["/corporate-events", /your event/i],
  ["/gallery", /gallery/i],
  ["/about", /habitat for the/i],
  ["/contact", /say/i],
  ["/faq", /good questions/i],
  ["/artists", /artists/i],
  ["/privacy-policy", /privacy policy/i],
  ["/terms-and-conditions", /terms and conditions/i],
  ["/refund-policy", /refund policy/i],
] as const;

test.describe("pages", () => {
  for (const [path, heading] of pages) {
    test(`${path} renders with one h1, metadata and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(heading);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
      // Every image needs an alt attribute (empty is allowed for decorative images).
      expect(await page.locator("img:not([alt])").count()).toBe(0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("unknown routes show the branded 404", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/tough/i);
    expect((await page.goto("/events/not-a-show"))?.status()).toBe(404);
  });

  test("legacy WordPress URLs redirect permanently", async ({ request }) => {
    for (const [from, to] of [
      ["/the-habitat", "/venue/the-habitat"],
      ["/above-the-habitat", "/venue/above-the-habitat"],
      ["/jam-room", "/venue/jam-room"],
      ["/banquets-conferences", "/corporate-events"],
      ["/cancellation-policy", "/refund-policy"],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308]).toContain(res.status());
      expect(res.headers()["location"]).toContain(to);
    }
  });
});

test.describe("navigation", () => {
  test("header links reach every primary page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const [label, path] of [
      ["Events", "/events"],
      ["Venue", "/venue"],
      ["Private & Corporate", "/corporate-events"],
      ["Gallery", "/gallery"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ]) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("all internal links on key pages resolve", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const p of ["/", "/events", "/venue", "/corporate-events", "/about", "/faq"]) {
      await page.goto(p);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
      for (const h of hrefs) seen.add(h.split("#")[0]);
    }
    for (const href of seen) {
      if (!href) continue;
      const res = await request.get(href);
      expect(res.status(), href).toBeLessThan(400);
    }
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/events");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("events", () => {
  test("category filter, search, day filter, empty state and URL sync", async ({ page }) => {
    await page.goto("/events");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(6);

    await page.getByRole("button", { name: "Poetry", exact: true }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Poetry Open Mic");
    await expect(page).toHaveURL(/category=poetry/);

    await page.getByRole("button", { name: "All", exact: true }).click();
    await page.getByLabel("Search events").fill("roulette");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Comedy Roulette");

    await page.getByLabel("Search events").fill("");
    await page.getByLabel("Day").selectOption("1"); // Monday
    await expect(cards).toHaveCount(4); // All Star, Midnight, Poetry OM, Comedy OM

    await page.getByLabel("Search events").fill("zzzz");
    await expect(page.getByText("No shows match")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(cards).toHaveCount(6);
  });

  test("filters restore from the URL", async ({ page }) => {
    await page.goto("/events?category=comedy&sort=price-asc");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toContainText("Mass Bunk");
  });

  test("card opens the detail page with a real BookMyShow link", async ({ page }) => {
    await page.goto("/events");
    await page.getByRole("link", { name: "Comedy Roulette", exact: true }).click();
    await expect(page).toHaveURL(/\/events\/comedy-roulette$/);
    const book = page.getByRole("link", { name: /book tickets/i }).first();
    await expect(book).toHaveAttribute("href", "https://in.bookmyshow.com/events/comedy-roulette/ET00308527");
    await expect(book).toHaveAttribute("target", "_blank");
    await expect(book).toHaveAttribute("rel", /noopener/);
    await page.getByText("House rules & terms").click();
    await expect(page.getByText(/18\+ only/)).toBeVisible();
  });
});

test.describe("gallery", () => {
  test("filters and lightbox with keyboard navigation", async ({ page }) => {
    await page.goto("/gallery");
    const items = page.locator("main ul li button");
    await expect(items.first()).toBeVisible();
    const total = await items.count();
    expect(total).toBeGreaterThan(6);
    await page.getByRole("button", { name: "Studio", exact: true }).click();
    await expect(items).toHaveCount(2);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await items.first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(`1 / ${total}`);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText(`2 / ${total}`);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("seo", () => {
  test("sitemap, robots and structured data", async ({ page, request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/events/comedy-roulette");
    expect(sitemap).toContain("/venue/above-the-habitat");
    expect(sitemap).not.toContain("/admin");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    await page.goto("/");
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => JSON.parse(x.textContent!)["@type"]));
    expect(types).toEqual(expect.arrayContaining(["Organization", "ComedyClub"]));
    await page.goto("/events/mass-bunk");
    const evTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => JSON.parse(x.textContent!)["@type"]));
    expect(evTypes).toContain("BreadcrumbList");
    // Recurring shows have no confirmed dates, so no Event markup is emitted.
    expect(evTypes).not.toContain("Event");
  });
});

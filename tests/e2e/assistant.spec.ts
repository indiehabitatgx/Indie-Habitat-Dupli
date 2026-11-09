import { expect, test } from "@playwright/test";

test.describe("Habitat assistant", () => {
  test("answers with grounded text and page links", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Open the Habitat assistant" }).click();
    const panel = page.getByRole("dialog", { name: /Habitat Assistant/ });
    await expect(panel).toBeVisible();
    await expect(page.locator("#assistant-input")).toBeFocused();

    await page.locator("#assistant-input").fill("how much is mass bunk?");
    await page.keyboard.press("Enter");
    await expect(panel.getByRole("status", { name: "Assistant is thinking" })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Mass Bunk/ })).toHaveAttribute("href", "/events/mass-bunk", { timeout: 8000 });
    await expect(panel).toContainText("₹199");

    await panel.getByRole("button", { name: "Start a new chat" }).click();
    await panel.getByRole("button", { name: "Book a private event" }).click();
    await expect(panel.getByRole("link", { name: /Send an event enquiry/ })).toHaveAttribute("href", "/corporate-events#enquire", { timeout: 8000 });

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("unknown questions get an honest fallback", async ({ page }) => {
    await page.goto("/faq");
    await page.getByRole("button", { name: "Open the Habitat assistant" }).click();
    await page.locator("#assistant-input").fill("do you sell vintage bicycles");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toContainText("rather not guess", { timeout: 8000 });
  });

  test("API validates input", async ({ request }) => {
    expect((await request.post("/api/chat", { data: { messages: [] } })).status()).toBe(400);
    expect((await request.post("/api/chat", { data: { messages: [{ role: "assistant", content: "hi" }] } })).status()).toBe(400);
    const ok = await request.post("/api/chat", { data: { messages: [{ role: "user", content: "parking?" }] } });
    expect(ok.status()).toBe(200);
    const lines = (await ok.text()).trim().split("\n").map((l) => JSON.parse(l));
    expect(lines[0].type).toBe("meta");
    expect(lines.some((l) => l.type === "delta" && /no parking/i.test(l.text))).toBe(true);
    expect(lines.at(-1).type).toBe("done");
  });
});

test("header floats as a glass pill after scrolling; scroll-to-top sits bottom-left, assistant bottom-right", async ({ page }) => {
  await page.goto("/about");
  const bar = page.locator("header > div").first();
  await expect(bar).not.toHaveAttribute("data-floating", /.*/);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toHaveAttribute("data-floating", "true");
  await expect(bar).toHaveClass(/liquid-glass/);
  const top = await page.getByRole("button", { name: "Scroll to top" }).boundingBox();
  const chat = await page.getByRole("button", { name: "Open the Habitat assistant" }).boundingBox();
  const vw = page.viewportSize()!.width;
  expect(top!.x).toBeLessThan(vw / 2);
  expect(chat!.x).toBeGreaterThan(vw / 2);
});

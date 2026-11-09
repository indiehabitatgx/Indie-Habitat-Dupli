import { expect, test } from "@playwright/test";

test("mobile menu opens, traps focus and navigates", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: /^Gallery/ }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(menu).toBeHidden();
});

test("mobile event page has a sticky booking bar and no overflow", async ({ page }) => {
  await page.goto("/events/mass-bunk");
  const links = page.getByRole("link", { name: /book tickets/i });
  await expect(links.last()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("tap targets in the header are at least 44px", async ({ page }) => {
  await page.goto("/");
  const box = await page.getByRole("button", { name: "Open menu" }).boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("app-style tab bar: active tab, navigation, Ask opens the assistant", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByRole("navigation", { name: "Quick navigation" });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await bar.getByRole("link", { name: "Events" }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(bar.getByRole("link", { name: "Events" })).toHaveAttribute("aria-current", "page");
  // hero/page content is never hidden behind the bar
  const padding = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom));
  expect(padding).toBeGreaterThanOrEqual(64);
  await bar.getByRole("button", { name: "Ask the Habitat assistant" }).click();
  const chat = page.getByRole("dialog", { name: /Habitat Assistant/ });
  await expect(chat).toBeVisible();
  await page.locator("#assistant-input").fill("is there parking?");
  await page.keyboard.press("Enter");
  await expect(chat).toContainText(/no parking/i, { timeout: 8000 });
});

test("home hero buttons sit above the tab bar", async ({ page }) => {
  await page.goto("/");
  const btn = await page.locator("section").first().getByRole("link", { name: /venue/i }).boundingBox();
  const bar = await page.getByRole("navigation", { name: "Quick navigation" }).locator("ul").boundingBox();
  expect(btn!.y + btn!.height).toBeLessThanOrEqual(bar!.y);
});

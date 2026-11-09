import { expect, test } from "@playwright/test";

test("themed loader shows on first load and then clears without blocking clicks", async ({ page }) => {
  await page.goto("/");
  const loader = page.locator(".page-loader");
  await expect(loader).toHaveCount(1);
  await expect(loader).toBeHidden({ timeout: 3000 });
  expect(await loader.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
});

test("navigating shows the loader and every new page starts at the top", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".page-loader")).toBeHidden({ timeout: 3000 });
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForFunction(() => window.scrollY > 1000);
  const link = page.locator('a[href="/gallery"]').last(); // footer link, far down the page
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page.locator('.page-loader[data-state="in"]')).toHaveCount(1);
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.locator(".page-loader")).toBeHidden({ timeout: 4000 });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("scroll-to-top button appears after scrolling and returns to the top", async ({ page }) => {
  await page.goto("/about");
  const btn = page.getByRole("button", { name: "Scroll to top" });
  await expect(btn).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(btn).toBeVisible();
  await btn.click();
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 4000 });
});

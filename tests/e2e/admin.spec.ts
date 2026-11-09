import { expect, test, type Page } from "@playwright/test";

const EMAIL = process.env.ADMIN_EMAIL!;
const PASSWORD = process.env.ADMIN_PASSWORD!;

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("admin", () => {
  test("is protected", async ({ page, request }) => {
    await page.goto("/admin/events");
    await expect(page).toHaveURL(/\/admin\/login$/);
    expect((await request.get("/api/admin/export-subscribers")).status()).toBe(401);
    const res = await request.get("/admin/login");
    expect(res.headers()["x-robots-tag"] ?? (await res.text())).toMatch(/noindex/);
  });

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Incorrect email or password.")).toBeVisible();
  });

  test("event CRUD flows through to the public site", async ({ page }) => {
    const slug = `e2e-show-${Date.now()}`;
    await login(page);
    await page.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Events" }).click();
    await page.getByRole("link", { name: "New event" }).click();

    await page.locator("#title").fill("E2E Test Show");
    await expect(page.locator("#slug")).toHaveValue("e2e-test-show"); // auto slug
    await page.locator("#slug").fill(slug);
    await page.locator("#shortDescription").fill("An automated test show description.");
    await page.locator("#description").fill("Created by the Playwright suite and deleted at the end.");
    await page.locator("#categoryId").selectOption({ label: "Music" });
    await page.getByLabel("Wed").check();
    await page.locator("#scheduleText").fill("Wed · 9:00 PM");
    await page.locator("#startTime").fill("21:00");
    await page.locator("#ticketPrice").fill("450");
    await page.locator("#bookingUrl").fill("https://in.bookmyshow.com/venue/the-habitat-mumbai/TFST");
    await page.locator("#bannerFile").setInputFiles("public/images/venue/jam-room.webp");
    await page.locator("#status").selectOption("PUBLISHED");
    await page.getByRole("button", { name: "Create event" }).click();
    await expect(page).toHaveURL(/\/admin\/events\/[a-z0-9]+\?created=1/);
    await expect(page.getByText("Event created.")).toBeVisible();

    // Public site reflects it (Music category appears because an event now uses it)
    await page.goto(`/events/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("E2E Test Show");
    await expect(page.locator("main img").first()).toHaveAttribute("src", /uploads/);
    await page.goto("/events");
    await expect(page.getByRole("button", { name: "Music", exact: true })).toBeVisible();

    // Update → unpublish
    await page.goBack();
    await page.goto("/admin/events");
    await page.getByRole("link", { name: "E2E Test Show" }).click();
    await page.locator("#status").selectOption("DRAFT");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Event saved.")).toBeVisible();
    expect((await page.request.get(`/events/${slug}`)).status()).toBe(404);

    // Delete
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events\?deleted=1/);
    await expect(page.getByRole("link", { name: "E2E Test Show" })).toHaveCount(0);
  });

  test("duplicate slugs are rejected", async ({ page }) => {
    await login(page);
    await page.goto("/admin/events/new");
    await page.locator("#title").fill("Duplicate");
    await page.locator("#slug").fill("comedy-roulette");
    await page.locator("#shortDescription").fill("Duplicate slug test entry.");
    await page.locator("#description").fill("Duplicate slug test entry.");
    await page.locator("#categoryId").selectOption({ label: "Comedy" });
    await page.getByLabel("Mon").check();
    await page.locator("#scheduleText").fill("Mon");
    await page.getByRole("button", { name: "Create event" }).click();
    await expect(page.getByText("That slug is already used by another event.")).toBeVisible();
  });

  test("enquiries, subscribers export, settings and logout", async ({ page, request }) => {
    // Seed one of each enquiry through the public API so this test is independent of order.
    const date = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10);
    expect((await request.post("/api/contact", { data: { name: "E2E Tester", email: "admin-e2e@example.com", purpose: "Other", message: "seed" } })).ok()).toBe(true);
    expect(
      (
        await request.post("/api/enquiry", {
          data: { name: "Corp Seed", organisation: "Acme Pvt Ltd", email: "corp-e2e@example.com", phone: "+91 98765 43210", eventType: "Seminar", preferredDate: date, attendees: "16 - 30", duration: "3 Hours", foodBeverage: "A la Carte", technical: [] },
        })
      ).ok(),
    ).toBe(true);
    await login(page);
    await page.goto("/admin/enquiries");
    await expect(page.getByText("E2E Tester").first()).toBeVisible();
    await page.getByRole("link", { name: /Corporate & private/ }).click();
    await expect(page.getByText("Acme Pvt Ltd").first()).toBeVisible();

    const csv = await page.request.get("/api/admin/export-subscribers");
    expect(csv.status()).toBe(200);
    expect(await csv.text()).toContain('"email","subscribed_at"');

    await page.goto("/admin/settings");
    const msg = `E2E announcement ${Date.now()}`;
    await page.locator("#announcement").fill(msg);
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved")).toBeVisible();
    await page.goto("/faq");
    await expect(page.getByRole("region", { name: "Announcement" })).toContainText(msg);

    // restore default text
    await page.goto("/admin/settings");
    await page.locator("#announcement").fill("Show times and prices are as last published by The Habitat. Please confirm on BookMyShow before you head over.");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved")).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});

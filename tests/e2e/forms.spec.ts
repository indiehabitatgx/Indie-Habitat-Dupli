import { expect, test } from "@playwright/test";

const stamp = Date.now();

test("contact form validates then submits", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please tell us your name")).toBeVisible();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");

  await page.locator("#contact-name").fill("E2E Tester");
  await page.locator("#contact-email").fill(`e2e+${stamp}@example.com`);
  await page.locator("#contact-purpose").selectOption("Perform at The Habitat");
  await page.locator("#contact-message").fill("Automated test message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status").filter({ hasText: "your message is with the team" })).toBeVisible();
});

test("venue booking form submits with guests", async ({ page }) => {
  await page.goto("/venue/above-the-habitat");
  await page.locator("#book-above-the-habitat-name").fill("Venue Tester");
  await page.locator("#book-above-the-habitat-email").fill(`venue+${stamp}@example.com`);
  await page.locator("#book-above-the-habitat-purpose").selectOption("Concert");
  await page.locator("#book-above-the-habitat-guests").selectOption("100 - 350 pax");
  await page.getByRole("button", { name: "Send booking request" }).click();
  await expect(page.getByRole("status").filter({ hasText: "your message is with the team" })).toBeVisible();
});

test("corporate enquiry validates and submits", async ({ page }) => {
  await page.goto("/corporate-events#enquire");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Choose an event type")).toBeVisible();

  const date = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  await page.locator("#corp-name").fill("Corp Tester");
  await page.locator("#corp-organisation").fill("Acme Pvt Ltd");
  await page.locator("#corp-email").fill(`corp+${stamp}@example.com`);
  await page.locator("#corp-phone").fill("+91 98765 43210");
  await page.locator("#corp-eventType").selectOption("Conference");
  await page.locator("#corp-preferredDate").fill(date);
  await page.locator("#corp-attendees").selectOption("30 - 45");
  await page.locator("#corp-duration").selectOption("Full Day");
  await page.locator("#corp-foodBeverage").selectOption("AM-Tea-Lunch-PM-Tea");
  await page.getByLabel("Projector & Screen").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Enquiry received")).toBeVisible();
});

test("newsletter subscribe", async ({ page }) => {
  await page.goto("/");
  await page.locator("#home-newsletter-email").fill(`news+${stamp}@example.com`);
  await page.locator("#home-newsletter-email").press("Enter");
  await expect(page.getByText("You're on the list")).toBeVisible();
});

test.describe("API hardening", () => {
  test("rejects invalid payloads with field errors", async ({ request }) => {
    const res = await request.post("/api/enquiry", { data: { name: "x" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors.email).toBeTruthy();
  });
  test("rejects cross-origin posts", async ({ request }) => {
    const res = await request.post("/api/newsletter", { data: { email: "x@y.in" }, headers: { Origin: "https://evil.example" } });
    expect(res.status()).toBe(403);
  });
  test("honeypot submissions are silently dropped", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "Bot", email: "b@o.t", purpose: "Other", company: "spam" } });
    expect(res.status()).toBe(200);
  });
  test("malformed JSON is a 400", async ({ request }) => {
    const res = await request.post("/api/contact", { data: Buffer.from("{not json"), headers: { "Content-Type": "application/json" } });
    expect(res.status()).toBe(400);
  });
});

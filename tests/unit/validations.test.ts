import { describe, expect, it } from "vitest";
import { contactSchema, corporateSchema, eventFormSchema, newsletterSchema } from "@/lib/validations";

const future = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);

describe("contactSchema", () => {
  it("accepts a valid enquiry", () => {
    const r = contactSchema.safeParse({ name: "Asha", email: "asha@example.com", purpose: "Other", message: "Hi" });
    expect(r.success).toBe(true);
  });
  it("rejects bad email, unknown purpose and filled honeypot", () => {
    expect(contactSchema.safeParse({ name: "A B", email: "nope", purpose: "Other" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "A B", email: "a@b.co", purpose: "Hack" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "A B", email: "a@b.co", purpose: "Other", company: "bot" }).success).toBe(false);
  });
  it("only allows contact or venue:<slug> sources", () => {
    expect(contactSchema.safeParse({ name: "A B", email: "a@b.co", purpose: "Comedy", source: "venue:the-habitat" }).success).toBe(true);
    expect(contactSchema.safeParse({ name: "A B", email: "a@b.co", purpose: "Comedy", source: "<script>" }).success).toBe(false);
  });
});

describe("corporateSchema", () => {
  const valid = {
    name: "Ravi",
    email: "ravi@co.in",
    phone: "+91 98765 43210",
    eventType: "Conference",
    preferredDate: future,
    attendees: "30 - 45",
    duration: "Full Day",
    foodBeverage: "F&B Package",
    technical: ["Sound"],
  };
  it("accepts the original form's options", () => expect(corporateSchema.safeParse(valid).success).toBe(true));
  it("rejects past dates", () => expect(corporateSchema.safeParse({ ...valid, preferredDate: "2020-01-01" }).success).toBe(false));
  it("rejects invalid phone", () => expect(corporateSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false));
});

describe("newsletterSchema", () => {
  it("validates email", () => {
    expect(newsletterSchema.safeParse({ email: "x@y.in" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "x" }).success).toBe(false);
  });
});

describe("eventFormSchema", () => {
  const base = {
    title: "Test Show",
    slug: "test-show",
    shortDescription: "A short description",
    description: "A longer description",
    categoryId: "c1",
    recurrence: "WEEKLY",
    scheduleDays: ["4", "5"],
    scheduleText: "Thu & Fri",
    startTime: "20:00",
    ticketPrice: "300",
    bookingUrl: "https://in.bookmyshow.com/x",
    bannerImage: "",
    status: "DRAFT",
  };
  it("coerces values", () => {
    const r = eventFormSchema.parse(base);
    expect(r.scheduleDays).toEqual([4, 5]);
    expect(r.ticketPrice).toBe(300);
    expect(r.bannerImage).toBeNull();
  });
  it("rejects bad slugs, non-http booking urls and arbitrary image paths", () => {
    expect(eventFormSchema.safeParse({ ...base, slug: "Bad Slug" }).success).toBe(false);
    expect(eventFormSchema.safeParse({ ...base, bookingUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(eventFormSchema.safeParse({ ...base, bannerImage: "https://evil.example/x.png" }).success).toBe(false);
  });
  it("interprets datetime-local input as IST", () => {
    const r = eventFormSchema.parse({ ...base, recurrence: "ONE_OFF", startDate: "2026-12-31T20:00" });
    expect(r.startDate?.toISOString()).toBe("2026-12-31T14:30:00.000Z");
  });
});

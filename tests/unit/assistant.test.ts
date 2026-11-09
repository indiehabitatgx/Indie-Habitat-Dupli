import { describe, expect, it } from "vitest";
import { answerQuestion, knowledgeText, type Knowledge } from "@/lib/assistant/engine";
import { faqs } from "@/lib/faq";

const bms = "https://in.bookmyshow.com/events/x";
const kb: Knowledge = {
  announcement: "Show times and prices are as last published by The Habitat.",
  artists: [],
  events: [
    { title: "All Star Standup Comedy", slug: "all-star-standup-comedy", category: "Comedy", shortDescription: "The best in stand-up.", days: [0, 1, 2, 3, 4, 5, 6], scheduleText: "Daily · 10:00 PM", startTime: "22:00", priceNote: "Mon–Fri ₹300 · Sat–Sun ₹500", ticketPrice: 300, bookingUrl: bms, bookingProvider: "BookMyShow" },
    { title: "Midnight All Star Standup Comedy", slug: "midnight-all-star-standup-comedy", category: "Comedy", shortDescription: "Last show in the city.", days: [0, 1, 2, 3, 4, 5, 6], scheduleText: "Every night · midnight", startTime: "23:59", priceNote: "Mon–Fri ₹300 · Sat–Sun ₹500", ticketPrice: 300, bookingUrl: bms, bookingProvider: "BookMyShow" },
    { title: "Mass Bunk", slug: "mass-bunk", category: "Comedy", shortDescription: "Student-spirit stand-up.", days: [5, 6, 0], scheduleText: "Fri 6:00 PM · Sat & Sun 4:00 PM", startTime: "16:00", priceNote: "Every Friday, Saturday & Sunday · ₹199", ticketPrice: 199, bookingUrl: bms, bookingProvider: "BookMyShow" },
    { title: "Comedy Roulette", slug: "comedy-roulette", category: "Comedy", shortDescription: "5–6 comics plus a host.", days: [4, 5], scheduleText: "Thu & Fri · 8:00 PM", startTime: "20:00", priceNote: "₹300", ticketPrice: 300, bookingUrl: bms, bookingProvider: "BookMyShow" },
    { title: "Poetry Open Mic", slug: "poetry-open-mic", category: "Poetry", shortDescription: "Weekly poetry.", days: [0, 1], scheduleText: "Sun 2:00 PM · Mon 8:00 PM", startTime: "14:00", priceNote: "₹250", ticketPrice: 250, bookingUrl: bms, bookingProvider: "BookMyShow venue page" },
    { title: "Comedy Open Mic", slug: "comedy-open-mic", category: "Comedy", shortDescription: "Monday open mic.", days: [1], scheduleText: "Mon · 7:00 PM & 9:00 PM", startTime: "19:00", priceNote: "₹300", ticketPrice: 300, bookingUrl: bms, bookingProvider: "BookMyShow venue page" },
  ],
};

const ask = (q: string, now?: Date) => answerQuestion(q, kb, now);
const hrefs = (q: string) => ask(q).links.map((l) => l.href);

describe("assistant engine", () => {
  it("answers named shows with schedule, price and booking link", () => {
    const a = ask("how much is mass bunk?");
    expect(a.intent).toBe("event:mass-bunk");
    expect(a.text).toContain("₹199");
    expect(hrefs("tell me about comedy roulette")).toContain("/events/comedy-roulette");
    expect(ask("what time is the midnight show").intent).toBe("event:midnight-all-star-standup-comedy");
    expect(ask("poetry open mic timings").intent).toBe("event:poetry-open-mic");
  });

  it("answers day-based questions in IST", () => {
    // 2026-11-13 is a Friday
    const a = ask("what's on tonight?", new Date("2026-11-13T12:00:00+05:30"));
    expect(a.intent).toBe("day");
    expect(a.text).toContain("Mass Bunk");
    expect(a.text).toContain("Comedy Roulette");
    expect(a.text).not.toContain("Poetry Open Mic");
    const mon = ask("any poetry on monday?");
    expect(mon.text).toContain("Poetry Open Mic");
    expect(mon.text).not.toContain("Mass Bunk");
  });

  it("covers tickets, venue, private events and policies", () => {
    expect(ask("how do I buy tickets").intent).toBe("tickets");
    expect(ask("what is the capacity of the venue").intent).toBe("venue");
    expect(ask("can I book the place for a birthday party?").intent).toBe("private");
    expect(hrefs("corporate offsite for 40 people")).toContain("/corporate-events#enquire");
    expect(ask("can my 16 year old kid come?").text).toMatch(/18\+/);
    expect(ask("is there parking").text).toMatch(/no parking/i);
    expect(ask("can I get a refund if I can't make it").text).toMatch(/can't be exchanged or refunded/);
    expect(ask("what if I'm late").text).toMatch(/5 minutes after/);
    expect(ask("are seats numbered").intent).toBe("seating");
    expect(ask("where are you located").intent).toBe("location");
    expect(ask("phone number?").intent).toBe("contact");
    expect(ask("I want to perform").intent).toBe("perform");
    expect(ask("podcast recording studio").intent).toBe("jam");
    expect(ask("how big is above the habitat").intent).toBe("above");
  });

  it("greets, thanks, and refuses to guess", () => {
    expect(ask("hi").intent).toBe("hello");
    expect(ask("thanks!").intent).toBe("thanks");
    const f = ask("do you sell vintage bicycles");
    expect(f.intent).toBe("fallback");
    expect(f.text).toMatch(/rather not guess/);
  });

  it("only produces internal paths or allow-listed external links", () => {
    for (const q of ["tickets", "hi", "location", "private party", "open mic", "status", "jam room", "gallery", "random question"]) {
      for (const l of ask(q).links) {
        expect(l.href.startsWith("/") || /^(https:\/\/(in\.bookmyshow\.com|www\.google\.com|www\.instagram\.com|www\.youtube\.com|wa\.me)|tel:)/.test(l.href)).toBe(true);
      }
    }
  });

  it("builds a knowledge base with every show and FAQ", () => {
    const t = knowledgeText(kb, faqs);
    for (const e of kb.events) expect(t).toContain(e.title);
    expect(t).toContain("18+");
  });
});

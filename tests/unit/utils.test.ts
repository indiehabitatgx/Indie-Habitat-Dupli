import { describe, expect, it } from "vitest";
import { formatDays, formatPrice, formatTime, isSafeHttpUrl, slugify } from "@/lib/utils";

describe("slugify", () => {
  it("creates url-safe slugs", () => {
    expect(slugify("Comedy Roulette!")).toBe("comedy-roulette");
    expect(slugify("  Rock & Roll Night  ")).toBe("rock-and-roll-night");
    expect(slugify("Café Évening")).toBe("cafe-evening");
  });
  it("caps length", () => {
    expect(slugify("a".repeat(200)).length).toBe(80);
  });
});

describe("formatDays", () => {
  it("labels every day as Daily", () => expect(formatDays([0, 1, 2, 3, 4, 5, 6])).toBe("Daily"));
  it("orders Monday first", () => expect(formatDays([0, 5, 6])).toBe("Fri · Sat · Sun"));
  it("dedupes", () => expect(formatDays([4, 4, 5])).toBe("Thu · Fri"));
  it("handles empty", () => expect(formatDays([])).toBe(""));
});

describe("formatPrice / formatTime", () => {
  it("formats INR", () => {
    expect(formatPrice(300)).toBe("₹300");
    expect(formatPrice(null)).toBeNull();
  });
  it("formats 24h to 12h", () => {
    expect(formatTime("22:00")).toBe("10:00 PM");
    expect(formatTime("00:30")).toBe("12:30 AM");
    expect(formatTime("12:05")).toBe("12:05 PM");
    expect(formatTime("bad")).toBeNull();
  });
});

describe("isSafeHttpUrl", () => {
  it("accepts http(s) only", () => {
    expect(isSafeHttpUrl("https://in.bookmyshow.com/x")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("not a url")).toBe(false);
  });
});

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Compact human label for a set of weekdays, e.g. [0..6] → "Daily", [4,5] → "Thu · Fri". */
export function formatDays(days: number[]) {
  // Monday-first, as Indian event listings usually read.
  const sorted = [...new Set(days)].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  if (sorted.length === 7) return "Daily";
  if (sorted.length === 0) return "";
  return sorted.map((d) => DAY_SHORT[d]).join(" · ");
}

export function formatPrice(rupees: number | null | undefined) {
  if (rupees == null) return null;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** "22:00" → "10:00 PM" */
export function formatTime(hhmm: string | null | undefined) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(d));
}

/**
 * Public origin of the site. Uses NEXT_PUBLIC_SITE_URL, unless it's unset or still a placeholder, then the
 * host's own production URL (Vercel: VERCEL_PROJECT_PRODUCTION_URL, Netlify: URL), then localhost.
 */
export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && !/your-site/i.test(configured)) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.URL) return process.env.URL.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  const base = siteOrigin();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isSafeHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

import { z } from "zod";

const phoneRegex = /^[+()\-\s0-9]{7,20}$/;

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Honeypot: real users never fill this hidden field. */
const honeypot = z.string().max(0, "Bot detected").optional();

export const CONTACT_PURPOSES = [
  "Book 'Above The Habitat'",
  "Book the Jam Room",
  "Perform at The Habitat",
  "My brand at The Habitat",
  "Other",
] as const;

export const VENUE_PURPOSES = ["Comedy", "Concert", "Podcast Recording", "Conference", "Celebration/Party"] as const;
export const VENUE_GUESTS = ["0 - 55 pax", "55 - 100 pax", "100 - 350 pax"] as const;

export const contactSchema = z.object({
  name: trimmed(120).min(2, "Please tell us your name"),
  email: z.email("Enter a valid email address").max(200),
  phone: optionalText(20).refine((v) => !v || phoneRegex.test(v), "Enter a valid phone number"),
  purpose: z.enum([...CONTACT_PURPOSES, ...VENUE_PURPOSES], { error: "Choose a purpose" }),
  guests: z.enum(VENUE_GUESTS).optional(),
  message: optionalText(3000),
  source: z
    .string()
    .regex(/^(contact|venue:[a-z0-9-]+)$/)
    .default("contact"),
  company: honeypot,
});
export type ContactInput = z.input<typeof contactSchema>;

/** Option lists taken verbatim from the original banquets & conferences form. */
export const CORPORATE_EVENT_TYPES = [
  "Conference",
  "Seminar",
  "Pre-Wedding Function / Anniversary",
  "Corporate Team-Building/Retreat",
  "Other",
] as const;
export const CORPORATE_GUESTS = ["0 - 15", "16 - 30", "30 - 45", "45 - 60", "60 - 120"] as const;
export const CORPORATE_DURATIONS = [
  "1 Hour",
  "2 Hours",
  "3 Hours",
  "4 Hours",
  "5 Hours",
  "6 Hours",
  "7 - 10 Hours",
  "Full Day",
  "Multiple Days",
] as const;
export const CORPORATE_FNB = [
  "A la Carte",
  "F&B Package",
  "AM-Tea-Lunch-PM-Tea",
  "F&B Package with Alcohol",
  "No F&B Requirements",
] as const;
export const CORPORATE_TECH = ["Sound", "Lighting", "Projector & Screen"] as const;

export const corporateSchema = z.object({
  name: trimmed(120).min(2, "Please tell us your name"),
  organisation: optionalText(160),
  email: z.email("Enter a valid email address").max(200),
  phone: trimmed(20).regex(phoneRegex, "Enter a valid phone number"),
  eventType: z.enum(CORPORATE_EVENT_TYPES, { error: "Choose an event type" }),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
    .refine((v) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(`${v}T00:00:00`) >= today;
    }, "Choose a date in the future"),
  attendees: z.enum(CORPORATE_GUESTS, { error: "Choose the number of guests" }),
  duration: z.enum(CORPORATE_DURATIONS, { error: "Choose a duration" }),
  foodBeverage: z.enum(CORPORATE_FNB, { error: "Choose a food & beverage option" }),
  technical: z.array(z.enum(CORPORATE_TECH)).default([]),
  message: optionalText(3000),
  company: honeypot,
});
export type CorporateInput = z.input<typeof corporateSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address").max(200),
  company: honeypot,
});
export type NewsletterInput = z.input<typeof newsletterSchema>;

export const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(8).max(200),
});

const slugField = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Must start with https://")
  .transform((v) => v || null);

const imagePath = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || v.startsWith("/images/") || v.startsWith("/uploads/"), "Use an uploaded image path")
  .transform((v) => v || null);

export const eventFormSchema = z.object({
  title: trimmed(160).min(2),
  slug: slugField,
  shortDescription: trimmed(300).min(10),
  description: trimmed(6000).min(10),
  categoryId: z.string().min(1, "Choose a category"),
  venueId: z
    .string()
    .optional()
    .transform((v) => v || null),
  recurrence: z.enum(["ONE_OFF", "WEEKLY"]),
  scheduleDays: z.array(z.coerce.number().int().min(0).max(6)).default([]),
  scheduleText: trimmed(200).min(2),
  startDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(/[zZ]|[+-]\d\d:\d\d$/.test(v) ? v : `${v.length === 16 ? `${v}:00` : v}+05:30`) : null)),
  endDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(/[zZ]|[+-]\d\d:\d\d$/.test(v) ? v : `${v.length === 16 ? `${v}:00` : v}+05:30`) : null)),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .or(z.literal(""))
    .transform((v) => v || null),
  ticketPrice: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v < 1_000_000), "Whole rupees only"),
  priceNote: optionalText(200).transform((v) => v ?? null),
  bookingUrl: urlOrEmpty,
  bookingProvider: optionalText(60).transform((v) => v ?? null),
  terms: optionalText(3000).transform((v) => v ?? null),
  bannerImage: imagePath,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  seoTitle: optionalText(70).transform((v) => v ?? null),
  seoDescription: optionalText(170).transform((v) => v ?? null),
});

export const artistFormSchema = z.object({
  name: trimmed(120).min(2),
  slug: slugField,
  biography: trimmed(6000).min(10),
  profileImage: imagePath,
  instagram: urlOrEmpty,
  youtube: urlOrEmpty,
  x: urlOrEmpty,
  website: urlOrEmpty,
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const GALLERY_CATEGORIES = ["Venue", "Comedy", "Music", "Events", "Community", "Studio"] as const;

export const galleryFormSchema = z.object({
  title: trimmed(160).min(2),
  alt: trimmed(300).min(5, "Describe the image for screen readers"),
  category: z.enum(GALLERY_CATEGORIES),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const settingsSchema = z.object({
  announcement: trimmed(240),
  announcementEnabled: z.boolean(),
  aboutStory: trimmed(5000),
});

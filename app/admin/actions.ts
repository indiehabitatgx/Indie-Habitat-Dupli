"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteUpload, saveImageUpload } from "@/lib/uploads";
import { INSTAGRAM_TAG } from "@/lib/instagram";
import { artistFormSchema, eventFormSchema, galleryFormSchema, settingsSchema } from "@/lib/validations";

export type ActionState = { ok: boolean; message: string; fieldErrors?: Record<string, string[]> } | null;

function errorsOf(err: z.ZodError) {
  const out: Record<string, string[]> = {};
  for (const i of err.issues) (out[String(i.path[0] ?? "form")] ??= []).push(i.message);
  return out;
}

function isUniqueViolation(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002";
}

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
}

function file(fd: FormData, k: string) {
  const v = fd.get(k);
  return v instanceof File && v.size > 0 ? v : null;
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* ───────────────────────────── Events ───────────────────────────── */

export async function saveEvent(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = eventFormSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    shortDescription: str(fd, "shortDescription"),
    description: str(fd, "description"),
    categoryId: str(fd, "categoryId"),
    venueId: str(fd, "venueId"),
    recurrence: str(fd, "recurrence"),
    scheduleDays: fd.getAll("scheduleDays").map(String),
    scheduleText: str(fd, "scheduleText"),
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    startTime: str(fd, "startTime"),
    ticketPrice: str(fd, "ticketPrice"),
    priceNote: str(fd, "priceNote"),
    bookingUrl: str(fd, "bookingUrl"),
    bookingProvider: str(fd, "bookingProvider"),
    terms: str(fd, "terms"),
    bannerImage: str(fd, "bannerImage"),
    status: str(fd, "status"),
    featured: fd.get("featured") === "on",
    sortOrder: str(fd, "sortOrder") || "0",
    seoTitle: str(fd, "seoTitle"),
    seoDescription: str(fd, "seoDescription"),
  });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errorsOf(parsed.error) };
  const d = parsed.data;

  if (d.recurrence === "WEEKLY" && d.scheduleDays.length === 0)
    return { ok: false, message: "Pick at least one day for a weekly show.", fieldErrors: { scheduleDays: ["Required for weekly shows"] } };
  if (d.recurrence === "ONE_OFF" && !d.startDate)
    return { ok: false, message: "One-off events need a date.", fieldErrors: { startDate: ["Required for one-off events"] } };

  let banner = { bannerImage: d.bannerImage, posterWidth: undefined as number | undefined, posterHeight: undefined as number | undefined };
  const upload = file(fd, "bannerFile");
  if (upload) {
    try {
      const saved = await saveImageUpload(upload, 1600);
      await db.mediaAsset.create({
        data: { filename: upload.name.slice(0, 200), path: saved.path, mimeType: saved.mimeType, size: saved.size, width: saved.width, height: saved.height, alt: d.title, uploadedBy: session.email },
      });
      banner = { bannerImage: saved.path, posterWidth: saved.width, posterHeight: saved.height };
    } catch (e) {
      return { ok: false, message: (e as Error).message, fieldErrors: { bannerFile: [(e as Error).message] } };
    }
  }

  const data = {
    title: d.title,
    slug: d.slug,
    shortDescription: d.shortDescription,
    description: d.description,
    categoryId: d.categoryId,
    venueId: d.venueId,
    recurrence: d.recurrence,
    scheduleDays: d.recurrence === "WEEKLY" ? d.scheduleDays : [],
    scheduleText: d.scheduleText,
    startDate: d.recurrence === "ONE_OFF" ? d.startDate : null,
    endDate: d.recurrence === "ONE_OFF" ? d.endDate : null,
    startTime: d.startTime,
    ticketPrice: d.ticketPrice,
    priceNote: d.priceNote,
    bookingUrl: d.bookingUrl,
    bookingProvider: d.bookingProvider,
    terms: d.terms,
    bannerImage: banner.bannerImage,
    thumbnailImage: banner.bannerImage,
    ...(banner.posterWidth ? { posterWidth: banner.posterWidth, posterHeight: banner.posterHeight } : {}),
    status: d.status,
    featured: d.featured,
    sortOrder: d.sortOrder,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };

  let savedId = id;
  try {
    if (id) await db.event.update({ where: { id }, data });
    else savedId = (await db.event.create({ data })).id;
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, message: "That slug is already used by another event.", fieldErrors: { slug: ["Already in use"] } };
    throw e;
  }
  refreshPublic();
  if (!id) redirect(`/admin/events/${savedId}?created=1`);
  return { ok: true, message: "Event saved." };
}

export async function deleteEvent(id: string) {
  await requireAdmin("ADMIN");
  await db.event.delete({ where: { id } });
  refreshPublic();
  redirect("/admin/events?deleted=1");
}

export async function toggleEventFeatured(id: string, featured: boolean) {
  await requireAdmin();
  await db.event.update({ where: { id }, data: { featured } });
  refreshPublic();
  revalidatePath("/admin/events");
}

/* ───────────────────────────── Artists ───────────────────────────── */

export async function saveArtist(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = artistFormSchema.safeParse({
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    biography: str(fd, "biography"),
    profileImage: str(fd, "profileImage"),
    instagram: str(fd, "instagram"),
    youtube: str(fd, "youtube"),
    x: str(fd, "x"),
    website: str(fd, "website"),
    featured: fd.get("featured") === "on",
    status: str(fd, "status"),
  });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errorsOf(parsed.error) };
  const d = parsed.data;

  let profileImage = d.profileImage;
  const upload = file(fd, "profileFile");
  if (upload) {
    try {
      const saved = await saveImageUpload(upload, 1200);
      await db.mediaAsset.create({
        data: { filename: upload.name.slice(0, 200), path: saved.path, mimeType: saved.mimeType, size: saved.size, width: saved.width, height: saved.height, alt: d.name, uploadedBy: session.email },
      });
      profileImage = saved.path;
    } catch (e) {
      return { ok: false, message: (e as Error).message, fieldErrors: { profileFile: [(e as Error).message] } };
    }
  }

  const socialLinks = Object.fromEntries(
    Object.entries({ instagram: d.instagram, youtube: d.youtube, x: d.x, website: d.website }).filter(([, v]) => v),
  );
  const data = { name: d.name, slug: d.slug, biography: d.biography, profileImage, socialLinks, featured: d.featured, status: d.status };

  let savedId = id;
  try {
    if (id) await db.artist.update({ where: { id }, data });
    else savedId = (await db.artist.create({ data })).id;
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, message: "That slug is already used by another artist.", fieldErrors: { slug: ["Already in use"] } };
    throw e;
  }
  refreshPublic();
  if (!id) redirect(`/admin/artists/${savedId}?created=1`);
  return { ok: true, message: "Artist saved." };
}

export async function deleteArtist(id: string) {
  await requireAdmin("ADMIN");
  await db.artist.delete({ where: { id } });
  refreshPublic();
  redirect("/admin/artists?deleted=1");
}

/* ───────────────────────────── Gallery ───────────────────────────── */

export async function addGalleryImage(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = galleryFormSchema.safeParse({
    title: str(fd, "title"),
    alt: str(fd, "alt"),
    category: str(fd, "category"),
    sortOrder: str(fd, "sortOrder") || "0",
    published: fd.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errorsOf(parsed.error) };
  const upload = file(fd, "image");
  if (!upload) return { ok: false, message: "Choose an image to upload.", fieldErrors: { image: ["Required"] } };
  try {
    const saved = await saveImageUpload(upload);
    await db.$transaction([
      db.mediaAsset.create({
        data: { filename: upload.name.slice(0, 200), path: saved.path, mimeType: saved.mimeType, size: saved.size, width: saved.width, height: saved.height, alt: parsed.data.alt, uploadedBy: session.email },
      }),
      db.galleryImage.create({ data: { ...parsed.data, src: saved.path, width: saved.width, height: saved.height } }),
    ]);
  } catch (e) {
    return { ok: false, message: (e as Error).message, fieldErrors: { image: [(e as Error).message] } };
  }
  refreshPublic();
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Image added to the gallery." };
}

export async function updateGalleryImage(id: string, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = galleryFormSchema.safeParse({
    title: str(fd, "title"),
    alt: str(fd, "alt"),
    category: str(fd, "category"),
    sortOrder: str(fd, "sortOrder") || "0",
    published: fd.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errorsOf(parsed.error) };
  await db.galleryImage.update({ where: { id }, data: parsed.data });
  refreshPublic();
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Saved." };
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin("ADMIN");
  const img = await db.galleryImage.delete({ where: { id } });
  if (img.src.startsWith("/uploads/")) {
    await deleteUpload(img.src);
    await db.mediaAsset.deleteMany({ where: { path: img.src } });
  }
  refreshPublic();
  revalidatePath("/admin/gallery");
}

/* ───────────────────────────── Enquiries & subscribers ───────────────────────────── */

const statusSchema = z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]);

export async function setEnquiryStatus(kind: "contact" | "corporate", id: string, status: string) {
  await requireAdmin();
  const s = statusSchema.parse(status);
  if (kind === "contact") await db.contactEnquiry.update({ where: { id }, data: { status: s } });
  else await db.corporateEnquiry.update({ where: { id }, data: { status: s } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiry(kind: "contact" | "corporate", id: string) {
  await requireAdmin("ADMIN");
  if (kind === "contact") await db.contactEnquiry.delete({ where: { id } });
  else await db.corporateEnquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin("ADMIN");
  await db.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}

/* ───────────────────────────── Settings ───────────────────────────── */

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin("ADMIN");
  const parsed = settingsSchema.safeParse({
    announcement: str(fd, "announcement"),
    announcementEnabled: fd.get("announcementEnabled") === "on",
    aboutStory: str(fd, "aboutStory"),
  });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errorsOf(parsed.error) };
  const entries = Object.entries({
    announcement: parsed.data.announcement,
    announcementEnabled: String(parsed.data.announcementEnabled),
    aboutStory: parsed.data.aboutStory,
  });
  await db.$transaction(entries.map(([key, value]) => db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })));
  refreshPublic();
  return { ok: true, message: "Settings saved. The live site updates immediately." };
}

/* ───────────────────────────── Instagram ───────────────────────────── */

export async function connectInstagram(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin("ADMIN");
  const token = str(fd, "instagramToken").trim();
  if (!/^[A-Za-z0-9_\-|.]{20,600}$/.test(token)) {
    return { ok: false, message: "Paste a valid long-lived Instagram access token.", fieldErrors: { instagramToken: ["Invalid token format"] } };
  }
  // Verify with Instagram before storing.
  let username = "";
  try {
    const res = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(token)}`, { cache: "no-store" });
    const body = (await res.json().catch(() => ({}))) as { username?: string; error?: { message?: string } };
    if (!res.ok || body.error || !body.username) {
      return { ok: false, message: `Instagram rejected the token: ${body.error?.message ?? `HTTP ${res.status}`}`, fieldErrors: { instagramToken: ["Rejected by Instagram"] } };
    }
    username = body.username;
  } catch {
    return { ok: false, message: "Couldn't reach Instagram to verify the token. Try again." };
  }
  const now = new Date().toISOString();
  await db.$transaction(
    [
      ["instagramToken", token],
      ["instagramUsername", username],
      ["instagramTokenRefreshedAt", now],
      ["instagramLastError", ""],
    ].map(([key, value]) => db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })),
  );
  updateTag(INSTAGRAM_TAG);
  refreshPublic();
  return { ok: true, message: `Connected @${username}. The homepage feed now shows live posts.` };
}

export async function syncInstagram() {
  await requireAdmin();
  updateTag(INSTAGRAM_TAG);
  refreshPublic();
  revalidatePath("/admin/settings");
}

export async function disconnectInstagram() {
  await requireAdmin("ADMIN");
  await db.siteSetting.deleteMany({ where: { key: { in: ["instagramToken", "instagramUsername", "instagramTokenRefreshedAt", "instagramLastError", "instagramLastSyncAt"] } } });
  updateTag(INSTAGRAM_TAG);
  refreshPublic();
  revalidatePath("/admin/settings");
}

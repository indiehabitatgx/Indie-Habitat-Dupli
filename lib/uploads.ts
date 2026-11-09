import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function uploadDir() {
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "storage/uploads");
}

/**
 * Validates, re-encodes (strips EXIF/GPS metadata) and stores an uploaded image as WebP.
 * Returns the public path served by app/uploads/[...path]/route.ts.
 */
export async function saveImageUpload(file: File, maxWidth = 2400) {
  if (!(file instanceof File) || file.size === 0) throw new Error("No file provided");
  if (!ALLOWED.has(file.type)) throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image must be 8 MB or smaller");

  const input = Buffer.from(await file.arrayBuffer());
  // sharp decodes the actual bytes — rejects files whose content isn't a real image regardless of declared type.
  const out = await sharp(input, { limitInputPixels: 50_000_000 })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const name = `${randomUUID()}.webp`;
  await mkdir(uploadDir(), { recursive: true });
  await sharp(out.data).toFile(path.join(/*turbopackIgnore: true*/ uploadDir(), name));
  return { path: `/uploads/${name}`, width: out.info.width, height: out.info.height, size: out.info.size, mimeType: "image/webp" };
}

/** Resolves an /uploads/... public path to a file inside the upload dir, or null if it escapes it. */
export function resolveUpload(publicPath: string) {
  if (!publicPath.startsWith("/uploads/")) return null;
  const rel = publicPath.slice("/uploads/".length);
  if (!/^[a-zA-Z0-9-]+\.(webp|png|jpe?g|avif)$/.test(rel)) return null;
  const full = path.join(/*turbopackIgnore: true*/ uploadDir(), rel);
  return full.startsWith(uploadDir() + path.sep) ? full : null;
}

export async function deleteUpload(publicPath: string) {
  const full = resolveUpload(publicPath);
  if (full) await unlink(/*turbopackIgnore: true*/ full).catch(() => undefined);
}

export async function readUpload(publicPath: string) {
  const full = resolveUpload(publicPath);
  if (!full) return null;
  try {
    return await readFile(/*turbopackIgnore: true*/ full);
  } catch {
    return null;
  }
}

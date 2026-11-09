import { readUpload } from "@/lib/uploads";

const TYPES: Record<string, string> = { webp: "image/webp", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", avif: "image/avif" };

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  if (parts.length !== 1) return new Response("Not found", { status: 404 });
  const publicPath = `/uploads/${parts[0]}`;
  const data = await readUpload(publicPath);
  if (!data) return new Response("Not found", { status: 404 });
  const ext = parts[0].split(".").pop()!.toLowerCase();
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

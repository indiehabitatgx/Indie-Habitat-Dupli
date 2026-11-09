import { sealAnnouncement } from "@/lib/realtime";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Renews the sealed live query for the public announcement bar (sealed queries are short-lived).
 * The announcement is public site content, so no session is required; the query and its parameters
 * are fixed on the server and cannot be changed by the caller.
 */
export async function POST(req: Request) {
  if (!rateLimit(`live-announcement:${clientIp(req.headers)}`, 30, 60_000).ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }
  const sealed = await sealAnnouncement();
  if (!sealed) return Response.json({ error: "Realtime is not configured" }, { status: 503 });
  return Response.json(sealed, { headers: { "Cache-Control": "no-store" } });
}

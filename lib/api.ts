import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import type { FormResponse } from "@/types/enquiry";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export function json(body: FormResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Rejects cross-site form posts: the Origin header (when present) must match the request host. */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Shared pipeline for public form endpoints:
 * origin check → rate limit → JSON parse → zod validation → honeypot → handler.
 */
export async function handleForm<S extends z.ZodType>(
  req: Request,
  scope: string,
  schema: S,
  handler: (data: z.output<S>) => Promise<FormResponse>,
  { limit = 5, windowMs = 60_000 } = {},
) {
  if (!sameOrigin(req)) return json({ ok: false, message: "Invalid request origin." }, 403);

  const rl = rateLimit(`${scope}:${clientIp(req.headers)}`, limit, windowMs);
  if (!rl.ok) return json({ ok: false, message: "Too many requests — please wait a minute and try again." }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  // Honeypot: silently accept so bots learn nothing.
  if (body && typeof body === "object" && "company" in body && typeof body.company === "string" && body.company.length > 0) {
    return json({ ok: true, message: "Thanks!" });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return json({ ok: false, message: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  try {
    return json(await handler(parsed.data));
  } catch (err) {
    console.error(`[api:${scope}]`, err);
    return json({ ok: false, message: "We couldn't save that just now. Please try again, or call +91 98333 58492." }, 500);
  }
}

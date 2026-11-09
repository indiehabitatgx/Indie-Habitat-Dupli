import "server-only";
import { db } from "@/lib/db";
import { INSTAGRAM_REVALIDATE_SECONDS, INSTAGRAM_TAG, mapInstagramMedia, type InstagramPost } from "@/lib/instagram";

const API = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const REFRESH_AFTER_MS = 7 * 24 * 3600 * 1000; // refresh weekly; long-lived tokens last 60 days

export type InstagramStatus = {
  configured: boolean;
  source: "database" | "env" | null;
  refreshedAt: string | null;
  lastError: string | null;
  lastSyncAt: string | null;
};

async function settings(keys: string[]) {
  try {
    const rows = await db.siteSetting.findMany({ where: { key: { in: keys } } });
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string | undefined>;
  } catch {
    return {} as Record<string, string | undefined>;
  }
}

async function setSetting(key: string, value: string) {
  await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }).catch(() => undefined);
}

export async function getInstagramToken() {
  const s = await settings(["instagramToken"]);
  if (s.instagramToken) return { token: s.instagramToken, source: "database" as const };
  if (process.env.INSTAGRAM_ACCESS_TOKEN) return { token: process.env.INSTAGRAM_ACCESS_TOKEN, source: "env" as const };
  return { token: null, source: null };
}

export async function getInstagramStatus(): Promise<InstagramStatus> {
  const { token, source } = await getInstagramToken();
  const s = await settings(["instagramTokenRefreshedAt", "instagramLastError", "instagramLastSyncAt"]);
  return {
    configured: Boolean(token),
    source,
    refreshedAt: s.instagramTokenRefreshedAt ?? null,
    lastError: s.instagramLastError || null,
    lastSyncAt: s.instagramLastSyncAt ?? null,
  };
}

/** Refreshes a long-lived token (must be ≥24h old) and stores the new one. Best-effort. */
async function maybeRefresh(token: string) {
  const s = await settings(["instagramTokenRefreshedAt"]);
  const last = s.instagramTokenRefreshedAt ? Date.parse(s.instagramTokenRefreshedAt) : 0;
  if (Date.now() - last < REFRESH_AFTER_MS) return token;
  try {
    const res = await fetch(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    if (!res.ok) return token;
    const data = (await res.json()) as { access_token?: string };
    if (data.access_token) {
      await setSetting("instagramToken", data.access_token);
      await setSetting("instagramTokenRefreshedAt", new Date().toISOString());
      return data.access_token;
    }
  } catch {
    // keep current token
  }
  return token;
}

/**
 * Latest posts from @indiehabitat. Cached for an hour under the "instagram-feed" tag;
 * Admin → Settings → "Sync now" invalidates it immediately. Returns [] when not configured or on error,
 * so the page falls back to venue photos and never breaks.
 */
export async function getInstagramFeed(limit = 8): Promise<{ posts: InstagramPost[]; live: boolean }> {
  const { token: stored } = await getInstagramToken();
  if (!stored) return { posts: [], live: false };
  const token = await maybeRefresh(stored);
  try {
    const res = await fetch(`${API}/me/media?fields=${FIELDS}&limit=${Math.min(25, limit * 2)}&access_token=${encodeURIComponent(token)}`, {
      next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: [INSTAGRAM_TAG] },
    });
    const body = (await res.json().catch(() => ({}))) as { data?: unknown[]; error?: { message?: string } };
    if (!res.ok || body.error) {
      await setSetting("instagramLastError", (body.error?.message ?? `HTTP ${res.status}`).slice(0, 300));
      return { posts: [], live: false };
    }
    const posts = mapInstagramMedia(body.data as Parameters<typeof mapInstagramMedia>[0], limit);
    await setSetting("instagramLastError", "");
    await setSetting("instagramLastSyncAt", new Date().toISOString());
    return { posts, live: posts.length > 0 };
  } catch (e) {
    await setSetting("instagramLastError", (e as Error).message.slice(0, 300));
    return { posts: [], live: false };
  }
}

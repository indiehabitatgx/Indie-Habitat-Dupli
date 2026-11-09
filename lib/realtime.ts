import "server-only";
import { createRealtime, rawSql } from "@neon/realtime/server";

/**
 * Neon Realtime: live SQL queries over WebSocket.
 * NEON_REALTIME_SECRET seals queries and must never reach the browser; NEON_REALTIME_URL is the public
 * WebSocket endpoint the browser subscribes to. Both come from `neon deploy` / `neon env pull`.
 */
export type SettingRow = { key: string; value: string };

export const LIVE_SETTING_KEYS = ["announcement", "announcementEnabled"] as const;

export function realtimeConfig() {
  const secret = process.env.NEON_REALTIME_SECRET;
  const url = process.env.NEON_REALTIME_URL;
  const dbUrl = process.env.DATABASE_URL;
  if (!secret || !url || !dbUrl) return null;
  const db = new URL(dbUrl).pathname.replace(/^\//, "");
  return { secret, url, db };
}

let server: ReturnType<typeof createRealtime> | null = null;
function realtimeServer() {
  const cfg = realtimeConfig();
  if (!cfg) return null;
  server ??= createRealtime({ secret: cfg.secret, db: cfg.db });
  return server;
}

/** Read-only, deterministic live query: the site-wide announcement settings ("SiteSetting" has a PK, so it has a stable replica identity). */
export const announcementQuery = () =>
  rawSql<SettingRow>(`SELECT key, value FROM "SiteSetting" WHERE key IN ($1, $2)`, [...LIVE_SETTING_KEYS]);

/** Seals the announcement query so the browser can subscribe without being able to read or change it. */
export async function sealAnnouncement() {
  const rt = realtimeServer();
  if (!rt) return null;
  return rt.seal({ query: announcementQuery() });
}

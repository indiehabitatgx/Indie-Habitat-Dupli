import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Neutralise spreadsheet formula injection and quote values. */
function cell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return new Response("Forbidden", { status: 403 });
  const subs = await db.newsletterSubscriber.findMany({ where: { unsubscribedAt: null }, orderBy: { createdAt: "asc" } });
  const rows = [["email", "subscribed_at"], ...subs.map((s) => [s.email, s.createdAt.toISOString()])];
  const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="habitat-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

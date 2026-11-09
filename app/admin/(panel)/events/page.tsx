import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { toggleEventFeatured } from "@/app/admin/actions";
import { FeatureToggle } from "@/components/admin/ui";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = { title: "Events" };

export default async function AdminEvents({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const { deleted } = await searchParams;
  const events = await db.event.findMany({ include: { category: true }, orderBy: [{ status: "asc" }, { sortOrder: "asc" }] });
  return (
    <>
      <PageTitle
        title="Events"
        description="Weekly shows and one-off events. Only published events appear on the site."
        action={
          <Link href="/admin/events/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-4" aria-hidden /> New event
          </Link>
        }
      />
      {deleted && <p className="mb-6 text-sm font-semibold text-amber">Event deleted.</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="py-3 pr-4 font-semibold">Event</th>
              <th className="py-3 pr-4 font-semibold">Category</th>
              <th className="py-3 pr-4 font-semibold">Schedule</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Featured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/events/${e.id}`} className="flex items-center gap-3 font-semibold hover:text-amber">
                    <span className="relative h-14 w-10 shrink-0 overflow-hidden bg-surface-2">
                      {e.bannerImage && <Image src={e.bannerImage} alt="" fill sizes="40px" className="object-cover" />}
                    </span>
                    {e.title}
                  </Link>
                </td>
                <td className="py-3 pr-4">{e.category.name}</td>
                <td className="py-3 pr-4 text-muted">{e.scheduleText}</td>
                <td className="py-3 pr-4">
                  <Badge tone={e.status === "PUBLISHED" ? "amber" : "muted"}>{e.status.toLowerCase()}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <FeatureToggle checked={e.featured} onToggle={toggleEventFeatured.bind(null, e.id)} label={`Feature ${e.title}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

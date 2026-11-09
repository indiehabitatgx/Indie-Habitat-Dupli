import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const [events, published, artists, gallery, newContact, newCorp, subs, recentContact, recentCorp] = await Promise.all([
    db.event.count(),
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.artist.count(),
    db.galleryImage.count(),
    db.contactEnquiry.count({ where: { status: "NEW" } }),
    db.corporateEnquiry.count({ where: { status: "NEW" } }),
    db.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
    db.contactEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.corporateEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Published events", value: `${published}/${events}`, href: "/admin/events" },
    { label: "New enquiries", value: newContact + newCorp, href: "/admin/enquiries" },
    { label: "Subscribers", value: subs, href: "/admin/subscribers" },
    { label: "Gallery items", value: gallery, href: "/admin/gallery" },
    { label: "Artists", value: artists, href: "/admin/artists" },
  ];

  const recent = [
    ...recentContact.map((e) => ({ id: e.id, who: e.name, what: e.purpose, when: e.createdAt, status: e.status, kind: "Contact" })),
    ...recentCorp.map((e) => ({ id: e.id, who: e.company ? `${e.name} · ${e.company}` : e.name, what: e.eventType, when: e.createdAt, status: e.status, kind: "Corporate" })),
  ]
    .sort((a, b) => b.when.getTime() - a.when.getTime())
    .slice(0, 8);

  return (
    <>
      <PageTitle title="Dashboard" description="Manage shows, artists, the gallery and incoming enquiries." />
      {error === "forbidden" && (
        <p role="alert" className="mb-6 border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          That action needs an administrator account.
        </p>
      )}
      <ul className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label} className="bg-bg">
            <Link href={s.href} className="block p-5 hover:bg-surface">
              <span className="block font-display text-3xl font-black text-amber">{s.value}</span>
              <span className="mt-1 block text-sm text-muted">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-lg font-extrabold uppercase">Latest enquiries</h2>
        {recent.length === 0 ? (
          <p className="text-muted">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="font-semibold">{r.who}</span> <span className="text-muted">— {r.what}</span>
                </span>
                <span className="flex items-center gap-3 text-sm text-muted">
                  <Badge tone="muted">{r.kind}</Badge>
                  {r.status === "NEW" && <Badge tone="amber">New</Badge>}
                  {formatDate(r.when)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/enquiries" className="mt-4 inline-block text-sm font-semibold text-amber hover:underline">
          All enquiries →
        </Link>
      </section>
    </>
  );
}

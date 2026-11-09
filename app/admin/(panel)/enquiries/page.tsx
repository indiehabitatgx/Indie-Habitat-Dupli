import Link from "next/link";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteEnquiry, setEnquiryStatus } from "@/app/admin/actions";
import { ConfirmButton, StatusSelect } from "@/components/admin/ui";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(d);

export default async function Enquiries({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string }> }) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const tab = sp.tab === "corporate" ? "corporate" : "contact";
  const status = ["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"].includes(sp.status ?? "") ? (sp.status as "NEW") : undefined;
  const where = status ? { status } : {};
  const [contact, corporate, cCount, kCount] = await Promise.all([
    tab === "contact" ? db.contactEnquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }) : [],
    tab === "corporate" ? db.corporateEnquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }) : [],
    db.contactEnquiry.count({ where: { status: "NEW" } }),
    db.corporateEnquiry.count({ where: { status: "NEW" } }),
  ]);
  const canDelete = session.role === "ADMIN";
  const tabLink = (t: string, label: string, n: number) => (
    <Link
      href={`/admin/enquiries?tab=${t}`}
      aria-current={tab === t ? "page" : undefined}
      className={cn("min-h-11 border-b-2 px-4 py-2.5 text-sm font-semibold", tab === t ? "border-amber text-amber" : "border-transparent text-muted hover:text-fg")}
    >
      {label} {n > 0 && <span className="ml-1 rounded-full bg-amber px-2 text-xs text-amber-ink">{n} new</span>}
    </Link>
  );

  return (
    <>
      <PageTitle title="Enquiries" description="Messages from the contact form, venue booking forms and the corporate enquiry form." />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line">
        <nav className="flex" aria-label="Enquiry type">
          {tabLink("contact", "Contact & venue", cCount)}
          {tabLink("corporate", "Corporate & private", kCount)}
        </nav>
        <form className="flex items-center gap-2 pb-2">
          <input type="hidden" name="tab" value={tab} />
          <label htmlFor="status" className="text-sm text-muted">
            Status
          </label>
          <select id="status" name="status" defaultValue={status ?? ""} className="field !min-h-10 !py-1.5 text-sm">
            <option value="">All</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="SPAM">Spam</option>
          </select>
          <button className="min-h-10 border border-line px-3 text-sm font-semibold hover:border-amber">Filter</button>
        </form>
      </div>

      {tab === "contact" &&
        (contact.length === 0 ? (
          <EmptyState title="No enquiries" />
        ) : (
          <ul className="grid gap-4">
            {contact.map((e) => (
              <li key={e.id} className={cn("border p-5", e.status === "NEW" ? "border-amber/50" : "border-line")}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {e.name} <span className="font-normal text-muted">· {e.purpose}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      <a href={`mailto:${e.email}`} className="text-fg underline">{e.email}</a>
                      {e.phone && <> · <a href={`tel:${e.phone}`} className="underline">{e.phone}</a></>}
                      {e.guests && <> · {e.guests}</>} · {e.source} · {fmt(e.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusSelect value={e.status} onChange={setEnquiryStatus.bind(null, "contact", e.id)} label={`Status for ${e.name}`} />
                    {canDelete && (
                      <ConfirmButton action={deleteEnquiry.bind(null, "contact", e.id)} message="Delete this enquiry permanently?">
                        <Trash2 className="size-4" aria-label="Delete" />
                      </ConfirmButton>
                    )}
                  </div>
                </div>
                {e.message && <p className="mt-4 whitespace-pre-wrap border-l-2 border-line pl-4 text-fg/85">{e.message}</p>}
              </li>
            ))}
          </ul>
        ))}

      {tab === "corporate" &&
        (corporate.length === 0 ? (
          <EmptyState title="No enquiries" />
        ) : (
          <ul className="grid gap-4">
            {corporate.map((e) => (
              <li key={e.id} className={cn("border p-5", e.status === "NEW" ? "border-amber/50" : "border-line")}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {e.name}
                      {e.company && <span className="font-normal text-muted"> · {e.company}</span>}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      <a href={`mailto:${e.email}`} className="text-fg underline">{e.email}</a> · <a href={`tel:${e.phone}`} className="underline">{e.phone}</a> · {fmt(e.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusSelect value={e.status} onChange={setEnquiryStatus.bind(null, "corporate", e.id)} label={`Status for ${e.name}`} />
                    {canDelete && (
                      <ConfirmButton action={deleteEnquiry.bind(null, "corporate", e.id)} message="Delete this enquiry permanently?">
                        <Trash2 className="size-4" aria-label="Delete" />
                      </ConfirmButton>
                    )}
                  </div>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                  {[
                    ["Event", e.eventType],
                    ["Date", e.preferredDate ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(e.preferredDate) : "—"],
                    ["Guests", e.attendees],
                    ["Duration", e.duration ?? "—"],
                    ["F&B", e.foodBeverage ?? "—"],
                    ["Technical", e.technical.join(", ") || "—"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                {e.message && <p className="mt-4 whitespace-pre-wrap border-l-2 border-line pl-4 text-fg/85">{e.message}</p>}
              </li>
            ))}
          </ul>
        ))}
    </>
  );
}

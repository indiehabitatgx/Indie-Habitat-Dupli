import { Download, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteSubscriber } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ui";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = { title: "Subscribers" };

export default async function Subscribers() {
  const session = await requireAdmin();
  const subs = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
  return (
    <>
      <PageTitle
        title="Subscribers"
        description="Newsletter sign-ups. Export to CSV to import into your email tool."
        action={
          session.role === "ADMIN" ? (
            <a href="/api/admin/export-subscribers" className={buttonVariants({ size: "sm", variant: "outline" })}>
              <Download className="size-4" aria-hidden /> Export CSV
            </a>
          ) : undefined
        }
      />
      {subs.length === 0 ? (
        <EmptyState title="No subscribers yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Joined</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subs.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 pr-4">{s.email}</td>
                  <td className="py-3 pr-4 text-muted">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(s.createdAt)}</td>
                  <td className="py-3 pr-4">{s.unsubscribedAt ? "Unsubscribed" : "Active"}</td>
                  <td className="py-3 text-right">
                    {session.role === "ADMIN" && (
                      <ConfirmButton action={deleteSubscriber.bind(null, s.id)} message={`Remove ${s.email}?`}>
                        <Trash2 className="size-4" aria-label={`Remove ${s.email}`} />
                      </ConfirmButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

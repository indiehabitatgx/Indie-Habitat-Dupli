import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "@/app/admin/login/actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [c, k] = await Promise.all([
    db.contactEnquiry.count({ where: { status: "NEW" } }),
    db.corporateEnquiry.count({ where: { status: "NEW" } }),
  ]);
  return (
    <div className="lg:grid lg:min-h-svh lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-surface p-4 lg:sticky lg:top-0 lg:h-svh lg:border-b-0 lg:border-r">
        <div className="mb-4 flex items-center justify-between lg:mb-8 lg:block">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <Image src="/images/brand/habitat-logo-w.png" alt="The Habitat" width={471} height={96} unoptimized className="h-6 w-auto" />
          </Link>
          <p className="mt-0 text-xs text-muted lg:mt-3">
            {session.name} · {session.role.toLowerCase()}
          </p>
        </div>
        <AdminNav badge={c + k} />
        <div className="mt-4 flex gap-2 border-t border-line pt-4 lg:absolute lg:inset-x-4 lg:bottom-4 lg:flex-col">
          <Link href="/" target="_blank" className="flex min-h-10 items-center gap-2 px-3 text-sm text-muted hover:text-fg">
            <ExternalLink className="size-4" aria-hidden /> View site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex min-h-10 items-center gap-2 px-3 text-sm text-muted hover:text-fg">
              <LogOut className="size-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-4 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Artists" };

export default async function AdminArtists({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const { deleted } = await searchParams;
  const artists = await db.artist.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <PageTitle
        title="Artists"
        description="The Artists page and nav link appear on the site once at least one artist is published."
        action={
          <Link href="/admin/artists/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-4" aria-hidden /> New artist
          </Link>
        }
      />
      {deleted && <p className="mb-6 text-sm font-semibold text-amber">Artist deleted.</p>}
      {artists.length === 0 ? (
        <EmptyState title="No artists yet">Add performers with their approved bio and photo.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {artists.map((a) => (
            <li key={a.id}>
              <Link href={`/admin/artists/${a.id}`} className="flex items-center gap-4 border border-line p-3 hover:border-amber">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-2">
                  {a.profileImage && <Image src={a.profileImage} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{a.name}</span>
                  <Badge tone={a.status === "PUBLISHED" ? "amber" : "muted"} className="mt-1">
                    {a.status.toLowerCase()}
                  </Badge>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

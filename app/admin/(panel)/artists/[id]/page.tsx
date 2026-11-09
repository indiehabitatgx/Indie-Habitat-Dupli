import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteArtist } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ui";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { ArtistForm } from "@/app/admin/(panel)/artists/ArtistForm";
import type { ArtistSocialLinks } from "@/types/artist";

export const metadata = { title: "Edit artist" };

export default async function EditArtist({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const a = await db.artist.findUnique({ where: { id } });
  if (!a) notFound();
  const links = (a.socialLinks ?? {}) as ArtistSocialLinks;
  return (
    <>
      <PageTitle
        title={a.name}
        action={
          session.role === "ADMIN" ? (
            <ConfirmButton action={deleteArtist.bind(null, a.id)} message={`Delete ${a.name}?`}>
              <Trash2 className="size-4" aria-hidden /> Delete
            </ConfirmButton>
          ) : undefined
        }
      />
      <ArtistForm
        notice={created ? "Artist created." : undefined}
        values={{
          id: a.id,
          name: a.name,
          slug: a.slug,
          biography: a.biography,
          profileImage: a.profileImage,
          instagram: links.instagram ?? "",
          youtube: links.youtube ?? "",
          x: links.x ?? "",
          website: links.website ?? "",
          featured: a.featured,
          status: a.status,
        }}
      />
    </>
  );
}

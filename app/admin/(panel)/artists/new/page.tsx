import { requireAdmin } from "@/lib/auth";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { ArtistForm } from "@/app/admin/(panel)/artists/ArtistForm";

export const metadata = { title: "New artist" };

export default async function NewArtist() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="New artist" description="Only add artists who have agreed to be listed, with an authorised photo." />
      <ArtistForm
        values={{ id: null, name: "", slug: "", biography: "", profileImage: null, instagram: "", youtube: "", x: "", website: "", featured: false, status: "DRAFT" }}
      />
    </>
  );
}

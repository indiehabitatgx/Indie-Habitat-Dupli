import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { AddGalleryForm, GalleryList } from "@/app/admin/(panel)/gallery/GalleryAdmin";

export const metadata = { title: "Gallery" };

export default async function AdminGallery() {
  const session = await requireAdmin();
  const items = await db.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageTitle title="Gallery" description="Upload only photos the venue owns or has permission to use. Images are resized and converted to WebP." />
      <section className="mb-12">
        <h2 className="mb-4 font-display text-lg font-extrabold uppercase">Add an image</h2>
        <AddGalleryForm />
      </section>
      <section>
        <h2 className="mb-4 font-display text-lg font-extrabold uppercase">Gallery items ({items.length})</h2>
        <GalleryList items={items} canDelete={session.role === "ADMIN"} />
      </section>
    </>
  );
}

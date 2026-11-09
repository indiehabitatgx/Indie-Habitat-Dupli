import { PageHero } from "@/components/layout/PageHero";
import { OutlineText } from "@/components/ui/OutlineText";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { getGallery } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Gallery — Stages, Shows & Moments",
  description: "Photos and videos from The Habitat in Khar West, Mumbai: the stages, the audience, private events and the jam room.",
  path: "/gallery",
  image: "/images/gallery/audience.webp",
});

export default async function GalleryPage() {
  const items = (await getGallery()).map((g) => ({
    id: g.id,
    title: g.title,
    alt: g.alt,
    src: g.src,
    width: g.width,
    height: g.height,
    category: g.category,
    mediaType: g.mediaType,
    videoId: g.videoId,
  }));
  return (
    <>
      <PageHero
        eyebrow="#momentsathabitat"
        title={
          <>
            The <OutlineText>gallery</OutlineText>
          </>
        }
        intro={
          <>
            Stages, crowds and celebrations. For the latest, follow{" "}
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">
              @indiehabitat
            </a>
            .
          </>
        }
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
      />
      <section className="container-x pb-28">
        <MasonryGallery items={items} />
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { buttonVariants } from "@/components/ui/Button";
import { getArtists } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const artists = await getArtists();
  return pageMetadata({
    title: "Artists & Performers",
    description: "Comics, musicians and poets who take the stage at The Habitat, Khar West, Mumbai.",
    path: "/artists",
    noindex: artists.length === 0,
  });
}

export default async function ArtistsPage() {
  const artists = await getArtists();
  return (
    <>
      <PageHero eyebrow="#onstage" title="Artists" intro="The comics, musicians and poets on The Habitat's stages." crumbs={[{ name: "Artists", path: "/artists" }]} />
      <section className="container-x pb-28">
        {artists.length === 0 ? (
          <EmptyState
            title="Artist profiles are on their way"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/events" className={buttonVariants()}>
                  See events
                </Link>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
                  @indiehabitat <span className="sr-only">(opens Instagram in a new tab)</span>
                </a>
              </div>
            }
          >
            Line-ups are announced on Instagram, and every show page links to its current listing on BookMyShow.
          </EmptyState>
        ) : (
          <Stagger as="ul" className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {artists.map((a) => (
              <StaggerItem as="li" key={a.id}>
                <Link href={`/artists/${a.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    {a.profileImage ? (
                      <Image src={a.profileImage} alt={a.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                    ) : (
                      <span className="grid size-full place-items-center font-display text-6xl font-black text-white/10">{a.name.charAt(0)}</span>
                    )}
                  </div>
                  <h2 className="mt-4 font-display text-xl font-extrabold uppercase group-hover:text-amber">{a.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{a.biography}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}

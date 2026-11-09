import Image from "next/image";
import Link from "next/link";
import type { ArtistCardData } from "@/types/artist";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** Rendered only when the CMS has published artists — no placeholder line-ups. */
export function ArtistsSection({ artists }: { artists: ArtistCardData[] }) {
  if (artists.length === 0) return null;
  return (
    <section className="py-20 md:py-28" aria-labelledby="artists-heading">
      <div className="container-x">
        <SectionHeading eyebrow="#onstage" id="artists-heading" title="Featured artists" />
        <Stagger as="ul" className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {artists.slice(0, 8).map((a) => (
            <StaggerItem as="li" key={a.id}>
              <Link href={`/artists/${a.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  {a.profileImage && (
                    <Image src={a.profileImage} alt={a.name} fill sizes="25vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  )}
                </div>
                <p className="mt-3 font-display font-extrabold uppercase group-hover:text-amber">{a.name}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { EventGrid } from "@/components/events/EventGrid";
import { SocialIcon } from "@/components/layout/SocialLinks";
import { getArtistBySlug } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, isSafeHttpUrl } from "@/lib/utils";
import type { ArtistSocialLinks } from "@/types/artist";
import type { EventCardData } from "@/types/event";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArtistBySlug((await params).slug);
  if (!a) return { title: "Artist not found", robots: { index: false } };
  return pageMetadata({ title: a.name, description: a.biography.slice(0, 160), path: `/artists/${a.slug}`, image: a.profileImage ?? undefined });
}

const socialMeta = [
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "x", label: "X" },
] as const;

export default async function ArtistPage({ params }: Props) {
  const a = await getArtistBySlug((await params).slug);
  if (!a) notFound();
  const links = (a.socialLinks ?? {}) as ArtistSocialLinks;
  const events: EventCardData[] = a.events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    shortDescription: e.shortDescription,
    image: e.thumbnailImage ?? e.bannerImage,
    posterWidth: e.posterWidth,
    posterHeight: e.posterHeight,
    category: e.category,
    venue: e.venue,
    recurrence: e.recurrence,
    scheduleDays: e.scheduleDays,
    scheduleText: e.scheduleText,
    startDate: e.startDate?.toISOString() ?? null,
    startTime: e.startTime,
    ticketPrice: e.ticketPrice,
    priceNote: e.priceNote,
    bookingUrl: e.bookingUrl,
    bookingProvider: e.bookingProvider,
    featured: e.featured,
    sortOrder: e.sortOrder,
  }));

  return (
    <>
      <section className="container-x pb-20 pt-10">
        <Breadcrumbs items={[{ name: "Artists", path: "/artists" }, { name: a.name, path: `/artists/${a.slug}` }]} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="relative aspect-[3/4] overflow-hidden bg-surface lg:col-span-5">
            {a.profileImage && <Image src={a.profileImage} alt={a.name} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />}
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">#artist</p>
            <h1 className="display-lg">{a.name}</h1>
            <div className="prose-habitat mt-8 text-lg">
              {a.biography.split(/\n{2,}/).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {socialMeta.map(({ key, label }) =>
                links[key] && isSafeHttpUrl(links[key]!) ? (
                  <li key={key}>
                    <a href={links[key]} target="_blank" rel="noopener noreferrer" className="grid size-12 place-items-center rounded-full border border-line hover:border-amber hover:text-amber">
                      <SocialIcon name={key} />
                      <span className="sr-only">{label} (opens in a new tab)</span>
                    </a>
                  </li>
                ) : null,
              )}
              {links.website && isSafeHttpUrl(links.website) && (
                <li>
                  <a href={links.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-line px-5 hover:border-amber hover:text-amber">
                    Website
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
      {events.length > 0 && (
        <section className="border-t border-line py-20">
          <div className="container-x">
            <h2 className="display-md mb-10">Appearances</h2>
            <EventGrid events={events} />
          </div>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: a.name,
          description: a.biography.slice(0, 300),
          url: absoluteUrl(`/artists/${a.slug}`),
          ...(a.profileImage ? { image: absoluteUrl(a.profileImage) } : {}),
          sameAs: Object.values(links).filter((v): v is string => typeof v === "string" && isSafeHttpUrl(v)),
        }}
      />
    </>
  );
}

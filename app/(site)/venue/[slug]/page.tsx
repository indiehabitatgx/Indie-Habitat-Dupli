import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { JsonLd } from "@/components/ui/JsonLd";
import { getVenue, venues } from "@/lib/venues";
import { pageMetadata, placeJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = getVenue((await params).slug);
  if (!v) return {};
  return pageMetadata({
    title: `${v.name} — ${v.kicker}`,
    description: `${v.summary} ${v.facts.map((f) => `${f.label}: ${f.value}`).join(". ")}.`.slice(0, 160),
    path: `/venue/${v.slug}`,
    image: v.image,
  });
}

const capacityFor: Record<string, number | undefined> = { "the-habitat": 75, "above-the-habitat": 250 };

export default async function VenueDetailPage({ params }: Props) {
  const v = getVenue((await params).slug);
  if (!v) notFound();
  const others = venues.filter((o) => o.slug !== v.slug);

  return (
    <>
      <PageHero
        eyebrow={v.hashtag}
        title={v.name}
        intro={v.summary}
        image={v.image}
        imageAlt={v.imageAlt}
        crumbs={[
          { name: "Venue", path: "/venue" },
          { name: v.name, path: `/venue/${v.slug}` },
        ]}
      >
        <dl className="mt-10 grid max-w-4xl gap-px border border-white/15 bg-white/15 sm:grid-cols-3">
          {v.facts.map((f) => (
            <div key={f.label} className="bg-bg/70 p-4 backdrop-blur">
              <dt className="font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-amber">{f.label}</dt>
              <dd className="mt-1 font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="container-x grid gap-14 py-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">#thespace</p>
          <h2 className="display-md">{v.kicker}</h2>
        </Reveal>
        <Reveal delay={0.08} className="prose-habitat text-lg lg:col-span-7">
          {v.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface py-24" aria-labelledby="specs-heading">
        <div className="container-x">
          <p className="eyebrow mb-4">#specs</p>
          <h2 id="specs-heading" className="display-md mb-12">
            What&apos;s in the room
          </h2>
          <Stagger className="grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3 md:[&>*:last-child:nth-child(odd)]:col-span-2 xl:[&>*:last-child:nth-child(odd)]:col-span-1 xl:[&>*:last-child:nth-child(3n+2)]:col-span-2">
            {v.specs.map((s) => (
              <StaggerItem key={s.title} className="bg-surface p-6 md:p-8">
                <h3 className="font-display text-lg font-extrabold uppercase text-amber">{s.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.95rem]">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/50" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {(v.video || v.floorPlan) && (
        <section className="container-x grid gap-10 py-24 lg:grid-cols-2">
          {v.video && (
            <Reveal>
              <p className="eyebrow mb-4">#watch</p>
              <YouTubeEmbed id={v.video.id} title={v.video.title} poster={v.video.poster} />
            </Reveal>
          )}
          {v.floorPlan && (
            <Reveal delay={0.08}>
              <p className="eyebrow mb-4">#floorplan</p>
              <a href={v.floorPlan} target="_blank" rel="noopener" className="group relative block aspect-video overflow-hidden border border-line bg-white">
                <Image src={v.floorPlan} alt={`${v.name} floor plan`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain transition group-hover:scale-[1.02]" />
                <span className="absolute bottom-3 right-3 bg-bg px-3 py-1.5 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em]">Open full size</span>
              </a>
            </Reveal>
          )}
        </section>
      )}

      <section id="book" className="paper py-24" aria-labelledby="book-heading">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">#booknow</p>
            <h2 id="book-heading" className="display-md">
              Book {v.name}
            </h2>
            <p className="mt-4 text-paper-muted">Tell us what you&apos;re planning and how many people you expect — the team will reply with availability.</p>
          </Reveal>
          <div className="lg:col-span-8 [&_.field]:border-black/15 [&_.field]:bg-white [&_.field]:text-paper-ink [&_label]:text-paper-ink [&_.text-muted]:!text-paper-muted">
            <ContactForm venueSlug={v.slug} purposes={v.bookingPurposes} />
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <p className="eyebrow mb-8">#alsoathabitat</p>
        <ul className="grid gap-6 md:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/venue/${o.slug}`} className="group flex items-center gap-6 border border-line p-4 transition hover:border-amber">
                <span className="relative aspect-square w-28 shrink-0 overflow-hidden">
                  <Image src={o.image} alt="" fill sizes="112px" className="object-cover" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl font-extrabold uppercase group-hover:text-amber">{o.name}</span>
                  <span className="mt-1 block text-sm text-muted">{o.summary}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={placeJsonLd(v.name, `/venue/${v.slug}`, v.summary, v.image, capacityFor[v.slug])} />
    </>
  );
}

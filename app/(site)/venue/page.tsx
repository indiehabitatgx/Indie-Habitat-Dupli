import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { OutlineText } from "@/components/ui/OutlineText";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { buttonVariants } from "@/components/ui/Button";
import { venues } from "@/lib/venues";
import { pageMetadata, placeJsonLd } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "The Venue — The Habitat, Above The Habitat & Jam Room",
  description:
    "Three spaces in Khar West, Mumbai: The Habitat (55–75 seats), Above The Habitat (160 seated / 250 standing) and a soundproofed jam room for podcasts and rehearsals.",
  path: "/venue",
  image: "/images/venue/above-the-habitat-stage.webp",
});

export default function VenuePage() {
  return (
    <>
      <PageHero
        eyebrow="#thevenue"
        title={
          <>
            Three rooms, <OutlineText>one</OutlineText> habitat.
          </>
        }
        intro="Stages built for comedy, rooms wired for recording and a hall upstairs for the big nights."
        image="/images/venue/above-the-habitat-stage.webp"
        imageAlt="Above The Habitat — a wide stage in front of an exposed brick wall"
        crumbs={[{ name: "Venue", path: "/venue" }]}
      />

      <section className="container-x py-20 md:py-28">
        <ol className="flex flex-col gap-24 md:gap-36">
          {venues.map((v, i) => (
            <li key={v.slug} className="grid items-center gap-10 lg:grid-cols-12">
              <Reveal className={`relative lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <ImageReveal className="aspect-[16/10] overflow-hidden">
                  <Link href={`/venue/${v.slug}`} className="group relative block size-full bg-surface" tabIndex={-1} aria-hidden>
                    <Image src={v.image} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-105" />
                  </Link>
                </ImageReveal>
                <span className="absolute -top-6 left-4 font-display text-[clamp(2.5rem,5vw,4rem)] font-black leading-none text-amber/90 md:-left-6" aria-hidden>
                  0{i + 1}
                </span>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5">
                <p className="eyebrow mb-3">{v.hashtag}</p>
                <h2 className="display-md">{v.name}</h2>
                <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-muted">{v.kicker}</p>
                <p className="mt-6 text-lg text-fg/85">{v.summary}</p>
                <dl className="mt-8 divide-y divide-line border-y border-line">
                  {v.facts.map((f) => (
                    <div key={f.label} className="flex justify-between gap-6 py-3 text-sm">
                      <dt className="text-muted">{f.label}</dt>
                      <dd className="text-right font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/venue/${v.slug}`} className={`${buttonVariants({ variant: "outline" })} mt-8`}>
                  Explore {v.name} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-surface py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow mb-4">#findus</p>
            <h2 className="display-md">Khar West, Mumbai</h2>
            <address className="mt-6 not-italic text-lg text-fg/85">{fullAddress}</address>
            <p className="mt-2 text-muted">Open {site.hours}. There is no parking or valet at the venue.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/corporate-events" className={buttonVariants()}>
                Book a private event
              </Link>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
                Directions <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden border border-line">
            <iframe
              title="Map showing The Habitat, Khar West, Mumbai"
              src={site.mapsEmbed}
              className="absolute inset-0 size-full grayscale invert-[0.92] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {venues.map((v) => (
        <JsonLd key={v.slug} data={placeJsonLd(v.name, `/venue/${v.slug}`, v.summary, v.image)} />
      ))}
    </>
  );
}

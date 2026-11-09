import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CorporateEnquiryForm } from "@/components/forms/CorporateEnquiryForm";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { buttonVariants } from "@/components/ui/Button";
import { getGallery } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { venues } from "@/lib/venues";

export const metadata = pageMetadata({
  title: "Banquets, Conferences & Private Events in Khar, Mumbai",
  description:
    "Host conferences, seminars, cocktail functions, team offsites and celebrations at The Habitat, Khar West — with F&B packages, sound, lighting and projection.",
  path: "/corporate-events",
  image: "/images/gallery/stage-decor.webp",
});

/** Package details quoted from the original /banquets-conferences page. */
const packages = [
  {
    title: "Conferences & Seminars",
    items: ["Morning tea (AM tea) with snacks", "Lunch — veg / non-veg / mixed", "Evening tea (PM tea) with snacks"],
  },
  {
    title: "Cocktail Functions",
    items: ["Starters package — veg / non-veg / mixed", "Beverage package — non-alcoholic / alcoholic / mixed"],
  },
  {
    title: "Social Functions",
    items: ["Standard lunch / dinner menus", "Add-ons: the base package is customisable with additional food & beverages"],
  },
];

const uses = ["Conference", "Seminar", "Pre-wedding function / anniversary", "Corporate team-building / retreat", "Parties", "Company offsites"];

export default async function CorporateEventsPage() {
  const gallery = (await getGallery())
    .filter((g) => g.mediaType === "IMAGE" && ["Events", "Venue", "Community"].includes(g.category))
    .map((g) => ({ ...g, mediaType: g.mediaType as "IMAGE" }));

  return (
    <>
      <PageHero
        eyebrow="#banquets & #conferences"
        title={
          <>
            Your event, <span className="text-amber">our stage.</span>
          </>
        }
        intro="The Habitat has a spacious facility for all banqueting and conferencing events — ranging from parties to meetings to company offsites."
        image="/images/gallery/stage-decor.webp"
        imageAlt="A stage dressed with drapes, fairy lights and flowers for a private function"
        crumbs={[{ name: "Private & Corporate", path: "/corporate-events" }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#enquire" className={buttonVariants({ size: "lg" })}>
            Send an enquiry <ArrowRight className="size-4" aria-hidden />
          </a>
          <a href={site.phoneHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Phone className="size-4" aria-hidden /> {site.phone}
          </a>
        </div>
      </PageHero>

      <section className="container-x py-20 md:py-28">
        <Reveal className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">#hostwithus</p>
          <h2 className="display-md">Made for</h2>
        </Reveal>
        <Stagger as="ul" className="flex flex-wrap gap-3">
          {uses.map((u) => (
            <StaggerItem as="li" key={u} className="border border-line px-5 py-3 font-display text-sm font-bold uppercase tracking-wide md:text-base">
              {u}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-line bg-surface py-24" aria-labelledby="packages-heading">
        <div className="container-x">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">#packages</p>
              <h2 id="packages-heading" className="display-md">
                Food, drink &amp; the works
              </h2>
            </div>
            <p className="max-w-sm text-muted">
              Cuisines: Punjabi, Continental, Mughlai and Chinese. Pricing is shared on enquiry.
            </p>
          </div>
          <Stagger className="grid gap-px border border-line bg-line lg:grid-cols-3">
            {packages.map((p, i) => (
              <StaggerItem key={p.title} className="flex flex-col bg-surface p-8">
                <span className="font-display text-3xl font-black text-amber/80">0{i + 1}</span>
                <h3 className="mt-5 font-display text-xl font-extrabold uppercase">{p.title}</h3>
                <ul className="mt-5 space-y-3 text-fg/85">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-labelledby="spaces-heading">
        <p className="eyebrow mb-4">#facilities</p>
        <h2 id="spaces-heading" className="display-md mb-12">
          Choose your room
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {venues.slice(0, 2).map((v) => (
            <Reveal key={v.slug}>
              <article className="group h-full border border-line">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={v.image} alt={v.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-1000 group-hover:scale-105" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-xl font-extrabold uppercase">{v.name}</h3>
                  <dl className="mt-4 grid gap-2 text-sm">
                    {v.facts.map((f) => (
                      <div key={f.label} className="flex justify-between gap-4 border-b border-line pb-2">
                        <dt className="text-muted">{f.label}</dt>
                        <dd className="text-right font-semibold">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link href={`/venue/${v.slug}`} className="font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline">
                      Full specs →
                    </Link>
                    {v.floorPlan && (
                      <a href={v.floorPlan} target="_blank" rel="noopener" className="font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline">
                        Floor plan ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Technical add-ons on request: sound, lighting, projector &amp; screen and decor (decor set-up time is also chargeable).
        </p>
      </section>

      {gallery.length > 0 && (
        <section className="border-t border-line py-24" aria-labelledby="corp-gallery-heading">
          <div className="container-x">
            <p className="eyebrow mb-4">#gallery</p>
            <h2 id="corp-gallery-heading" className="display-md mb-12">
              Set-ups we&apos;ve hosted
            </h2>
            <MasonryGallery items={gallery} showFilters={false} />
          </div>
        </section>
      )}

      <section id="enquire" className="paper scroll-mt-24 py-20 md:py-28" aria-labelledby="enquire-heading">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">#enquire</p>
            <h2 id="enquire-heading" className="display-md">
              Tell us about your event
            </h2>
            <p className="mt-5 text-paper-muted">
              Prefer to talk? Call{" "}
              <a href={site.phoneHref} className="font-semibold text-paper-ink underline">
                {site.phone}
              </a>
              , open {site.hours}.
            </p>
          </Reveal>
          <div className="lg:col-span-8 [&_.field]:border-black/15 [&_.field]:bg-white [&_.field]:text-paper-ink [&_.text-muted]:!text-paper-muted [&_fieldset_label]:border-black/15 [&_fieldset_label]:bg-white">
            <CorporateEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}

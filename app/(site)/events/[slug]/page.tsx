import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, IndianRupee, MapPin, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { TicketCTA } from "@/components/events/TicketCTA";
import { EventGrid } from "@/components/events/EventGrid";
import { getEventBySlug, getPublishedEventSlugs, getRelatedEvents } from "@/lib/data";
import { eventJsonLd, pageMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import { DAY_NAMES, formatDate, formatPrice } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getPublishedEventSlugs()).map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  if (!e) return { title: "Event not found", robots: { index: false } };
  return pageMetadata({
    title: e.seoTitle ?? e.title,
    description: e.seoDescription ?? e.shortDescription,
    path: `/events/${e.slug}`,
    image: e.bannerImage ?? undefined,
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const related = await getRelatedEvents(event.slug, event.category.slug);

  const days =
    event.recurrence === "WEEKLY"
      ? event.scheduleDays.length === 7
        ? "Every day"
        : [...event.scheduleDays].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map((d) => DAY_NAMES[d]).join(", ")
      : formatDate(event.startDate);
  const price = formatPrice(event.ticketPrice);
  const venueName = event.venue?.name ?? site.name;

  const info = [
    { icon: CalendarDays, label: event.recurrence === "WEEKLY" ? "Days" : "Date", value: days },
    { icon: Clock, label: "Show time", value: event.scheduleText },
    { icon: IndianRupee, label: "Tickets", value: event.priceNote ?? (price ? `From ${price}` : "Price on request") },
    { icon: MapPin, label: "Venue", value: `${venueName}, ${site.address.locality}` },
  ];

  return (
    <>
      <article className="relative">
        <div className="pointer-events-none absolute inset-x-0 -top-[var(--header-h)] -z-10 h-[90vh] overflow-hidden" aria-hidden>
          <div className="spotlight" />
        </div>

        <div className="container-x pb-24 pt-10 md:pt-14">
          <Breadcrumbs items={[{ name: "Events", path: "/events" }, { name: event.title, path: `/events/${event.slug}` }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Poster */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <div className="relative aspect-[1/1.414] overflow-hidden bg-surface shadow-[0_40px_120px_-30px_rgba(252,178,50,0.35)]">
                  {event.bannerImage && (
                    <Image
                      src={event.bannerImage}
                      alt={`${event.title} poster`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-7">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="amber">{event.category.name}</Badge>
                  {event.recurrence === "WEEKLY" && <Badge tone="muted">Weekly show</Badge>}
                </div>
                <h1 className="display-lg mt-6">{event.title}</h1>
                <p className="mt-6 max-w-2xl text-xl text-fg/85">{event.shortDescription}</p>

                <dl className="mt-10 grid border-y border-line sm:grid-cols-2">
                  {info.map(({ icon: Icon, label, value }, i) => (
                    <div
                      key={label}
                      className={`py-5 sm:px-5 ${i % 2 === 0 ? "sm:border-r sm:border-line sm:pl-0" : ""} ${i < 2 ? "border-b border-line" : i === 2 ? "border-b border-line sm:border-b-0" : ""}`}
                    >
                      <dt className="flex items-center gap-4 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
                        <Icon className="size-5 shrink-0 text-amber" aria-hidden />
                        {label}
                      </dt>
                      <dd className="mt-1 pl-9 font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <TicketCTA url={event.bookingUrl} provider={event.bookingProvider} title={event.title} size="lg" />
                  <p className="text-sm text-muted">
                    Tickets, live availability and payment are handled by {event.bookingProvider ?? "the ticketing partner"}.
                  </p>
                </div>
              </div>

              <Reveal delay={0.12}>
                <h2 className="eyebrow mb-4 mt-16">#abouttheshow</h2>
                <div className="prose-habitat text-lg">
                  {event.description.split(/\n{2,}/).map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </Reveal>

              {event.artists.length > 0 && (
                <Reveal>
                  <h2 className="eyebrow mb-4 mt-16">#lineup</h2>
                  <ul className="flex flex-wrap gap-3">
                    {event.artists.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/artists/${a.slug}`} className="inline-flex min-h-11 items-center border border-line px-4 font-display text-sm font-bold uppercase hover:border-amber hover:text-amber">
                          {a.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              <Reveal>
                <h2 className="eyebrow mb-4 mt-16">#venue</h2>
                <div className="flex flex-col gap-2 border-l-2 border-amber pl-5">
                  <p className="font-display text-lg font-extrabold uppercase">{venueName}</p>
                  <p className="text-muted">{fullAddress}</p>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-amber underline-offset-4 hover:underline">
                    Get directions <span className="sr-only">(opens Google Maps in a new tab)</span>
                  </a>
                </div>
              </Reveal>

              {event.terms && (
                <Reveal>
                  <details className="group mt-16 border-y border-line">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-bold uppercase tracking-[0.14em]">
                      <span className="flex items-center gap-3">
                        <ShieldCheck className="size-5 text-amber" aria-hidden /> House rules &amp; terms
                      </span>
                      <span className="text-2xl transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <ul className="list-disc space-y-2 pb-6 pl-5 text-muted marker:text-amber">
                      {event.terms.split("\n").filter(Boolean).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="pb-6 text-sm">
                      Full <Link href="/terms-and-conditions" className="text-amber underline">terms &amp; conditions</Link> and{" "}
                      <Link href="/refund-policy" className="text-amber underline">refund policy</Link>.
                    </p>
                  </details>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line py-24" aria-labelledby="related-heading">
          <div className="container-x">
            <p className="eyebrow mb-4">#morelaughs</p>
            <h2 id="related-heading" className="display-md mb-12">
              You might also like
            </h2>
            <EventGrid events={related} />
          </div>
        </section>
      )}

      {/* Mobile sticky booking bar */}
      <div data-sticky-bar className="fixed inset-x-3 bottom-[calc(var(--tabbar-h)+0.25rem)] z-40 lg:hidden">
        <div className="liquid-glass liquid-glass-dark mx-auto max-w-md rounded-2xl p-2.5 pl-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-extrabold uppercase">{event.title}</p>
            <p className="truncate text-xs text-muted">{event.scheduleText}</p>
          </div>
          <TicketCTA url={event.bookingUrl} provider={event.bookingProvider} title={event.title} size="sm" className="shrink-0 rounded-xl" />
        </div>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />

      <JsonLd data={eventJsonLd(event)} />
    </>
  );
}

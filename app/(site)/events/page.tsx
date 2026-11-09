import { PageHero } from "@/components/layout/PageHero";
import { EventExplorer } from "@/components/events/EventExplorer";
import { getEvents } from "@/lib/data";
import { parseFilters } from "@/lib/event-filters";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Events — Stand-up Comedy, Open Mics & Poetry",
  description:
    "Weekly stand-up comedy, midnight shows, Comedy Roulette, Mass Bunk, and comedy & poetry open mics at The Habitat, Khar West, Mumbai. Book on BookMyShow.",
  path: "/events",
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EventsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initial = parseFilters(Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
  const events = await getEvents();
  return (
    <>
      <PageHero
        eyebrow="#gigs"
        title={
          <>
            What&apos;s <span className="text-amber">on</span>
          </>
        }
        intro={
          <>
            The weekly line-up as last published by The Habitat. Tickets are sold on{" "}
            <a href={site.ticketing.bookmyshow} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">
              BookMyShow
            </a>
            , which always has the latest dates, times and availability.
          </>
        }
        crumbs={[{ name: "Events", path: "/events" }]}
      />
      <section className="container-x pb-28">
        <EventExplorer events={events} initial={initial} />
      </section>
    </>
  );
}

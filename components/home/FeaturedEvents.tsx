import type { EventCardData } from "@/types/event";
import { EmptyState } from "@/components/ui/EmptyState";
import { PinnedEvents } from "@/components/home/PinnedEvents";

export function FeaturedEvents({ events }: { events: EventCardData[] }) {
  if (events.length === 0) {
    return (
      <section className="container-x py-20" aria-labelledby="featured-heading">
        <p className="eyebrow mb-3">#gigs</p>
        <h2 id="featured-heading" className="display-lg mb-10">
          On the bill
        </h2>
        <EmptyState title="New shows coming soon">Follow @indiehabitat on Instagram for the next line-up.</EmptyState>
      </section>
    );
  }
  return <PinnedEvents events={events} />;
}

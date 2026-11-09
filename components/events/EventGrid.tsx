import type { EventCardData } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export function EventGrid({ events, numbered, cols = 3 }: { events: EventCardData[]; numbered?: boolean; cols?: 3 | 4 }) {
  return (
    <Stagger as="ul" className={`grid gap-x-6 gap-y-10 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "xl:grid-cols-3"}`}>
      {events.map((e, i) => (
        <StaggerItem as="li" key={e.id}>
          <EventCard event={e} index={numbered ? i : undefined} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

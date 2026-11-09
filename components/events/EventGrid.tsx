import type { EventCardData } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export function EventGrid({ events, numbered, cols = 3 }: { events: EventCardData[]; numbered?: boolean; cols?: 3 | 4 }) {
  return (
    <Stagger
      as="ul"
      className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 [&::-webkit-scrollbar]:hidden ${cols === 4 ? "lg:grid-cols-4" : "xl:grid-cols-3"}`}
    >
      {events.map((e, i) => (
        <StaggerItem as="li" key={e.id} className="w-[46vw] max-w-[220px] shrink-0 snap-start sm:w-auto sm:max-w-none">
          <EventCard event={e} index={numbered ? i : undefined} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

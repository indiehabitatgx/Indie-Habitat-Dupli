import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EventCardData } from "@/types/event";
import { EventGrid } from "@/components/events/EventGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";

export function FeaturedEvents({ events }: { events: EventCardData[] }) {
  return (
    <section className="pb-20 pt-6 md:pb-28 md:pt-10" aria-labelledby="featured-heading">
      <div className="container-x">
        <SectionHeading
          eyebrow="#gigs"
          id="featured-heading"
          title="On the bill"
          intro="The weekly line-up as last published by The Habitat. Times and prices can change — booking happens on BookMyShow, which always has the latest."
          action={
            <Link href="/events" className={buttonVariants({ variant: "outline" })}>
              All events <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        />
        <div className="mt-14">
          {events.length > 0 ? (
            <EventGrid events={events} numbered cols={events.length % 4 === 0 ? 4 : 3} />
          ) : (
            <EmptyState title="New shows coming soon">Follow @indiehabitat on Instagram for the next line-up.</EmptyState>
          )}
        </div>
      </div>
    </section>
  );
}

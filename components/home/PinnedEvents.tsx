"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { EventCardData } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";

const CARD =
  "shrink-0 w-[min(64vw,280px,calc((100svh_-_var(--tabbar-h)_-_250px)_*_0.62))] sm:w-[min(340px,calc((100svh_-_var(--tabbar-h)_-_430px)_*_0.7))]";

/**
 * Scroll-locked horizontal gallery: the section pins while vertical scrolling slides the cards sideways,
 * then releases after the last card. Native scrolling throughout (no hijacking). With reduced motion it
 * falls back to a normal swipeable row.
 */
export function PinnedEvents({ events }: { events: EventCardData[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  // Measure how far the track must travel horizontally; that becomes the extra scroll height.
  useEffect(() => {
    const el = track.current;
    if (!el || reduce) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce, events.length]);

  const pinned = !reduce && distance > 0;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.06, 0.94], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 260, damping: 40, mass: 0.35 });
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 34 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(events.length - 1, Math.max(0, Math.round(p * (events.length - 1)))));
  });

  return (
    <section
      ref={section}
      className="relative"
      // Extra height = horizontal travel, so one pixel of scroll moves the cards one pixel.
      style={pinned ? { height: `calc(${Math.round(distance / 0.88)}px + 100svh)` } : undefined}
      aria-labelledby="featured-heading"
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-[calc(100svh-var(--tabbar-h))] flex-col justify-center overflow-hidden pt-[calc(var(--header-h)+1.25rem)] md:pt-[calc(var(--header-h)+1.75rem)] lg:h-svh"
            : "py-12"
        }
      >
        <div className="container-x mb-5 flex items-end justify-between gap-6 md:mb-6">
          <div>
            <p className="eyebrow mb-2">#gigs</p>
            <h2 id="featured-heading" className="display-lg">
              On the bill
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <p className="font-display text-sm font-bold tabular-nums text-muted" aria-live="polite">
              <span className="text-amber">{String(active + 1).padStart(2, "0")}</span> / {String(events.length).padStart(2, "0")}
            </p>
            <Link href="/events" className="hidden items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] hover:text-amber sm:inline-flex">
              All events <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <motion.div
          ref={track}
          style={pinned ? { x: smoothX } : undefined}
          className={
            pinned
              ? "flex w-max gap-4 pl-[max(1rem,calc((100vw-1360px)/2+clamp(1rem,4vw,3rem)))] pr-[clamp(1rem,4vw,3rem)] will-change-transform sm:gap-6"
              : "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }
        >
          {events.map((e, i) => (
            <div key={e.id} className={`${CARD} ${pinned ? "" : "snap-start"}`}>
              <EventCard event={e} index={i} />
            </div>
          ))}
          <Link
            href="/events"
            className={`${CARD} group flex flex-col items-center justify-center gap-4 border border-dashed border-line bg-surface p-6 text-center transition hover:border-amber`}
          >
            <span className="grid size-16 place-items-center rounded-full border border-amber/60 transition group-hover:bg-amber group-hover:text-amber-ink">
              <ArrowRight className="size-6" aria-hidden />
            </span>
            <span className="font-display text-lg font-extrabold uppercase">All events</span>
            <span className="text-sm text-muted">Search, filter by day and book on BookMyShow</span>
          </Link>
        </motion.div>

        {pinned && (
          <div className="container-x mt-5" aria-hidden>
            <div className="h-px w-full bg-line">
              <motion.div className="h-px origin-left bg-amber" style={{ scaleX: bar }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

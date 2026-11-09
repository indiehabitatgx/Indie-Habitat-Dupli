"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Each experience is listed on the original venue pages. */
const experiences = [
  {
    title: "Stand-up Comedy",
    text: "Nightly line-ups, curated showcases, midnight sets and comedy specials taped live.",
    href: "/events?category=comedy",
    cta: "Comedy shows",
    image: "/images/gallery/audience.webp",
    alt: "Audience laughing during a show at The Habitat",
  },
  {
    title: "Live Music",
    text: "Intimate singer-songwriter gigs downstairs; rap, metal and alternative gigs Above The Habitat.",
    href: "/venue/above-the-habitat",
    cta: "Above The Habitat",
    image: "/images/venue/above-the-habitat-stage.webp",
    alt: "Above The Habitat stage against an exposed brick wall",
  },
  {
    title: "Poetry",
    text: "Performance poetry and a weekly Poetry Open Mic, where words come alive.",
    href: "/events/poetry-open-mic",
    cta: "Poetry Open Mic",
    image: "/images/events/poetry-open-mic.webp",
    alt: "Poetry Open Mic poster",
  },
  {
    title: "Storytelling & Improv",
    text: "Improv comedy, storytelling and theatre share the same stages.",
    href: "/venue/the-habitat",
    cta: "The Habitat",
    image: "/images/venue/the-habitat-stage.webp",
    alt: "The Habitat stage with the circled-H logo on a timber wall",
  },
  {
    title: "Screenings",
    text: "Movie screenings, short films and live sports on an 8 × 8 ft screen.",
    href: "/venue/the-habitat",
    cta: "Room specs",
    image: "/images/hero/stage-bw.webp",
    alt: "The Habitat stage in black and white",
  },
  {
    title: "Recordings",
    text: "Comedy specials, podcasts and ad shoots — with in-house videographers and editors.",
    href: "/venue/jam-room",
    cta: "The Jam Room",
    image: "/images/venue/jam-room.webp",
    alt: "Drum kit in the soundproofed Jam Room",
  },
];

const N = experiences.length;
/** Scroll distance (in viewport heights) spent on each item while the section is pinned. */
const STEP_VH = 55;

/**
 * Pinned scroll story: the section sticks to the viewport and each scroll step activates the next
 * experience. It releases after the last one. Native scrolling throughout (no scroll hijacking), so
 * keyboard, trackpads and screen readers behave normally; every item is also a button that jumps to it.
 */
export function ExperiencesSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N * 0.9999))));
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + ((i + 0.5) / N) * distance, behavior: reduce ? "auto" : "smooth" });
  };

  const current = experiences[active];

  return (
    <section
      ref={ref}
      className="relative border-y border-line bg-surface"
      style={{ height: `calc(${N * STEP_VH}svh + 100svh)` }}
      aria-labelledby="experiences-heading"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[var(--header-h)]">
        <div className="container-x grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: heading + list */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-end justify-between gap-6 lg:mb-10">
              <div>
                <p className="eyebrow mb-3">#experiences</p>
                <h2 id="experiences-heading" className="display-lg">
                  Pick your <span className="text-amber">poison.</span>
                </h2>
              </div>
              <p className="shrink-0 font-display text-sm font-bold tabular-nums text-muted" aria-live="polite">
                <span className="text-amber">{String(active + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
              </p>
            </div>

            <div className="relative flex gap-5 lg:gap-8">
              {/* Progress rail */}
              <div className="relative hidden w-px shrink-0 bg-line sm:block" aria-hidden>
                <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-amber" style={{ scaleY: rail }} />
              </div>

              <ol className="w-full">
                {experiences.map((x, i) => {
                  const isActive = i === active;
                  return (
                    <li key={x.title} className="border-b border-line first:border-t">
                      <button
                        type="button"
                        onClick={() => jumpTo(i)}
                        aria-current={isActive ? "step" : undefined}
                        className="group grid w-full grid-cols-[2.25rem_1fr] items-baseline gap-3 py-3 text-left lg:py-4"
                      >
                        <span
                          className={cn(
                            "font-display text-xs font-bold tabular-nums transition-colors duration-500",
                            isActive ? "text-amber" : "text-muted",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-display text-[clamp(1.05rem,1.8vw,1.4rem)] font-extrabold uppercase leading-tight transition-[color,opacity,transform] duration-500 ease-out-expo",
                            isActive ? "translate-x-1.5 text-amber" : "text-fg/60 group-hover:text-fg/85",
                          )}
                        >
                          {x.title}
                        </span>
                      </button>
                      {/* Detail of the active item expands in place */}
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                        aria-hidden={!isActive}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-3 pb-4 pl-[3rem] sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-md text-[0.95rem] text-muted">{x.text}</p>
                            <Link
                              href={x.href}
                              tabIndex={isActive ? 0 : -1}
                              className="inline-flex shrink-0 items-center gap-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-amber hover:underline"
                            >
                              {x.cta} <ArrowUpRight className="size-3.5" aria-hidden />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right: stacked images, active one wipes in */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative aspect-[4/5] max-h-[68svh] w-full overflow-hidden bg-bg">
              {experiences.map((x, i) => (
                <div
                  key={x.title}
                  className="absolute inset-0 transition-[clip-path,opacity] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                  style={{
                    clipPath: i === active ? "inset(0 0 0 0)" : i < active ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                    opacity: i === active ? 1 : 0.4,
                  }}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={x.image}
                    alt={x.alt}
                    fill
                    sizes="40vw"
                    className={cn(
                      "object-cover transition-transform duration-[1400ms] ease-out-expo",
                      i === active ? "scale-100" : "scale-110",
                    )}
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
              <motion.p
                key={current.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-0 p-6 font-display text-lg font-extrabold uppercase"
                aria-hidden
              >
                {current.title}
              </motion.p>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" aria-hidden />
            </div>
            <span className="ring-motif pointer-events-none absolute -bottom-8 -right-8 size-32" aria-hidden />
          </div>

          {/* Mobile/tablet: compact image strip for the active item */}
          <div className="relative aspect-[21/9] overflow-hidden bg-bg lg:hidden [@media(max-height:720px)]:hidden">
            {experiences.map((x, i) => (
              <div
                key={x.title}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
                aria-hidden
              >
                <Image src={x.image} alt="" fill sizes="100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

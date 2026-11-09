"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { OutlineText } from "@/components/ui/OutlineText";

const lines = [
  { text: "Stand-up,", outline: false },
  { text: "music &", outline: false },
  { text: "poetry.", outline: true },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative -mt-[var(--header-h)] flex min-h-[calc(100svh-var(--tabbar-h)-3rem)] flex-col justify-end lg:min-h-[100svh] overflow-hidden pb-6 pt-[calc(var(--header-h)+2.5rem)] md:pb-16 md:pt-[calc(var(--header-h)+6rem)]"
      aria-labelledby="hero-heading"
    >
      {/* Photo: the real Habitat stage, B&W, with slow push-in */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: imgY }}>
        <div className="grain relative size-full animate-push-in motion-reduce:animate-none">
          <Image
            src="/images/hero/stage-bw-hd.webp"
            alt="Above The Habitat in black and white: a single mic stand under a spotlight on an empty stage, the circled-H logo on the brick wall, rows of chairs in the dark"
            fill
            priority
            fetchPriority="high"
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-bg" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_20%,rgba(10,10,10,0.75)_75%)]" aria-hidden />
      </motion.div>

      <motion.div className="container-x relative" style={reduce ? undefined : { opacity: fade }}>
        <p className="eyebrow mb-4 flex animate-fade-in items-center gap-3 [animation-delay:150ms] md:mb-6">
          <span className="inline-block h-px w-10 bg-amber" aria-hidden />
          Comedy and Music Cafe · Khar, Mumbai
        </p>

        <h1 id="hero-heading" className="display-xl !text-[clamp(2.75rem,6.6vw,5.75rem)] !leading-[0.95]">
          {lines.map((l, i) => (
            <span key={l.text} className="block overflow-hidden pb-[0.04em]">
              {l.outline ? (
                <span className="block animate-rise motion-reduce:animate-none" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  <OutlineText>{l.text}</OutlineText>
                </span>
              ) : (
                <span className="block animate-rise motion-reduce:animate-none" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {l.text}
                </span>
              )}
            </span>
          ))}
        </h1>

        <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end md:gap-8">
          <p className="max-w-xl animate-fade-in text-base text-fg/85 [animation-delay:450ms] md:col-span-6 md:text-xl [@media(max-height:700px)_and_(max-width:767px)]:hidden">
            An intimate 55–70 seater for music, stand-up comedy, poetry and alternate events — with a 250-capacity hall
            upstairs for gigs, comedy specials and recordings.
          </p>
          <div className="grid animate-fade-in grid-cols-2 gap-2.5 [animation-delay:550ms] sm:flex sm:gap-3 md:col-span-6 md:justify-end">
            <Link href="/events" className={`${buttonVariants()} whitespace-nowrap px-2 text-[0.68rem] tracking-[0.08em] sm:px-6 sm:text-[0.8rem] sm:tracking-[0.14em] md:min-h-14 md:px-8`}>
              Explore events <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/venue" className={`${buttonVariants({ variant: "outline" })} whitespace-nowrap px-2 text-[0.68rem] tracking-[0.08em] sm:px-6 sm:text-[0.8rem] sm:tracking-[0.14em] md:min-h-14 md:px-8`}>
              <span className="sm:hidden">The venue</span>
              <span className="hidden sm:inline">Discover The Habitat</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 hidden items-center justify-between border-t border-white/15 pt-5 text-sm text-fg/70 md:flex">
          <a href="#intro" className="group inline-flex min-h-11 items-center gap-2 hover:text-amber">
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" aria-hidden /> Scroll
          </a>
          <span className="hidden sm:block">Open 12pm to 12am</span>
        </div>
      </motion.div>

      {/* Rotating ring of type — echoes the circled-H without reproducing the logo */}
      <div
        className="pointer-events-none absolute right-[4vw] top-[calc(var(--header-h)+6vh)] hidden size-40 animate-fade-in [animation-delay:700ms] md:block lg:size-48"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="size-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <path id="ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <circle cx="100" cy="100" r="96" fill="none" stroke="var(--brand-primary)" strokeOpacity=".5" />
          <text className="fill-fg font-display text-[15px] font-bold uppercase tracking-[0.32em]">
            <textPath href="#ring">Comedy · Music · Poetry · Open mics ·</textPath>
          </text>
        </svg>
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber" />
      </div>
    </section>
  );
}

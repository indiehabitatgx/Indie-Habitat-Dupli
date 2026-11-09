import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Viewfinder } from "@/components/home/Viewfinder";
import { buttonVariants } from "@/components/ui/Button";

/** Every figure and format below is quoted from the venue pages on indiehabitat.com. */
const formats = ["Stand-up", "Improv", "Storytelling", "Intimate gigs", "Performance poetry", "Screenings", "Open mics"];

const stats = [
  { value: "55–75", label: "Seats in The Habitat", note: "with or without tables" },
  { value: "250", label: "Standing, Above The Habitat", note: "160 seated, theatre style" },
  { value: "6", label: "Weekly shows", note: "on the last published schedule" },
  { value: "12–12", label: "Open noon to midnight", note: "every day" },
];

export function IntroSection() {
  return (
    <section id="intro" className="relative overflow-hidden py-20 md:py-28" aria-labelledby="intro-heading">
      <div className="spotlight left-[20%] top-[-30%] opacity-40" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Left: viewfinder collage */}
        <div className="relative lg:col-span-5">
          <ImageReveal className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Image
              src="/images/gallery/audience.webp"
              alt="An audience at The Habitat, one person laughing with head thrown back"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[40%_50%] grayscale-[0.3]"
            />
            <Viewfinder />
          </ImageReveal>
          <Reveal
            delay={0.25}
            className="absolute -bottom-8 -right-3 w-[46%] border-[6px] border-bg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] sm:-right-6 lg:-right-10"
          >
            <div className="relative aspect-[4/3]">
              <Image src="/images/venue/jam-room.webp" alt="The Jam Room, set up for a recording" fill sizes="20vw" className="object-cover" />
            </div>
            <p className="bg-bg px-3 py-2 font-display text-[0.6rem] font-bold uppercase tracking-[0.18em] text-amber">The Jam Room</p>
          </Reveal>
          <span className="ring-motif pointer-events-none absolute -bottom-12 -left-12 hidden size-28 lg:block" aria-hidden />
        </div>

        {/* Right: statement */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-amber" aria-hidden />
              #thehabitatstudios
            </p>
          </Reveal>
          <TextReveal
            id="intro-heading"
            as="h2"
            className="display-md !text-[clamp(1.5rem,2.6vw,2.25rem)] !leading-[1.12]"
            text="A space for stand-up, improv, storytelling, intimate gigs, poetry, screenings and open mics — recorded live, more often than not."
            accent={["recorded", "live"]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-fg/80">
              The Habitat is known for its live gig recording services: a super cozy space with state of the art audio and video recording.
              Several stand-up comedy specials, comedy gigs and poetry videos have been recorded live here, with in-house videographers and
              editors on hand.
            </p>
          </Reveal>
          <Stagger as="ul" className="mt-8 flex flex-wrap gap-2" stagger={0.05}>
            {formats.map((f) => (
              <StaggerItem
                as="li"
                key={f}
                className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold transition-colors hover:border-amber hover:text-amber"
              >
                {f}
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
            <Link href="/venue" className={buttonVariants()}>
              Explore the venue <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/venue/jam-room" className={buttonVariants({ variant: "outline" })}>
              Book a recording
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Stats band */}
      <div className="container-x relative mt-24 lg:mt-28">
        <Stagger as="dl" className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem
              key={s.label}
              className={`group relative flex flex-col gap-2 px-4 py-8 md:px-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="order-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-fg">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-black leading-none tracking-tight text-amber">
                <CountUp value={s.value} />
              </dd>
              <dd className="order-3 text-sm text-muted">{s.note}</dd>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber transition-transform duration-700 ease-out-expo group-hover:scale-x-100" aria-hidden />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

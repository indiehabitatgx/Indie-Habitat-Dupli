import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mic } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { site } from "@/lib/site";

const ways = [
  {
    title: "Hit the open mic",
    text: "Comedy Open Mic on Mondays at 7 pm & 9 pm. Poetry Open Mic on Sundays at 2 pm and Mondays at 8 pm.",
    href: "/events?q=open+mic",
    cta: "Open mic nights",
    external: false,
  },
  {
    title: "Perform at The Habitat",
    text: "Comics, musicians, poets, podcasters — tell the team what you want to put on stage.",
    href: "/contact",
    cta: "Pitch your show",
    external: false,
  },
  {
    title: "Friends Of Habitat",
    text: "Join The Habitat's community on WhatsApp.",
    href: site.social.whatsapp,
    cta: "Join on WhatsApp",
    external: true,
  },
];

export function CommunitySection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="community-heading">
      <div className="slats absolute inset-x-0 top-0" aria-hidden />
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:col-span-5 lg:self-start">
          <p className="eyebrow mb-4">#community</p>
          <TextReveal id="community-heading" className="display-lg" text="Your turn on the mic." accent={["mic"]} />

          {/* Stage + crowd photo stack with a spinning "your set here" sticker */}
          <div className="relative mt-10 mr-6 max-w-[26rem] sm:mr-10">
            <div className="relative aspect-[4/3] overflow-hidden border border-line sm:aspect-[5/4]">
              <Image
                src="/images/hero/stage-bw-hd.webp"
                alt="The empty stage at The Habitat, mic on the stand"
                fill
                sizes="(min-width: 1024px) 416px, 90vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_30%,rgba(252,178,50,0.28),transparent_70%)] mix-blend-screen" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" aria-hidden />
              <p className="absolute bottom-4 left-4 font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/80">
                The stage · Khar West
              </p>
            </div>
            <div className="absolute -bottom-8 -right-6 w-[46%] rotate-3 border-4 border-bg shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:-right-10">
              <div className="relative aspect-[4/3]">
                <Image src="/images/gallery/audience.webp" alt="A packed Habitat crowd" fill sizes="200px" className="object-cover" />
              </div>
            </div>
            <div className="absolute -left-4 -top-6 grid size-24 place-items-center sm:-left-6" aria-hidden>
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
                <defs>
                  <path id="community-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-amber" />
                <text className="fill-amber-ink font-display text-[10px] font-black uppercase">
                  <textPath href="#community-ring" textLength="236" lengthAdjust="spacingAndGlyphs">Your set here · Your set here · </textPath>
                </text>
              </svg>
              <Mic className="relative size-7 text-amber-ink" />
            </div>
          </div>

          <ul className="mt-16 flex flex-wrap gap-2" aria-label="Who takes the stage">
            {["Comedy", "Poetry", "Music", "Storytelling", "Podcasts"].map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Stagger as="ol" className="grid gap-px bg-line lg:col-span-7">
          {ways.map((w, i) => (
            <StaggerItem as="li" key={w.title} className="group bg-bg p-6 md:p-8">
              <div className="flex items-start gap-5">
                  <span className="ring-motif grid size-11 shrink-0 place-items-center font-display text-sm font-black text-amber">{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-extrabold uppercase">{w.title}</h3>
                    <p className="mt-2 text-muted">{w.text}</p>
                    {w.external ? (
                      <a href={w.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline">
                        {w.cta} <ArrowUpRight className="size-4" aria-hidden />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={w.href} className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline">
                        {w.cta} <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

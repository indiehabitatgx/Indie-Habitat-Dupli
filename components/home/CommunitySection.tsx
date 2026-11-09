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
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">#community</p>
          <TextReveal id="community-heading" className="display-lg" text="Your turn on the mic." accent={["mic"]} />
          <Mic className="mt-10 size-16 stroke-[1] text-amber" aria-hidden />
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

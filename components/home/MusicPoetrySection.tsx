import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { site } from "@/lib/site";

export function MusicPoetrySection() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28" aria-labelledby="music-heading">
      <div className="spotlight opacity-60" aria-hidden />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-4">#livemusic #poetry</p>
            <TextReveal id="music-heading" className="display-lg" text="Turn it up. Then hush for the poets." accent={["poets"]} />
            <p className="prose-habitat mt-6 text-lg">
              Intimate singer-songwriter and band sets downstairs, rap, metal and alternative gigs upstairs — with stereo
              and multi-track recording for all of it. Sundays at 2 pm and Mondays at 8 pm, the Poetry Open Mic takes the stage.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link href="/events/poetry-open-mic" className="group inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] hover:text-amber">
                Poetry Open Mic <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <a
                href={site.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] hover:text-amber"
              >
                Subscribe on YouTube <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
        <div className="grid gap-6 lg:col-span-7">
          <Reveal delay={0.1}>
            <YouTubeEmbed id="Nuy-v8M6ong" title="ABDC Show 02 — The Habitat fill-up timelapse" poster="/images/backgrounds/video-abdc-timelapse.webp" />
          </Reveal>
          <Reveal delay={0.15} className="grid gap-6 sm:grid-cols-2">
            <YouTubeEmbed id="JgSaV2NDqHI" title="prabhdeep (video by Mongrel Design)" poster="/images/backgrounds/video-prabhdeep.webp" />
            <YouTubeEmbed id="MP9vWWP186w" title="Jam Room @ The Habitat" poster="/images/backgrounds/video-jam-room.webp" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

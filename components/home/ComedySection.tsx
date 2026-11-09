import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { buttonVariants } from "@/components/ui/Button";

const tapings = ["Son Of Abish", "Amazon Prime Video stand-up specials", "Aisi Taisi Democracy"];

export function ComedySection() {
  return (
    <section className="relative py-20 md:py-28" aria-labelledby="comedy-heading">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <ImageReveal className="relative aspect-[4/3] overflow-hidden">
          <Parallax offset={40} className="relative size-full">
            <Image
              src="/images/gallery/audience.webp"
              alt="Audience members seen from behind, one laughing with head thrown back"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="scale-110 object-cover"
            />
          </Parallax>
          </ImageReveal>
          <p className="absolute -bottom-6 left-4 bg-amber px-4 py-2 font-display text-xs font-black uppercase tracking-[0.16em] text-amber-ink md:left-8">
            Fresh jokes only
          </p>
        </div>
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-4">#standupcomedy</p>
            <TextReveal id="comedy-heading" className="display-lg" text="Where the specials get taped." accent={["taped"]} />
            <p className="prose-habitat mt-6 text-lg">
              Comedy runs most nights — from the 10 pm All Star line-up to the midnight show that calls itself the last comedy
              show in the city. Above The Habitat has hosted live tapings including:
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {tapings.map((t) => (
                <li key={t} className="flex items-center gap-3 py-3 font-display text-sm font-bold uppercase tracking-wide">
                  <span className="ring-motif size-3 shrink-0" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <Link href="/events?category=comedy" className={`${buttonVariants()} mt-8`}>
              Comedy shows <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

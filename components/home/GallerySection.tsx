import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { buttonVariants } from "@/components/ui/Button";

const shots = [
  { src: "/images/gallery/stage-decor.webp", alt: "Stage dressed with drapes, fairy lights and flowers for a private event", w: 2000, h: 1334, cls: "md:col-span-7 md:row-span-2" },
  { src: "/images/venue/terrace.webp", alt: "Terrace tables under a vine-covered trellis at night", w: 978, h: 650, cls: "md:col-span-5" },
  { src: "/images/venue/the-habitat-stage.webp", alt: "The Habitat stage with the circled-H logo", w: 1114, h: 626, cls: "md:col-span-5" },
  { src: "/images/gallery/community-meetup.webp", alt: "A community meet-up around long tables in the café", w: 2000, h: 1333, cls: "md:col-span-4" },
  { src: "/images/venue/jam-room.webp", alt: "Drum kit in the Jam Room", w: 1280, h: 720, cls: "md:col-span-4" },
  { src: "/images/gallery/celebration.webp", alt: "Celebration cake and champagne", w: 2000, h: 1333, cls: "md:col-span-4" },
];

export function GallerySection() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="moments-heading">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">#momentsathabitat</p>
            <TextReveal id="moments-heading" className="display-lg" text="Moments at Habitat" />
          </div>
          <Link href="/gallery" className={buttonVariants({ variant: "outline" })}>
            Full gallery <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Stagger className="grid auto-rows-[minmax(0,1fr)] gap-4 md:grid-cols-12">
          {shots.map((s) => (
            <StaggerItem key={s.src} className={`group relative aspect-[4/3] overflow-hidden bg-surface md:aspect-auto md:min-h-64 ${s.cls}`}>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover grayscale-[0.7] transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

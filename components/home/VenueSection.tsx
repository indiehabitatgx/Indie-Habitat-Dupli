import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { venues } from "@/lib/venues";
import { Reveal } from "@/components/motion/Reveal";
import { OutlineText } from "@/components/ui/OutlineText";

export function VenueSection() {
  const [main, above, jam] = venues;
  return (
    <section className="py-20 md:py-28" aria-labelledby="venue-heading">
      <div className="container-x">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">#thevenue</p>
            <h2 id="venue-heading" className="display-lg">
              Three rooms.
              <br />
              <OutlineText>One habitat.</OutlineText>
            </h2>
          </div>
          <p className="max-w-sm text-muted">Stages, gear and recording crews you can book — for a gig, a special, a podcast or a party.</p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
          <VenueTile venue={above} className="md:col-span-8 md:row-span-2" tall />
          <VenueTile venue={main} className="md:col-span-4" />
          <VenueTile venue={jam} className="md:col-span-4" />
        </div>
      </div>
    </section>
  );
}

function VenueTile({
  venue,
  className,
  tall,
}: {
  venue: (typeof venues)[number];
  className?: string;
  tall?: boolean;
}) {
  return (
    <Reveal className={className}>
      <Link href={`/venue/${venue.slug}`} className="group relative block h-full overflow-hidden bg-surface">
        <div className={`relative ${tall ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[38rem]" : "aspect-[4/3]"}`}>
          <Image
            src={venue.image}
            alt={venue.imageAlt}
            fill
            sizes={tall ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" aria-hidden />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <div>
            <p className="eyebrow mb-2">{venue.hashtag}</p>
            <h3 className={`font-display font-black uppercase leading-none ${tall ? "text-2xl md:text-3xl" : "text-xl"}`}>{venue.name}</h3>
            <p className="mt-3 max-w-md text-sm text-fg/80">{venue.summary}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/30 transition duration-500 group-hover:rotate-45 group-hover:border-amber group-hover:bg-amber group-hover:text-amber-ink">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { buttonVariants } from "@/components/ui/Button";

const offers = [
  "Conferences & seminars — AM tea, lunch, PM tea",
  "Cocktail functions — starters & beverage packages",
  "Social functions — lunch & dinner menus",
  "Punjabi, Continental, Mughlai & Chinese cuisines",
];

export function CorporateSection() {
  return (
    <section className="paper relative overflow-hidden py-20 md:py-28" aria-labelledby="corporate-heading">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow mb-4">#banquets &amp; #conferences</p>
          <TextReveal id="corporate-heading" className="display-lg" text="Meetings, parties & offsites." />
          <p className="mt-6 max-w-xl text-lg text-paper-muted">
            The Habitat has a spacious facility for all banqueting and conferencing events — from parties to meetings to
            company offsites. Base packages are customisable with additional food and beverages.
          </p>
          <ul className="mt-8 grid gap-3">
            {offers.map((o) => (
              <li key={o} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0" aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/corporate-events" className={buttonVariants({ variant: "dark", size: "lg" })}>
              Plan a private event <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/corporate-events#enquire" className={`${buttonVariants({ variant: "ghost" })} !text-paper-ink hover:!text-[#8a5a00]`}>
              Send an enquiry
            </Link>
          </div>
        </Reveal>
        <div className="relative lg:col-span-6">
          <ImageReveal className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/gallery/stage-decor.webp"
              alt="A stage dressed with red and gold drapes, fairy lights and flowers for a private function"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>
          <Reveal delay={0.15} className="absolute -bottom-8 -left-4 hidden w-[44%] border-8 border-paper shadow-2xl md:block lg:-left-12">
            <Image src="/images/gallery/celebration.webp" alt="Celebration cake with champagne" width={2000} height={1333} sizes="22vw" className="h-auto w-full" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

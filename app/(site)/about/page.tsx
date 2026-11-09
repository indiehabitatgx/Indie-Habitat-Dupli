import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { buttonVariants } from "@/components/ui/Button";
import { getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About The Habitat — Comedy and Music Cafe",
  description:
    "The Habitat is a comedy and music cafe in Khar West, Mumbai — home to stand-up, improv, storytelling, intimate gigs, poetry and live recordings.",
  path: "/about",
  image: "/images/venue/the-habitat-stage.webp",
});

const formats = [
  "Stand-up comedy",
  "Improv comedy",
  "Storytelling",
  "Intimate music gigs",
  "Performance poetry",
  "Movie screenings",
  "Live sports screenings",
  "Open mics",
  "Rap, metal & alternative gigs",
  "Theatre",
  "Short film screenings",
  "Smaller conferences",
];

/** From the original terms & conditions — how a night at The Habitat works. */
const nightRules = [
  { k: "Arrive early", v: "Get there at least 30 minutes before the show for a seamless entry." },
  { k: "Free seating", v: "First come, first served — there are no seat numbers." },
  { k: "Doors close", v: "Entry shuts 5 minutes after the show starts, so the performance isn't disturbed." },
  { k: "18+ only", v: "Carry a government-issued ID; it may be asked for at the gate." },
];

export default async function AboutPage() {
  const { aboutStory } = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="#about"
        title={
          <>
            A habitat for the <span className="text-amber">indie.</span>
          </>
        }
        intro={`${site.name} is a ${site.tagline.toLowerCase()} in Khar West, Mumbai — and the stage behind the indiehabitat handle.`}
        image="/images/hero/stage-bw.webp"
        imageAlt="The Habitat's stage in black and white"
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">#whatwedo</p>
          <h2 className="display-md">Stages for every kind of act.</h2>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal className="prose-habitat text-lg">
            <p>
              The Habitat is an intimate 55–70 seater for music, stand-up comedy, poetry and alternate events. Upstairs,
              Above The Habitat is a 150–250 capacity room for gigs, comedy specials and recordings. And a
              soundproofed jam room doubles as a podcast studio.
            </p>
            <p>
              The venue is known for its live gig recording services — several stand-up comedy specials, comedy gigs and
              poetry videos have been recorded live here, with in-house videographers and editors available.
            </p>
          </Reveal>
          <Stagger as="ul" className="mt-10 flex flex-wrap gap-2">
            {formats.map((f) => (
              <StaggerItem as="li" key={f} className="border border-line px-4 py-2 text-sm font-semibold">
                {f}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {aboutStory && (
        <section className="paper py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow mb-4">#ourstory</p>
              <h2 className="display-md">Our story</h2>
            </Reveal>
            <Reveal delay={0.08} className="max-w-[62ch] space-y-5 text-lg lg:col-span-8">
              {aboutStory.split(/\n{2,}/).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-y border-line">
        <Parallax offset={70} className="relative h-[70vh] min-h-96">
          <Image
            src="/images/gallery/audience.webp"
            alt="An audience at The Habitat, one person laughing with head thrown back"
            fill
            sizes="100vw"
            className="scale-125 object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" aria-hidden />
        <div className="container-x absolute inset-0 flex items-center">
          <Reveal className="max-w-xl">
            <p className="eyebrow mb-4">#thehabitatexperience</p>
            <h2 className="display-lg">Small room. Big laughs.</h2>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-labelledby="night-heading">
        <p className="eyebrow mb-4">#howitworks</p>
        <h2 id="night-heading" className="display-md mb-12">
          How a night at The Habitat works
        </h2>
        <Stagger as="ol" className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {nightRules.map((r, i) => (
            <StaggerItem as="li" key={r.k} className="bg-bg p-6 md:p-8">
              <span className="ring-motif grid size-12 place-items-center font-display font-black text-amber">{i + 1}</span>
              <h3 className="mt-6 font-display text-xl font-extrabold uppercase">{r.k}</h3>
              <p className="mt-2 text-muted">{r.v}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-line bg-surface py-24">
        <div className="container-x flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow mb-4">#community</p>
            <h2 className="display-md max-w-2xl">Come watch. Or come on stage.</h2>
            <p className="mt-5 max-w-xl text-muted">
              Weekly open mics for comedy and poetry, and a team that wants to hear from comics, musicians, poets and
              podcasters.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className={buttonVariants()}>
              See events <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
              Perform at The Habitat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

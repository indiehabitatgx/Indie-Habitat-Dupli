import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-amber py-24 text-amber-ink md:py-32" aria-labelledby="newsletter-heading">
      <span className="absolute -right-24 -top-24 size-96 rounded-full border border-black/15" aria-hidden />
      <span className="absolute -right-8 -top-8 size-64 rounded-full border border-black/15" aria-hidden />
      <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.18em]">#subscribe</p>
          <TextReveal id="newsletter-heading" className="display-lg" text="Don't miss the next good night out." />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5 [&_input]:placeholder:text-amber-ink/60 [&_button:hover]:!text-black">
          <p className="mb-4 text-lg">New line-ups and specials, now and then. Unsubscribe any time.</p>
          <NewsletterForm id="home-newsletter" tone="paper" />
        </Reveal>
      </div>
    </section>
  );
}

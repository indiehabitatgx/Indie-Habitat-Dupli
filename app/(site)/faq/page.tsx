import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqs } from "@/lib/faq";

export const metadata = pageMetadata({
  title: "FAQ — Tickets, Entry, Seating & Bookings",
  description: "Age limit, seating, entry timings, parking, refunds and venue hire at The Habitat, Khar West, Mumbai.",
  path: "/faq",
});



export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="#faq" title="Good questions." intro="Everything about tickets, entry and booking the space." crumbs={[{ name: "FAQ", path: "/faq" }]} />
      <section className="container-x pb-28">
        <div className="mx-auto max-w-4xl border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-extrabold uppercase leading-tight md:text-xl">
                {f.q}
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-xl transition group-open:rotate-45 group-open:border-amber group-open:text-amber" aria-hidden>
                  +
                </span>
              </summary>
              <div className="pb-8 pr-12 text-lg text-fg/80">
                <p>{f.a}</p>
                {f.link && (
                  <Link href={f.link.href} className="mt-3 inline-block font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline">
                    {f.link.label} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}

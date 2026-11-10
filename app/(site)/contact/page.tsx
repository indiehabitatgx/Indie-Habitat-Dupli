import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { LocationCard } from "@/components/contact/LocationCard";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact The Habitat, Khar West, Mumbai",
  description: `Call ${site.phone}, message on WhatsApp, or write to The Habitat — 3rd Road, Khar West, Mumbai 400052. Open ${site.hours}.`,
  path: "/contact",
});

const cards = [
  { icon: Phone, label: "Call", value: site.phone, href: site.phoneHref },
  { icon: Phone, label: "Feedback", value: site.feedbackPhone, href: site.feedbackPhoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: "Message us", href: site.social.whatsapp, external: true },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: "Hours", value: site.hours },
  { icon: MapPin, label: "Find us", value: "Khar West, Mumbai — see map below", href: "#location" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="#contact"
        title={
          <>
            Say <span className="text-amber">hello.</span>
          </>
        }
        intro="Booking a room, pitching a show, bringing your brand in — or just a question about tonight."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="container-x grid gap-16 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
            {cards.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="bg-bg">
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-20 items-start gap-4 p-5 transition hover:bg-surface"
                  >
                    <Icon className="mt-1 size-5 shrink-0 text-amber" aria-hidden />
                    <span>
                      <span className="block font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">{label}</span>
                      <span className="mt-1 block break-words font-semibold group-hover:text-amber">{value}</span>
                      {external && <span className="sr-only">(opens in a new tab)</span>}
                    </span>
                  </a>
                ) : (
                  <div className="flex min-h-20 items-start gap-4 p-5">
                    <Icon className="mt-1 size-5 shrink-0 text-amber" aria-hidden />
                    <span>
                      <span className="block font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">{label}</span>
                      <span className="mt-1 block font-semibold">{value}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <SocialLinks className="mt-8" />
        </div>

        <Reveal className="lg:col-span-7">
          <h2 className="display-md mb-10">Send a message</h2>
          <ContactForm />
        </Reveal>
      </section>

      <section id="location" className="relative scroll-mt-24 border-t border-line" aria-label="Location">
        {/* Phones: card above the map. Desktop: card floats over the map. */}
        <div className="container-x relative z-10 py-10 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:items-center lg:py-0">
          <div className="lg:pointer-events-auto lg:w-[440px]">
            <LocationCard />
          </div>
        </div>
        <div className="relative h-[55vh] min-h-80 lg:h-[78vh] lg:min-h-[620px]">
          <iframe
            title="Map showing The Habitat, Khar West, Mumbai"
            src={site.mapsEmbed}
            className="absolute inset-0 size-full grayscale invert-[0.92] hue-rotate-180"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* darken the map edge behind the card on desktop */}
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/50 to-transparent lg:block lg:w-[48%]" aria-hidden />
          {/* amber pulse around the venue marker (the embed centres on it) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <span className="block size-20 animate-ping rounded-full border-2 border-amber/70 motion-reduce:animate-none" />
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { fullAddress, site } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { SocialLinks } from "@/components/layout/SocialLinks";

const explore = [
  { href: "/events", label: "Events" },
  { href: "/venue/the-habitat", label: "The Habitat" },
  { href: "/venue/above-the-habitat", label: "Above The Habitat" },
  { href: "/venue/jam-room", label: "The Jam Room" },
  { href: "/corporate-events", label: "Banquets & Conferences" },
  { href: "/gallery", label: "Gallery" },
];
const info = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">#stayintheloop</p>
          <p className="max-w-md font-display text-2xl font-extrabold uppercase leading-tight">
            Comedy and music cafe. Khar, Mumbai.
          </p>
          <div className="mt-8 max-w-md">
            <FooterNewsletter />
          </div>
          <SocialLinks className="mt-6" />
        </div>
        <nav aria-label="Explore" className="lg:col-span-2">
          <p className="eyebrow mb-5">#explore</p>
          <ul className="space-y-3">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-amber">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Information" className="lg:col-span-2">
          <p className="eyebrow mb-5">#info</p>
          <ul className="space-y-3">
            {info.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-amber">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic lg:col-span-3">
          <p className="eyebrow mb-5">#contact</p>
          <ul className="space-y-4 text-[0.95rem]">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-amber" aria-hidden />
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber">
                {fullAddress}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 size-4 shrink-0 text-amber" aria-hidden />
              <span>
                <a href={site.phoneHref} className="hover:text-amber">
                  {site.phone}
                </a>
                <br />
                <span className="text-muted">Feedback: </span>
                <a href={site.feedbackPhoneHref} className="hover:text-amber">
                  {site.feedbackPhone}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-1 size-4 shrink-0 text-amber" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-amber">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-1 size-4 shrink-0 text-amber" aria-hidden />
              <span>{site.hours}</span>
            </li>
          </ul>
          <a
            href={site.ticketing.bookmyshow}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-amber hover:underline"
          >
            The Habitat on BookMyShow <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </address>
      </div>

      {/* Oversized wordmark set in type (not the logo) */}
      <div className="container-x select-none" aria-hidden>
        <div className="wordmark" />
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-center text-sm text-muted md:flex-row md:text-left">
          <Logo className="opacity-70 hover:opacity-100" />
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>
            Designed &amp; developed by{" "}
            {/* Followed link (no rel="nofollow"); noopener only protects the opener window. */}
            <a href="https://grindx.io" target="_blank" rel="noopener" className="font-semibold text-fg underline-offset-4 transition-colors hover:text-amber hover:underline">
              GrindX Technologies Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

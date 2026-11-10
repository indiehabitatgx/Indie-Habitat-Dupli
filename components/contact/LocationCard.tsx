"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Clock, Copy, MapPin, Navigation, Phone } from "lucide-react";
import { fullAddress, site } from "@/lib/site";

/** Open 12pm–12am daily, in Mumbai time (computed in the browser so it stays correct on cached pages). */
function isOpenNow() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date()),
  );
  return hour >= 12;
}

export function LocationCard() {
  const [open, setOpen] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${site.name}, ${fullAddress}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the address is still selectable on the card */
    }
  }

  return (
    <article
      aria-labelledby="location-heading"
      className="relative overflow-hidden border border-amber/40 bg-bg/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
      <div className="relative aspect-[16/7] overflow-hidden">
        <Image src="/images/venue/the-habitat-stage.webp" alt="The stage at The Habitat" fill sizes="(min-width: 1024px) 440px, 100vw" className="object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" aria-hidden />
        {open !== null && (
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              open ? "bg-amber text-amber-ink" : "bg-black/70 text-muted"
            }`}
          >
            <span className={`size-1.5 rounded-full ${open ? "animate-pulse bg-amber-ink" : "bg-muted"}`} aria-hidden />
            {open ? "Open now" : "Opens at 12pm"}
          </span>
        )}
      </div>

      <div className="p-6 pl-7 sm:p-7 sm:pl-8">
        <p className="eyebrow mb-2">#findus</p>
        <h2 id="location-heading" className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
          {site.name}
        </h2>
        <p className="mt-1 text-sm text-muted">{site.tagline} · Khar West, Mumbai</p>

        <address className="mt-5 flex gap-3 not-italic">
          <MapPin className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden />
          <span className="leading-relaxed">
            {site.address.line1}
            <br />
            {site.address.locality}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </span>
        </address>
        <p className="mt-3 flex items-center gap-3 text-sm text-muted">
          <Clock className="size-5 shrink-0 text-amber" aria-hidden />
          Open daily, {site.hours}
        </p>

        <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 bg-amber px-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-amber-ink transition hover:brightness-110"
          >
            <Navigation className="size-4" aria-hidden /> Get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
          <a
            href={site.phoneHref}
            aria-label={`Call ${site.phone}`}
            className="grid size-12 place-items-center border border-line transition hover:border-amber hover:text-amber"
          >
            <Phone className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Address copied" : "Copy address"}
            className="grid size-12 place-items-center border border-line transition hover:border-amber hover:text-amber"
          >
            {copied ? <Check className="size-4 text-amber" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? "Address copied to clipboard" : ""}
        </p>
      </div>
    </article>
  );
}

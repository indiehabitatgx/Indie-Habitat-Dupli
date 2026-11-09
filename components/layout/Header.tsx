"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

export function Header({ showArtists }: { showArtists: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = showArtists
    ? [...nav.slice(0, 2), { href: "/artists", label: "Artists" } as const, ...nav.slice(2)]
    : [...nav];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="pointer-events-none sticky top-0 z-50 flex h-[var(--header-h)] flex-col">
      <div
        data-floating={scrolled || undefined}
        className={cn(
          "pointer-events-auto mx-auto flex shrink-0 items-center justify-between gap-6 transition-[max-width,height,margin,padding,border-radius,background-color,box-shadow] duration-500 ease-out-expo",
          scrolled
            ? "liquid-glass mt-4 h-16 w-[calc(100%-1.5rem)] max-w-[1180px] rounded-full pl-5 pr-2 md:mt-6 md:w-[calc(100%-2rem)] md:pl-6"
            : "container-x h-[var(--header-h)] border border-transparent",
        )}
      >
        <Logo priority />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 font-display text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors hover:text-amber",
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-amber after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100",
                    isActive(item.href) && "text-amber after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={site.ticketing.bookmyshow}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex min-h-10 items-center gap-1.5 bg-amber px-3.5 font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-amber-ink transition-[background-color,border-radius] duration-500 hover:bg-fg sm:px-4 sm:text-[0.7rem] sm:tracking-[0.16em]",
              scrolled && "min-h-11 rounded-full",
            )}
          >
            Tickets <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">(BookMyShow, opens in a new tab)</span>
          </a>
          <MobileNavigation items={items} showTrigger={false} />
        </div>
      </div>
    </header>
  );
}

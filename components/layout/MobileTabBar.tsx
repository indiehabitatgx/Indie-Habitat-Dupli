"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { Building2, House, Menu, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { OPEN_MENU_EVENT } from "@/components/layout/MobileNavigation";

export const OPEN_ASSISTANT_EVENT = "habitat:open-assistant";

const tabs = [
  { href: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  { href: "/events", label: "Events", icon: Ticket, match: (p: string) => p.startsWith("/events") },
  { href: "#ask", label: "Ask", icon: null, match: () => false },
  { href: "/venue", label: "Venue", icon: Building2, match: (p: string) => p.startsWith("/venue") || p.startsWith("/corporate") },
  { href: "#menu", label: "Menu", icon: Menu, match: () => false },
] as const;

/** App-style bottom navigation for phones and tablets (hidden on desktop). */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-[55] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <LayoutGroup id="tabbar">
        <ul className="liquid-glass liquid-glass-dark mx-auto grid h-16 max-w-md grid-cols-5 items-center rounded-[1.75rem] px-1.5">
          {tabs.map((t) => {
            const active = t.match(pathname);

            if (t.href === "#ask") {
              return (
                <li key={t.label} className="flex justify-center">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    onClick={() => window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT))}
                    className="flex flex-col items-center gap-0.5"
                    aria-label="Ask the Habitat assistant"
                  >
                    <span className="relative -mt-6 grid size-13 place-items-center rounded-full bg-amber text-amber-ink shadow-[0_10px_30px_-6px_rgba(252,178,50,0.7)] ring-4 ring-bg">
                    <span
                      className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(252,178,50,0.9),transparent_40%)] opacity-70 animate-[orbit_3s_linear_infinite] motion-reduce:hidden"
                      aria-hidden
                    />
                    <span className="relative grid size-13 place-items-center rounded-full bg-amber">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/brand/habitat-mark-w.png" alt="" width={192} height={192} className="size-7 invert" />
                    </span>
                    </span>
                    <span className="text-[0.62rem] font-semibold tracking-wide text-amber">Ask</span>
                  </motion.button>
                </li>
              );
            }

            const Icon = t.icon!;
            const inner = (
              <>
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-x-1.5 inset-y-1.5 rounded-2xl bg-amber/15 ring-1 ring-amber/40"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden
                  />
                )}
                <motion.span
                  className="relative"
                  animate={active ? { y: -1, scale: 1.08 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                >
                  <Icon className={cn("size-5 transition-colors", active ? "text-amber" : "text-fg/75")} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                </motion.span>
                <span className={cn("relative text-[0.62rem] font-semibold tracking-wide transition-colors", active ? "text-amber" : "text-fg/70")}>{t.label}</span>
              </>
            );
            const cls = "relative flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-2xl";

            return (
              <li key={t.label}>
                {t.href === "#menu" ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
                    className={cls}
                    aria-label="Open menu"
                  >
                    {inner}
                  </motion.button>
                ) : (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Link href={t.href} className={cls} aria-current={active ? "page" : undefined}>
                      {inner}
                    </Link>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}

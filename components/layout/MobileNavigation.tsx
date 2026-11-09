"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const OPEN_MENU_EVENT = "habitat:open-menu";

export function MobileNavigation({ items, showTrigger = true }: { items: readonly { href: string; label: string }[]; showTrigger?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The mobile tab bar's "Menu" tab opens this dialog.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MENU_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MENU_EVENT, onOpen);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <Dialog.Trigger asChild>
          <button type="button" className="grid size-12 place-items-center lg:hidden" aria-label="Open menu">
            <Menu className="size-6" aria-hidden />
          </button>
        </Dialog.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-bg"
                initial={{ clipPath: "circle(0% at calc(100% - 44px) calc(100% - 44px))" }}
                animate={{ clipPath: "circle(150% at calc(100% - 44px) calc(100% - 44px))" }}
                exit={{ clipPath: "circle(0% at calc(100% - 44px) calc(100% - 44px))" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <span className="eyebrow">#menu</span>
                  <Dialog.Close asChild>
                    <button type="button" className="grid size-12 place-items-center" aria-label="Close menu">
                      <X className="size-6" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile" className="container-x flex-1 py-6">
                  <ul className="flex flex-col">
                    {[{ href: "/", label: "Home" }, ...items].map((item, i) => {
                      const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="border-b border-line"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-14 items-center justify-between font-display text-[clamp(1.375rem,6vw,1.875rem)] font-extrabold uppercase tracking-tight",
                              active && "text-amber",
                            )}
                          >
                            {item.label}
                            <span className="font-sans text-sm font-normal text-muted">0{i + 1}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="container-x flex flex-col gap-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
                  <a
                    href={site.ticketing.bookmyshow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 items-center justify-center gap-2 bg-amber font-display text-sm font-bold uppercase tracking-[0.16em] text-amber-ink"
                  >
                    Book tickets on BookMyShow <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                  <a href={site.phoneHref} className="text-center text-muted">
                    {site.phone}
                  </a>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

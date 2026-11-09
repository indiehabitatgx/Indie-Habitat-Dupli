"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Image as ImageIcon, Inbox, LayoutDashboard, Mail, Mic2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/artists", label: "Artists", icon: Mic2 },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ badge }: { badge: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-[2px] px-3 text-sm font-semibold transition",
                  active ? "bg-amber text-amber-ink" : "text-fg/80 hover:bg-white/5 hover:text-fg",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                {label === "Enquiries" && badge > 0 && (
                  <span className={cn("ml-auto rounded-full px-2 text-xs", active ? "bg-black/20" : "bg-amber text-amber-ink")}>{badge}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

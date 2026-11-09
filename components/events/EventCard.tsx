import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { EventCardData } from "@/types/event";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate, formatDays, formatPrice } from "@/lib/utils";

export function EventCard({
  event,
  priority,
  index,
  className,
}: {
  event: EventCardData;
  priority?: boolean;
  index?: number;
  className?: string;
}) {
  const price = formatPrice(event.ticketPrice);
  const when = event.recurrence === "WEEKLY" ? formatDays(event.scheduleDays) : formatDate(event.startDate);
  return (
    <article className={cn("group relative flex h-full flex-col transition-transform duration-500 ease-out-expo hover:-translate-y-1.5", className)}>
      <div className="relative aspect-[1/1.414] overflow-hidden bg-surface">
        {event.image ? (
          <Image
            src={event.image}
            alt={`${event.title} poster`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, (min-width: 640px) 50vw, 66vw"
            className="object-cover transition duration-[1.2s] ease-out-expo group-hover:scale-[1.06] group-focus-within:scale-[1.06]"
          />
        ) : (
          <div className="grid size-full place-items-center font-display text-3xl font-black uppercase text-white/10">{event.title}</div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-hidden
        />
        <div className="absolute left-2 top-2 flex gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
          <Badge tone="amber" className="px-1.5 py-0.5 text-[0.55rem] sm:px-2 sm:py-1 sm:text-[0.65rem]">{event.category.name}</Badge>
          {event.recurrence === "WEEKLY" && (
            <Badge tone="muted" className="hidden bg-black/60 backdrop-blur sm:inline-flex">
              Weekly
            </Badge>
          )}
        </div>
        {typeof index === "number" && (
          <span className="absolute right-2 top-1.5 font-display text-xs font-black text-white/80 drop-shadow sm:right-3 sm:top-2 sm:text-sm" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <p className="absolute inset-x-0 bottom-0 hidden translate-y-4 p-5 text-[0.95rem] sm:block leading-snug text-white opacity-0 transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {event.shortDescription}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 border-x border-b border-line p-3 sm:gap-3 sm:p-5">
        <h3 className="line-clamp-2 font-display text-[0.85rem] font-extrabold uppercase leading-tight sm:text-xl">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {event.title}
          </Link>
        </h3>
        <dl className="mt-auto grid gap-1.5 text-xs text-muted sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <dt className="sr-only">Days</dt>
            <CalendarDays className="size-3.5 shrink-0 text-amber sm:size-4" aria-hidden />
            <dd className="truncate">{when}</dd>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <dt className="sr-only">Schedule</dt>
            <Clock className="size-4 text-amber" aria-hidden />
            <dd>{event.scheduleText}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-line pt-2 sm:pt-3">
          <span className="font-display text-xs font-bold sm:text-sm">
            {price ? (
              <>
                <span className="hidden text-muted sm:inline">from </span>
                {price}
              </>
            ) : (
              <span className="text-muted">Price on request</span>
            )}
          </span>
          <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-amber transition-transform duration-500 group-hover:translate-x-1">
            <span className="hidden sm:inline">Details </span>→
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition group-hover:ring-amber/60" aria-hidden />
    </article>
  );
}

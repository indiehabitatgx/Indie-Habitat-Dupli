import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteEvent } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ui";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { EventForm } from "@/app/admin/(panel)/events/EventForm";

export const metadata = { title: "Edit event" };

/** Formats a Date for <input type="datetime-local"> in IST. */
function toLocalInput(d: Date | null) {
  if (!d) return "";
  const ist = new Date(d.getTime() + 5.5 * 3600_000);
  return ist.toISOString().slice(0, 16);
}

export default async function EditEvent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const [event, categories, venues] = await Promise.all([
    db.event.findUnique({ where: { id } }),
    db.eventCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.venue.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!event) notFound();

  return (
    <>
      <PageTitle
        title={event.title}
        action={
          <div className="flex items-center gap-4">
            {event.status === "PUBLISHED" && (
              <Link href={`/events/${event.slug}`} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-amber">
                <ExternalLink className="size-4" aria-hidden /> View live
              </Link>
            )}
            {session.role === "ADMIN" && (
              <ConfirmButton action={deleteEvent.bind(null, event.id)} message={`Delete “${event.title}”? This cannot be undone.`}>
                <Trash2 className="size-4" aria-hidden /> Delete
              </ConfirmButton>
            )}
          </div>
        }
      />
      <EventForm
        categories={categories}
        venues={venues}
        notice={created ? "Event created." : undefined}
        values={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          shortDescription: event.shortDescription,
          description: event.description,
          categoryId: event.categoryId,
          venueId: event.venueId ?? "",
          recurrence: event.recurrence,
          scheduleDays: event.scheduleDays,
          scheduleText: event.scheduleText,
          startDate: toLocalInput(event.startDate),
          endDate: toLocalInput(event.endDate),
          startTime: event.startTime ?? "",
          ticketPrice: event.ticketPrice?.toString() ?? "",
          priceNote: event.priceNote ?? "",
          bookingUrl: event.bookingUrl ?? "",
          bookingProvider: event.bookingProvider ?? "",
          terms: event.terms ?? "",
          bannerImage: event.bannerImage,
          status: event.status,
          featured: event.featured,
          sortOrder: event.sortOrder,
          seoTitle: event.seoTitle ?? "",
          seoDescription: event.seoDescription ?? "",
        }}
      />
    </>
  );
}

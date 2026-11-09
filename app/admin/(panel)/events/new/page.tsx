import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageTitle } from "@/app/admin/(panel)/PageTitle";
import { EventForm } from "@/app/admin/(panel)/events/EventForm";

export const metadata = { title: "New event" };

export default async function NewEvent() {
  await requireAdmin();
  const [categories, venues] = await Promise.all([
    db.eventCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.venue.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <>
      <PageTitle title="New event" description="Only add verified details — dates, prices and line-ups should match the ticketing page." />
      <EventForm
        categories={categories}
        venues={venues}
        values={{
          id: null,
          title: "",
          slug: "",
          shortDescription: "",
          description: "",
          categoryId: "",
          venueId: "",
          recurrence: "WEEKLY",
          scheduleDays: [],
          scheduleText: "",
          startDate: "",
          endDate: "",
          startTime: "",
          ticketPrice: "",
          priceNote: "",
          bookingUrl: "",
          bookingProvider: "BookMyShow",
          terms: "",
          bannerImage: null,
          status: "DRAFT",
          featured: false,
          sortOrder: 0,
          seoTitle: "",
          seoDescription: "",
        }}
      />
    </>
  );
}

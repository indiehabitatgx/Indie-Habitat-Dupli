import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";
import { getEventBySlug, getPublishedEventSlugs } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const alt = "Show at The Habitat, Mumbai";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export async function generateStaticParams() {
  try {
    return (await getPublishedEventSlugs()).map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEventBySlug((await params).slug);
  if (!event) {
    return ogCard({ eyebrow: "#gigs", title: "What's on at The Habitat", subtitle: "Stand-up comedy, music and poetry in Khar, Mumbai." });
  }
  const price = formatPrice(event.ticketPrice);
  // Uploaded posters live outside /public; fall back to the stage photo for those.
  const poster = event.bannerImage?.startsWith("/images/") ? event.bannerImage : undefined;
  return ogCard({
    eyebrow: `${event.category.name} · Weekly show`,
    title: event.title,
    subtitle: event.shortDescription,
    poster,
    chips: [price ? `From ${price}` : "Tickets on BookMyShow", event.scheduleText],
  });
}

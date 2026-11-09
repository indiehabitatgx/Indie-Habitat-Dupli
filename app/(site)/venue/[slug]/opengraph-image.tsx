import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";
import { getVenue, venues } from "@/lib/venues";

export const alt = "A room at The Habitat, Mumbai";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const venue = getVenue((await params).slug);
  if (!venue) return ogCard({ eyebrow: "#thevenue", title: "The venue", subtitle: "Three rooms in Khar West, Mumbai." });
  return ogCard({
    eyebrow: `${venue.hashtag} · ${venue.kicker}`,
    title: venue.name,
    subtitle: venue.summary,
    photo: venue.image,
    chips: venue.facts.slice(0, 2).map((f) => `${f.label}: ${f.value}`),
  });
}

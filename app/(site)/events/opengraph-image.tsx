import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "What's on at The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "#gigs · What's on",
    title: "This week at The Habitat",
    subtitle: "Stand-up comedy, midnight shows, Comedy Roulette, Mass Bunk and open mics. Tickets on BookMyShow.",
    photo: "/images/gallery/audience.webp",
  });
}

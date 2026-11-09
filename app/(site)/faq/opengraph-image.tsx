import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "FAQ — The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "#faq",
    title: "Good questions.",
    subtitle: "Tickets, 18+ entry, seating, timings, refunds and booking the space.",
    photo: "/images/hero/stage-bw-hd.webp",
  });
}

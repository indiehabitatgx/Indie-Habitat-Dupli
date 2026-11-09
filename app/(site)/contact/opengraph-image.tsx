import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "Contact The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "#contact",
    title: "Say hello.",
    subtitle: "3rd Road, Khar West, Mumbai · Open 12pm to 12am · +91 98333 58492",
    photo: "/images/venue/terrace.webp",
  });
}

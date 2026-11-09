import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "Private and corporate events at The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "#banquets & #conferences",
    title: "Your event, our stage.",
    subtitle: "Conferences, offsites, cocktail functions and celebrations in Khar West — with F&B packages.",
    photo: "/images/gallery/stage-decor.webp",
  });
}

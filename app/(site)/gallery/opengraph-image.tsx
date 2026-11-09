import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "Gallery — The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export default function Image() {
  return ogCard({
    eyebrow: "#momentsathabitat",
    title: "The gallery",
    subtitle: "Stages, crowds, celebrations and the jam room.",
    photo: "/images/venue/the-habitat-stage.webp",
  });
}

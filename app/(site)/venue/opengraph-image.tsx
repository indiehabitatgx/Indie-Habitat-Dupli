import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "The venue — The Habitat, Mumbai";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export default function Image() {
  return ogCard({
    eyebrow: "#thevenue",
    title: "Three rooms. One habitat.",
    subtitle: "The Habitat, Above The Habitat and the Jam Room — stages, gear and recording crews you can book.",
    photo: "/images/venue/above-the-habitat-stage.webp",
  });
}

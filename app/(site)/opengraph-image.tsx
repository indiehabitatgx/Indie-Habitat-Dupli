import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "The Habitat — Comedy and Music Cafe, Khar, Mumbai";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export default function Image() {
  return ogCard({
    eyebrow: "Comedy and Music Cafe",
    title: "Stand-up, music & poetry.",
    subtitle: "An intimate 55–70 seater, a 250-capacity hall upstairs, and the stage behind the specials.",
    photo: "/images/hero/stage-bw-hd.webp",
  });
}

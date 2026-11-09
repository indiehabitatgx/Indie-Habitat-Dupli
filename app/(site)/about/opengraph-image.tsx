import { OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "About The Habitat";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const revalidate = 3600; // keep in step with OG_REVALIDATE

export default function Image() {
  return ogCard({
    eyebrow: "#about",
    title: "A habitat for the indie.",
    subtitle: "Stand-up, improv, storytelling, intimate gigs and poetry — recorded live, more often than not.",
    photo: "/images/hero/stage-bw-hd.webp",
  });
}

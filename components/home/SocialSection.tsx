import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { SocialIcon } from "@/components/layout/SocialLinks";
import { TextReveal } from "@/components/motion/TextReveal";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { InstagramPostCard, type PostCardData } from "@/components/home/InstagramPostCard";
import type { InstagramPost } from "@/lib/instagram";

/**
 * Live feed from the official Instagram API when a token is configured (Admin → Settings).
 * Otherwise shows the venue's own photos as cards linking to the profile — without invented captions, dates or likes.
 */
const fallback: PostCardData[] = [
  { id: "f1", href: site.social.instagram, image: "/images/venue/the-habitat-stage.webp", alt: "The Habitat stage with the circled-H logo", caption: "", mediaType: "IMAGE" },
  { id: "f2", href: site.social.instagram, image: "/images/events/comedy-roulette.webp", alt: "Comedy Roulette poster", caption: "", mediaType: "IMAGE" },
  { id: "f3", href: site.social.instagram, image: "/images/gallery/audience.webp", alt: "Audience laughing at a show", caption: "", mediaType: "IMAGE" },
  { id: "f4", href: site.social.instagram, image: "/images/venue/above-the-habitat-stage.webp", alt: "Above The Habitat stage", caption: "", mediaType: "IMAGE" },
];

export function SocialSection({ posts }: { posts: InstagramPost[] }) {
  const live = posts.length > 0;
  const cards: PostCardData[] = live
    ? posts.map((p) => ({
        id: p.id,
        href: p.permalink,
        image: p.image,
        alt: p.caption ? p.caption.slice(0, 120) : "Instagram post by @indiehabitat",
        caption: p.caption,
        mediaType: p.mediaType,
        timestamp: p.timestamp,
        remote: true,
      }))
    : fallback;

  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="social-heading">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2">
              #indiehabitat
              {live && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2 py-0.5 text-[0.6rem] tracking-[0.14em] text-amber ring-1 ring-amber/40">
                  <span className="size-1.5 animate-pulse rounded-full bg-amber" aria-hidden /> live
                </span>
              )}
            </p>
            <TextReveal id="social-heading" className="display-md" text="Line-ups drop on Instagram first." accent={["Instagram"]} />
          </div>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-3 border border-line px-5 font-display text-xs font-bold uppercase tracking-[0.16em] transition hover:border-amber hover:text-amber"
          >
            <SocialIcon name="instagram" /> Follow @indiehabitat <ArrowUpRight className="size-4" aria-hidden />
            <span className="sr-only">(opens Instagram in a new tab)</span>
          </a>
        </div>
        <Stagger as="ul" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StaggerItem as="li" key={c.id}>
              <InstagramPostCard post={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

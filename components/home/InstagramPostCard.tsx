import Image from "next/image";
import { Film, Images } from "lucide-react";
import { SocialIcon } from "@/components/layout/SocialLinks";
import { formatPostAge, type InstagramMediaType } from "@/lib/instagram";

export type PostCardData = {
  id: string;
  href: string;
  image: string;
  alt: string;
  caption: string;
  mediaType: InstagramMediaType;
  timestamp?: string;
  /** Remote Instagram CDN image (proxied through next/image) vs a local venue photo */
  remote?: boolean;
};

export function InstagramPostCard({ post }: { post: PostCardData }) {
  const age = post.timestamp ? formatPostAge(post.timestamp) : "";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-line bg-surface transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-amber/50">
      <header className="flex items-center gap-3 px-3.5 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bg ring-1 ring-amber/60">
          <Image src="/images/brand/habitat-mark-w.png" alt="" width={20} height={20} className="size-5" unoptimized />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold">indiehabitat</span>
          <span className="block truncate text-xs text-muted">The Habitat, Mumbai</span>
        </span>
        <SocialIcon name="instagram" className="size-4 text-muted transition-colors group-hover:text-amber" />
      </header>

      <div className="relative aspect-square overflow-hidden bg-bg">
        <Image
          src={post.image}
          alt={post.alt}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
        />
        {post.mediaType !== "IMAGE" && (
          <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-black/60 backdrop-blur" aria-label={post.mediaType === "VIDEO" ? "Video" : "Carousel"}>
            {post.mediaType === "VIDEO" ? <Film className="size-3.5" aria-hidden /> : <Images className="size-3.5" aria-hidden />}
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden>
          <span className="flex items-center gap-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white">
            <SocialIcon name="instagram" className="size-4" /> View on Instagram
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
        {post.caption ? (
          <p className="line-clamp-2 text-sm leading-snug text-fg/80">
            <span className="font-semibold text-fg">indiehabitat</span> {post.caption}
          </p>
        ) : (
          <p className="line-clamp-2 text-sm leading-snug text-muted">{post.alt}</p>
        )}
        {age ? (
          <time dateTime={post.timestamp} className="mt-auto text-[0.7rem] uppercase tracking-wider text-muted">
            {age}
          </time>
        ) : (
          <span className="mt-auto text-[0.7rem] uppercase tracking-wider text-muted">Venue photo · see more on Instagram</span>
        )}
      </div>

      <a href={post.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 focus-visible:outline-offset-[-3px]">
        <span className="sr-only">{post.caption ? `Instagram post: ${post.caption.slice(0, 80)}` : `${post.alt} — open @indiehabitat on Instagram`} (opens in a new tab)</span>
      </a>
    </article>
  );
}

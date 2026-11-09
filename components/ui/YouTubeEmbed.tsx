"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Click-to-load YouTube facade: no third-party JS or cookies until the visitor presses play.
 * Uses youtube-nocookie.com and a locally hosted poster image.
 */
export function YouTubeEmbed({ id, title, poster, className }: { id: string; title: string; poster: string; className?: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-surface", className)}>
      {active ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover grayscale transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
          <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber text-amber-ink transition-transform duration-500 ease-out-expo group-hover:scale-110">
            <Play className="ml-1 size-7 fill-current" aria-hidden />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-left font-display text-sm font-bold uppercase tracking-wider text-white">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}

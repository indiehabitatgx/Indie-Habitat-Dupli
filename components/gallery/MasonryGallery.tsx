"use client";

import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { GalleryItem } from "@/components/gallery/types";
import { EmptyState } from "@/components/ui/EmptyState";

export function MasonryGallery({ items, showFilters = true }: { items: GalleryItem[]; showFilters?: boolean }) {
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState<number | null>(null);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const shown = useMemo(() => (category === "All" ? items : items.filter((i) => i.category === category)), [items, category]);

  if (items.length === 0) {
    return <EmptyState title="Gallery coming soon">Photos added in the admin panel will appear here.</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-8">
      {showFilters && categories.length > 1 && <GalleryFilters categories={categories} active={category} onChange={setCategory} />}
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {shown.map((item, i) => (
          <li key={item.id} className="animate-fade-up break-inside-avoid" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden bg-surface text-left"
              aria-label={`${item.mediaType === "VIDEO" ? "Play video" : "Open image"}: ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full grayscale-[0.85] transition duration-700 ease-out-expo group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:grayscale-0"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" aria-hidden />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <span>
                  <span className="eyebrow block !text-[0.65rem]">#{item.category.toLowerCase()}</span>
                  <span className="font-display text-sm font-bold uppercase text-white">{item.title}</span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber text-amber-ink transition duration-500 group-hover:rotate-90">
                  {item.mediaType === "VIDEO" ? <Play className="ml-0.5 size-4 fill-current" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={shown} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </div>
  );
}

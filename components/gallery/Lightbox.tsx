"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import type { GalleryItem } from "@/components/gallery/types";

export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: GalleryItem[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndexChange((index + dir + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[101] flex flex-col outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between gap-4 p-3 md:p-5">
            <Dialog.Title className="truncate font-display text-sm font-bold uppercase tracking-[0.14em]">
              {item?.title}
            </Dialog.Title>
            <div className="flex items-center gap-4">
              <span className="text-sm tabular-nums text-muted" aria-live="polite">
                {index !== null ? index + 1 : 0} / {count}
              </span>
              <Dialog.Close className="grid size-12 place-items-center rounded-full border border-line hover:border-amber hover:text-amber" aria-label="Close">
                <X className="size-5" aria-hidden />
              </Dialog.Close>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2 pb-6 md:px-20">
            <AnimatePresence mode="wait" initial={false}>
              {item && (
                <motion.div
                  key={item.id}
                  className="relative flex h-full w-full items-center justify-center"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  drag={item.mediaType === "IMAGE" ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                >
                  {item.mediaType === "VIDEO" && item.videoId ? (
                    <div className="aspect-video w-full max-w-6xl">
                      <iframe
                        className="size-full"
                        src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative h-full max-h-[80svh] w-full">
                      <Image src={item.src} alt={item.alt} fill sizes="100vw" quality={85} className="object-contain" draggable={false} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 ring-1 ring-line hover:text-amber hover:ring-amber md:left-5"
                  aria-label="Previous"
                >
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 ring-1 ring-line hover:text-amber hover:ring-amber md:right-5"
                  aria-label="Next"
                >
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </>
            )}
          </div>
          {item && <p className="px-4 pb-5 text-center text-sm text-muted">{item.alt}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

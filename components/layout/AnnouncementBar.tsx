"use client";

import { Info, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const KEY = "habitat-announcement-dismissed";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function readDismissed() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function AnnouncementBar({ text, live }: { text: string; live?: boolean }) {
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => null);
  const [hidden, setHidden] = useState(false);

  if (hidden || dismissed === text) return null;

  return (
    <div className="relative z-[60] bg-amber text-amber-ink" role="region" aria-label="Announcement" data-live={live ? "true" : undefined}>
      <div className="container-x flex min-h-9 items-center justify-center gap-3 py-1.5 pr-12 text-center text-[0.7rem] font-semibold leading-snug sm:text-[0.8rem] md:min-h-10 md:text-sm">
        <Info className="hidden size-4 shrink-0 sm:block" aria-hidden />
        <p>{text}</p>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem(KEY, text);
            } catch {}
          }}
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full hover:bg-black/10"
          aria-label="Dismiss announcement"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

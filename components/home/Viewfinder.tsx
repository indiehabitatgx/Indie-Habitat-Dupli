"use client";

import { useEffect, useState } from "react";

/** Camera-viewfinder overlay: corner brackets, blinking REC light and a running timecode. Decorative. */
export function Viewfinder({ label = "Live taping" }: { label?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = Date.now();
    const id = setInterval(() => setT(Math.floor((Date.now() - start) / 40)), 40); // 25 fps frames
    return () => clearInterval(id);
  }, []);
  const frames = t % 25;
  const secs = Math.floor(t / 25);
  const tc = [Math.floor(secs / 3600), Math.floor(secs / 60) % 60, secs % 60, frames].map((n) => String(n).padStart(2, "0")).join(":");

  return (
    <div className="pointer-events-none absolute inset-0 select-none font-display text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white" aria-hidden>
      {/* corner brackets */}
      {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((c) => (
        <span key={c} className={`absolute size-6 border-white/80 ${c}`} />
      ))}
      <span className="absolute left-6 top-6 flex items-center gap-2 rounded-sm bg-black/50 px-2 py-1 backdrop-blur">
        <span className="size-2 animate-[rec_1.2s_steps(1)_infinite] rounded-full bg-[#ff3b30] motion-reduce:animate-none" />
        REC
      </span>
      <span className="absolute right-6 top-6 rounded-sm bg-black/50 px-2 py-1 tabular-nums backdrop-blur">{tc}</span>
      <span className="absolute bottom-6 left-6 rounded-sm bg-black/50 px-2 py-1 backdrop-blur">{label}</span>
      <span className="absolute bottom-6 right-6 hidden rounded-sm bg-black/50 px-2 py-1 backdrop-blur sm:block">Canon 80D · 32-ch</span>
      {/* centre crosshair */}
      <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white/50" />
      <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-white/50" />
    </div>
  );
}

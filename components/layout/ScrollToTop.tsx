"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

const R = 22;
const C = 2 * Math.PI * R;

/** Floating "back to top" button with a ring that fills as you scroll (echoes the circled H). */
export function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 600));
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          }}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          aria-label="Scroll to top"
          className="group fixed bottom-[calc(var(--tabbar-h)+0.75rem)] left-4 z-50 grid place-items-center rounded-full bg-bg/90 text-fg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur size-12 lg:bottom-8 lg:left-8 lg:size-14 [body:has([data-sticky-bar])_&]:bottom-[calc(var(--tabbar-h)+5.25rem)] [body:has([data-sticky-bar])_&]:lg:bottom-8"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r={R} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="2" />
            <circle
              cx="28"
              cy="28"
              r={R}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
            />
          </svg>
          <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-amber" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

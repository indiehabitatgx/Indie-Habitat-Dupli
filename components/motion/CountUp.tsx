"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts every number inside `value` up from 0 as it approaches the viewport (e.g. "55–75", "12–12").
 * Server render, no-JS and reduced-motion all show the final value; the animation writes straight to the DOM.
 */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  // Start slightly before it's visible so the count is seen from 0.
  const inView = useInView(outer, { once: true, margin: "0px 0px 10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !inner.current) return;
    const el = inner.current;
    const controls = animate(0, 1, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (p) => {
        el.textContent = value.replace(/\d+/g, (n) => String(Math.round(Number(n) * p)));
      },
    });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, reduce, value, duration]);

  return (
    <span ref={outer} className={className}>
      <span className="sr-only">{value}</span>
      <span ref={inner} aria-hidden>
        {value}
      </span>
    </span>
  );
}

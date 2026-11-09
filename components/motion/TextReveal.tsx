"use client";

import { motion } from "motion/react";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Word-by-word rise for headings. Text stays in the DOM as real words for SEO and screen readers;
 * each word is clipped and slides up when the heading scrolls into view.
 */
export function TextReveal({
  text,
  as = "h2",
  className,
  id,
  delay = 0,
  accent,
}: {
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
  delay?: number;
  /** words (case-insensitive) to tint amber */
  accent?: string[];
}) {
  const Comp = motion[as];
  const words = text.split(" ");
  const hl = new Set((accent ?? []).map((w) => w.toLowerCase()));
  return (
    <Comp
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-top" aria-hidden>
          <motion.span
            className={`inline-block ${hl.has(w.replace(/[^\w-]/g, "").toLowerCase()) ? "text-amber" : ""}`}
            variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } } }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Comp>
  );
}

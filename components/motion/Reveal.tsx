"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Scroll-triggered fade/translate. Content is fully visible without JS-driven animation
 * when the user prefers reduced motion (MotionConfig reducedMotion="user" in MotionProvider).
 */
export function Reveal({
  delay = 0,
  y = 28,
  className,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  className,
  children,
  stagger = 0.08,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : as === "dl" ? motion.dl : motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const } },
};

export function StaggerItem({
  className,
  children,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li" | "article";
}) {
  const Comp = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <Comp className={className} variants={staggerItem}>
      {children}
    </Comp>
  );
}

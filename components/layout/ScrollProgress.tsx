"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin amber reading-progress line pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-amber" style={{ scaleX }} />;
}

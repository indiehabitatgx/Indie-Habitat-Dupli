"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

// Module-level flag: false during SSR and the first hydration, true after.
// The first page load therefore renders fully visible (good for LCP); later client navigations fade in.
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

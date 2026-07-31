"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a section with a subtle blur-to-clear entrance animation
 * that plays when the section scrolls into view while scrolling DOWN.
 * Scrolling back UP shows the section crisp — no blur.
 */
export default function BlurReveal({ children, className }: BlurRevealProps) {
  return (
    <motion.div
      initial={{ filter: "blur(6px)", opacity: 0.7 }}
      whileInView={{ filter: "blur(0px)", opacity: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

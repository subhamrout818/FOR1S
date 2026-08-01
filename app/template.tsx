"use client";

import { motion } from "framer-motion";

/**
 * Remounts on every client-side navigation, giving each route a brief
 * cinematic fade-in. Kept to opacity only so it never fights Lenis scroll
 * or the GSAP pin sections.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

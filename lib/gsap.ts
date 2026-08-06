"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * SplitText is intentionally NOT registered here: it is only used by
 * SplitReveal, so it is imported on demand there to keep the ~40 KB plugin
 * out of routes that never split text (privacy, terms, auth, workspaces, …).
 * Import it from `gsap/SplitText` and register before use.
 */

/**
 * Components check this before wiring up parallax, pinning, or long
 * scroll-scrubbed transforms, and fall back to a simple fade instead.
 * Read once per effect (not reactively) since the OS setting rarely
 * changes mid-session.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

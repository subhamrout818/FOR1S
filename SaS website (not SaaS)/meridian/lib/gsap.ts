"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

/**
 * Components check this before wiring up parallax, pinning, or long
 * scroll-scrubbed transforms, and fall back to a simple fade instead.
 * Read once per effect (not reactively) since the OS setting rarely
 * changes mid-session.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

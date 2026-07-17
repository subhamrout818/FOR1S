"use client";

import { useRef, type MouseEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface UseMagneticOptions {
  /** How strongly the element is pulled toward the cursor, 0–1. */
  strength?: number;
  /** Spring stiffness — higher feels snappier, lower feels heavier. */
  stiffness?: number;
  damping?: number;
}

/**
 * Attaches to an element ref and returns spring-driven x/y motion values
 * that pull the element toward the cursor while it's within bounds, then
 * ease it back to rest. Disabled automatically on touch devices since
 * there's no persistent pointer to react to.
 */
export function useMagnetic({
  strength = 0.4,
  stiffness = 150,
  damping = 15,
}: UseMagneticOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping, mass: 0.2 });
  const y = useSpring(rawY, { stiffness, damping, mass: 0.2 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    rawX.set(relX * strength);
    rawY.set(relY * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, handleMouseMove, handleMouseLeave };
}

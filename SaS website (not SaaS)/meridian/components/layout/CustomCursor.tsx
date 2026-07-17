"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const DOT_SIZE = 7;
const RING_SIZE = 42;

type CursorVariant = "default" | "hover" | "view";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const dotSpringX = useSpring(dotX, { stiffness: 800, damping: 45, mass: 0.3 });
  const dotSpringY = useSpring(dotY, { stiffness: 800, damping: 45, mass: 0.3 });
  const ringSpringX = useSpring(ringX, { stiffness: 220, damping: 26, mass: 0.5 });
  const ringSpringY = useSpring(ringY, { stiffness: 220, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX - DOT_SIZE / 2);
      dotY.set(e.clientY - DOT_SIZE / 2);
      ringX.set(e.clientX - RING_SIZE / 2);
      ringY.set(e.clientY - RING_SIZE / 2);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor]"
      ) as HTMLElement | null;

      if (target) {
        setVariant((target.dataset.cursor as CursorVariant) || "hover");
        setLabel(target.dataset.cursorText ?? "");
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [dotX, dotY, ringX, ringY]);

  if (!enabled) return null;

  const ringScale = variant === "default" ? 1 : variant === "view" ? 2.4 : 1.7;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full bg-accent"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: dotSpringX,
          y: dotSpringY,
          opacity: variant === "default" ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border border-foreground/70"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          x: ringSpringX,
          y: ringSpringY,
          scale: ringScale,
          mixBlendMode: "difference",
        }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 24 } }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 / ringScale }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="whitespace-nowrap text-[9px] font-medium uppercase tracking-wideish text-foreground"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

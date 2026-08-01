"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type Lenis from "lenis";

/**
 * Right-edge scroll indicator that doubles as a scrubber: dragging the red
 * glowing line (or clicking anywhere on it) scrolls the page to that position.
 */
export default function ScrollSpine() {
  const scope = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
          if (dotRef.current) dotRef.current.style.top = `${p * 100}%`;
          if (percentRef.current)
            percentRef.current.textContent = String(
              Math.round(p * 100)
            ).padStart(2, "0");
          trackRef.current?.setAttribute(
            "aria-valuenow",
            String(Math.round(p * 100))
          );
        },
      });
    },
    { scope }
  );

  /** Scroll the page so `clientY` (within the track) maps to that progress. */
  const scrollToFraction = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = frac * max;

    const lenis = (window as typeof window & { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrollToFraction(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // only while the primary button is held
    scrollToFraction(e.clientY);
  };

  return (
    <div
      ref={scope}
      className="fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      <span className="pointer-events-none font-mono text-[10px] tracking-wideish text-muted">
        <span ref={percentRef} className="text-accent">
          00
        </span>
      </span>

      {/* Interactive scroll track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="Scroll position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        data-cursor="hover"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative flex h-44 w-10 cursor-ns-resize touch-none items-center justify-center"
      >
        <div className="h-full w-px bg-hairline" />
        <div
          ref={fillRef}
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-top bg-accent"
          style={{ transform: "scaleY(0)" }}
        />
        <div
          ref={dotRef}
          className="absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(230,57,70,0.7)]"
          style={{ top: "0%" }}
        />
      </div>

      <span className="pointer-events-none rotate-180 font-mono text-[9px] tracking-widest text-muted [writing-mode:vertical-lr]">
        FOR1S
      </span>
    </div>
  );
}

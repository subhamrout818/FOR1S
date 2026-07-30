"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { BRAND } from "@/lib/data";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = previousOverflow;
        setDone(true);
        window.dispatchEvent(new CustomEvent("FOR1S:loaded"));
      },
    });

    tl.to(counter, {
      value: 100,
      duration: reduced ? 0.5 : 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(
            Math.floor(counter.value)
          ).padStart(3, "0");
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${counter.value / 100})`;
        }
      },
    })
      .to(
        ".preloader-fade",
        { opacity: 0, y: -8, duration: 0.4, stagger: 0.05 },
        reduced ? "-=0.1" : "-=0.35"
      )
      .to(
        rootRef.current,
        {
          yPercent: -100,
          duration: reduced ? 0.4 : 1.05,
          ease: "expo.inOut",
        },
        reduced ? "+=0" : "+=0.1"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div className="preloader-fade flex flex-col items-center gap-6">
        <svg
          width="34"
          height="34"
          viewBox="0 0 64 64"
          fill="none"
          className="opacity-90"
        >
          <circle cx="32" cy="32" r="26" stroke="#FFFFFF" strokeWidth="1.5" />
          <path
            d="M32 6 C 20 20, 20 44, 32 58 C 44 44, 44 20, 32 6 Z"
            stroke="#E63946"
            strokeWidth="1.5"
          />
        </svg>

        <div className="flex items-baseline gap-1 font-mono text-fluid-lg text-foreground tabular-nums">
          <span ref={counterRef}>000</span>
          <span className="text-accent">%</span>
        </div>

        <p className="text-[11px] uppercase tracking-widest text-muted">
          {BRAND.name} — loading experience
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 h-px w-[min(320px,70vw)] -translate-x-1/2 overflow-hidden bg-hairline">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}

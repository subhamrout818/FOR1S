"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollSpine() {
  const scope = useRef<HTMLDivElement>(null);
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
            percentRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
        },
      });
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="pointer-events-none fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
      aria-hidden="true"
    >
      <span className="font-mono text-[10px] tracking-wideish text-muted">
        <span ref={percentRef} className="text-accent">00</span>
      </span>

      <div className="relative h-44 w-px bg-hairline">
        <div
          ref={fillRef}
          className="absolute left-0 top-0 h-full w-full origin-top bg-accent"
          style={{ transform: "scaleY(0)" }}
        />
        <div
          ref={dotRef}
          className="absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(230,57,70,0.7)]"
          style={{ top: "0%" }}
        />
      </div>

      <span className="rotate-180 font-mono text-[9px] tracking-widest text-muted [writing-mode:vertical-lr]">
        SAS
      </span>
    </div>
  );
}

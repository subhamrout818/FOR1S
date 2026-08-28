"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { BRAND } from "@/lib/data";
import Logo from "@/components/ui/Logo";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // The preloader is a first-load showcase for the home page only. Legal
    // pages, login, and the workspaces shouldn't be gated behind a black screen.
    if (pathname !== "/") return;

    const reduced = prefersReducedMotion();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fail-safe: no matter what happens with the animation, release the
    // overlay so the site can never be stranded behind a black screen.
    let finished = false;
    let fallback = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(fallback);
      document.body.style.overflow = previousOverflow;
      setDone(true);
      window.dispatchEvent(new CustomEvent("FOR1S:loaded"));
    };
    fallback = window.setTimeout(finish, 2200);

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finish,
    });

    tl.to(counter, {
      value: 100,
      duration: reduced ? 0.4 : 0.9,
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
        { opacity: 0, y: -8, duration: 0.35, stagger: 0.04 },
        reduced ? "-=0.1" : "-=0.25"
      )
      .to(
        rootRef.current,
        {
          yPercent: -100,
          duration: reduced ? 0.35 : 0.8,
          ease: "expo.inOut",
        },
        reduced ? "+=0" : "+=0.05"
      );

    return () => {
      tl.kill();
      clearTimeout(fallback);
      document.body.style.overflow = previousOverflow;
    };
  }, [pathname]);

  // Only the home page gets the preloader.
  if (pathname !== "/") return null;
  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div className="preloader-fade flex flex-col items-center gap-6">
        <Logo width={34} height={34} className="opacity-90" />

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

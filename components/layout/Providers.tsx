"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: reduceMotion ? 0.4 : 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    // Keep every ScrollTrigger in lockstep with Lenis' virtual scroll
    // position instead of the native scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Expose for components that need to trigger programmatic scrolling
    // (nav links, "scroll to next scene" cues) without prop-drilling.
    (window as typeof window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
      delete (window as typeof window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
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

  // Handle hash-based navigation from other pages
  // (e.g. clicking "Vision" in the navbar from /login navigates to /#vision)
  // Shows the hero section first, then smooth-scrolls to the target section
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // First, ensure we're at the top so the hero is visible
    window.scrollTo(0, 0);

    // Wait for the page to render and Lenis to initialize,
    // then smooth-scroll to the target section
    const timer = setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;

      const lenis = (
        window as typeof window & { __lenis?: Lenis }
      ).__lenis;

      if (lenis) {
        lenis.scrollTo(target as HTMLElement, {
          duration: 2,
          offset: -40,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

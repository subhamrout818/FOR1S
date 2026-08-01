"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

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
  // (e.g. clicking "Vision" in the navbar from /login navigates to /#vision).
  // Re-runs on every route change so client-side hash links get the smooth
  // Awwwards-style Lenis scroll instead of an instant jump. Lands at the top
  // (hero) first, then glides to the target section.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    const lenis = (
      window as typeof window & { __lenis?: Lenis }
    ).__lenis;

    // Ensure we're at the top so the hero is visible first
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    // Wait for the page to render + the template fade, then glide to the
    // target section with a long, eased scroll.
    const timer = setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target as HTMLElement, {
          duration: 1.8,
          offset: -40,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

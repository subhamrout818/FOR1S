"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type SplitType = "chars" | "words" | "lines";

interface SplitRevealProps {
  children: string;
  as?: React.ElementType;
  type?: SplitType;
  className?: string;
  delay?: number;
  /** "scroll" reveals when the element enters the viewport; "immediate" plays on mount (hero). */
  trigger?: "scroll" | "immediate";
  start?: string;
  stagger?: number;
  /**
   * When false, the text is split and hidden but the reveal does not run.
   * Flipping it to true re-runs the effect and plays the entrance — used by
   * the hero to hold the headline until the preloader lifts, while keeping the
   * text in the initial HTML (LCP).
   */
  play?: boolean;
}

export default function SplitReveal({
  children,
  as: Tag = "div",
  type = "words",
  className,
  delay = 0,
  trigger = "scroll",
  start = "top 82%",
  stagger = 0.035,
  play = true,
}: SplitRevealProps) {
  // Generic across tag types — the ref is only used for GSAP DOM queries.
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      if (prefersReducedMotion()) {
        gsap.set(ref.current, { opacity: 1 });
        return;
      }

      // Hide synchronously (before paint) so SSR'd text never flashes while
      // the async SplitText import below resolves.
      gsap.set(ref.current, { opacity: 0 });

      // SplitText is imported on demand so its chunk only ships to routes that
      // actually split text. Guard the async callback against a re-run or an
      // unmount landing before the import resolves.
      let disposed = false;
      let cleanup: (() => void) | undefined;

      import("gsap/SplitText").then(({ SplitText }) => {
        if (disposed || !ref.current) return;
        gsap.registerPlugin(SplitText);

        // Lines get their own overflow-hidden wrapper so the reveal reads as a
        // true masked wipe. Words/chars animate as simple rise + fade, which
        // stays premium-looking without needing a per-word mask wrapper.
        const split = new SplitText(ref.current, {
          type,
          linesClass: "overflow-hidden block",
        });

        const targets =
          type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;

        gsap.set(ref.current, { opacity: 1 });
        gsap.set(targets, { yPercent: 100, opacity: type === "lines" ? 1 : 0 });

        if (play) {
          const tween = {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            stagger,
            delay,
          };

          if (trigger === "scroll") {
            gsap.to(targets, {
              ...tween,
              scrollTrigger: { trigger: ref.current, start },
            });
          } else {
            gsap.to(targets, tween);
          }
        }

        cleanup = () => split.revert();
      });

      return () => {
        disposed = true;
        cleanup?.();
      };
    },
    { scope: ref, dependencies: [children, type, trigger, play] }
  );

  return (
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}

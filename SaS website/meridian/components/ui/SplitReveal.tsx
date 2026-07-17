"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
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

      // Lines get their own overflow-hidden wrapper so the reveal reads as a
      // true masked wipe. Words/chars animate as simple rise + fade, which
      // stays premium-looking without needing a per-word mask wrapper.
      const split = new SplitText(ref.current, {
        type,
        linesClass: "overflow-hidden block",
      });

      const targets =
        type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;

      gsap.set(targets, { yPercent: 100, opacity: type === "lines" ? 1 : 0 });

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

      return () => split.revert();
    },
    { scope: ref, dependencies: [children, type, trigger] }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}

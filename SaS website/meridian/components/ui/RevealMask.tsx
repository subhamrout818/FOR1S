"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealMaskProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  start?: string;
  as?: React.ElementType;
}

export default function RevealMask({
  children,
  className,
  delay = 0,
  y = 36,
  blur = true,
  start = "top 85%",
  as: Tag = "div",
}: RevealMaskProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      if (prefersReducedMotion()) {
        gsap.set(ref.current, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(ref.current, {
        opacity: 0,
        y,
        filter: blur ? "blur(14px)" : "blur(0px)",
      });

      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.3,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start },
      });
    },
    { scope: ref }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}

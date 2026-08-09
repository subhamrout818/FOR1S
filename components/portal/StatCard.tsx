"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import Reveal from "@/components/portal/Reveal";
import { cn } from "@/lib/utils";

/** Eased count-up that fires once the card scrolls into view. */
function useCountUp(target: number, start: boolean, duration = 1.4) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const from = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - from) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

/**
 * A portal stat tile in the same visual language as the dashboard overview:
 * cursor-spotlight GlowCard, staggered Reveal entrance, and an animated
 * count-up number. `format` lets money, counts and percentages share it.
 */
export default function StatCard({
  label,
  value,
  icon,
  format = (n: number) => String(n),
  accent = false,
  delay = 0,
  className,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
  format?: (n: number) => string;
  accent?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shown = useCountUp(value, inView);

  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <div ref={ref} className="h-full">
        <GlowCard className="flex h-full flex-col justify-between gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              {label}
            </p>
            {icon && (
              <span className={cn("shrink-0", accent ? "text-accent" : "text-muted")}>
                {icon}
              </span>
            )}
          </div>
          <p
            className={cn(
              "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
              accent && "text-accent"
            )}
          >
            {format(shown)}
          </p>
        </GlowCard>
      </div>
    </Reveal>
  );
}

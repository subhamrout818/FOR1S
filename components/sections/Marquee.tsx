"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: 50, suffix: "+", label: "Projects shipped", decimals: 0 },
  { value: 6, suffix: " wks", label: "Avg. MVP to launch", decimals: 0 },
  { value: 99.9, suffix: "%", label: "Uptime maintained", decimals: 1 },
  { value: 100, suffix: "%", label: "On-time milestones", decimals: 0 },
];

const TICKER = [
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "AWS",
  "Vercel",
  "GSAP",
  "Three.js",
  "Stripe",
  "Tailwind CSS",
  "Prisma",
  "React",
];

/* ------------------------------------------------------------------ */
/*  Count-up number                                                    */
/* ------------------------------------------------------------------ */

function CountUp({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Respect reduced motion — jump straight to the final value.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-surface/40">
      {/* Stats band */}
      <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12 lg:py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <p className="font-display text-4xl font-bold text-foreground lg:text-5xl">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </p>
              <p className="text-xs uppercase tracking-widest text-muted lg:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech ticker — the duplicated half is aria-hidden so screen readers
          don't announce each technology twice. */}
      <div className="border-t border-hairline py-5">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              aria-hidden={i >= TICKER.length}
              className="flex items-center gap-8 px-6 text-sm uppercase tracking-widest text-muted lg:px-8"
            >
              {item}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

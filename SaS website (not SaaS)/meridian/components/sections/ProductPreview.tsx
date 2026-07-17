"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { PREVIEW_TABS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProductPreview() {
  const [active, setActive] = useState<string>(PREVIEW_TABS[0].id);
  const activeTab = PREVIEW_TABS.find((t) => t.id === active) ?? PREVIEW_TABS[0];
  const activeIndex = PREVIEW_TABS.findIndex((t) => t.id === active);

  const panelRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section id="preview" className="relative overflow-hidden bg-surface py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionLabel scene="04" title="Preview" className="mb-6" />
        <SplitReveal
          as="h2"
          type="words"
          className="max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          Explore the machine.
        </SplitReveal>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-1 border-b border-hairline pb-px">
              {PREVIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  data-cursor="hover"
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "relative px-4 py-3 text-sm transition-colors duration-300",
                    active === tab.id
                      ? "text-foreground"
                      : "text-muted hover:text-foreground/80"
                  )}
                >
                  {tab.label}
                  {active === tab.id && (
                    <motion.span
                      layoutId="preview-tab-underline"
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pt-8"
              >
                <p className="max-w-md text-base leading-relaxed text-muted">
                  {activeTab.description}
                </p>
                <dl className="mt-8 flex flex-col gap-4">
                  {activeTab.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between border-b border-hairline pb-3"
                    >
                      <dt className="text-xs uppercase tracking-widest text-muted">
                        {spec.label}
                      </dt>
                      <dd className="font-mono text-sm text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>

          <RevealMask y={30}>
            <div
              ref={panelRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              data-cursor="view"
              data-cursor-text="Drag"
              style={{ perspective: 1200 }}
              className="relative aspect-[4/3] w-full"
            >
              <motion.div
                style={{
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm"
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="h-40 w-40 rounded-full bg-accent/25 blur-[60px]"
                    />
                  </AnimatePresence>
                </div>

                <svg
                  className="absolute inset-0 h-full w-full opacity-[0.14]"
                  viewBox="0 0 400 300"
                  aria-hidden="true"
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line
                      key={`v${i}`}
                      x1={i * 50}
                      y1={0}
                      x2={i * 50}
                      y2={300}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <line
                      key={`h${i}`}
                      x1={0}
                      y1={i * 50}
                      x2={400}
                      y2={i * 50}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                    <span>MRD-01</span>
                    <span className="text-accent">● live</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-display text-2xl font-semibold uppercase text-foreground">
                      {activeTab.label}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/40">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(PREVIEW_TABS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </RevealMask>
        </div>
      </div>
    </section>
  );
}

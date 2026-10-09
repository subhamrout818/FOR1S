"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Check } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { PREVIEW_TABS } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Per-step illustration shown inside the tilting card. These are      */
/*  generic "what you get" sketches — no client names or numbers.       */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

const DISCOVER_ITEMS = ["Kickoff call", "Competitor & keyword review", "Sitemap", "Copy plan"];
const LAUNCH_ITEMS = ["Domain connected", "Hosting live", "Submitted to Google", "Care plan active"];

const BUILD_ROWS = [
  { label: "Phone", pct: 100 },
  { label: "Speed", pct: 96 },
  { label: "SEO", pct: 100 },
  { label: "Forms", pct: 100 },
];

function Checklist({ items, reduce, live }: { items: string[]; reduce: boolean; live?: boolean }) {
  return (
    <ul className="flex w-full max-w-[21rem] flex-col gap-2.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={reduce ? false : { opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.15 + i * 0.12, ease: EASE }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground/90"
        >
          <motion.span
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, delay: reduce ? 0 : 0.45 + i * 0.12, ease: EASE }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white"
          >
            <Check size={12} strokeWidth={3} />
          </motion.span>
          {item}
        </motion.li>
      ))}
      {live && (
        <motion.li
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 + items.length * 0.12, ease: EASE }}
          className="mt-1 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Live
        </motion.li>
      )}
    </ul>
  );
}

function Wireframe({ reduce }: { reduce: boolean }) {
  const block = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, scaleY: 0.4 },
    animate: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay, ease: EASE },
  });
  return (
    <div className="flex w-full max-w-[21rem] flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <motion.div {...block(0.1)} className="flex h-3 items-center justify-between origin-top">
        <span className="h-2 w-10 rounded-sm bg-white/25" />
        <span className="flex gap-1.5">
          <span className="h-1.5 w-6 rounded-sm bg-white/15" />
          <span className="h-1.5 w-6 rounded-sm bg-white/15" />
          <span className="h-1.5 w-6 rounded-sm bg-white/15" />
        </span>
      </motion.div>
      <motion.div {...block(0.22)} className="origin-top rounded-lg bg-white/[0.07] p-3">
        <span className="block h-2.5 w-3/4 rounded-sm bg-white/30" />
        <span className="mt-2 block h-1.5 w-1/2 rounded-sm bg-white/15" />
        <span className="mt-3 block h-4 w-16 rounded-full bg-accent" />
      </motion.div>
      <div className="grid grid-cols-3 gap-2">
        {[0.34, 0.44, 0.54].map((d) => (
          <motion.div key={d} {...block(d)} className="origin-top rounded-lg bg-white/[0.07] p-2">
            <span className="block h-6 rounded-sm bg-white/10" />
            <span className="mt-1.5 block h-1.5 w-3/4 rounded-sm bg-white/20" />
          </motion.div>
        ))}
      </div>
      <motion.div {...block(0.66)} className="h-2 origin-top rounded-sm bg-white/10" />
    </div>
  );
}

function BuildChecks({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex w-full max-w-[21rem] flex-col gap-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        Tested before launch
      </p>
      {BUILD_ROWS.map((row, i) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-12 text-sm text-foreground/80">{row.label}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${row.pct}%` }}
              transition={{ duration: 0.9, delay: reduce ? 0 : 0.15 + i * 0.12, ease: EASE }}
              className="h-full rounded-full bg-accent"
            />
          </div>
          <Check size={14} className="text-accent" strokeWidth={3} />
        </div>
      ))}
    </div>
  );
}

function StepVisual({ id, reduce }: { id: string; reduce: boolean }) {
  if (id === "design") return <Wireframe reduce={reduce} />;
  if (id === "build") return <BuildChecks reduce={reduce} />;
  if (id === "launch") return <Checklist items={LAUNCH_ITEMS} reduce={reduce} live />;
  return <Checklist items={DISCOVER_ITEMS} reduce={reduce} />;
}

export default function ProductPreview() {
  const [active, setActive] = useState<string>(PREVIEW_TABS[0].id);
  const activeTab = PREVIEW_TABS.find((t) => t.id === active) ?? PREVIEW_TABS[0];
  const activeIndex = PREVIEW_TABS.findIndex((t) => t.id === active);

  const reduce = useReducedMotion() ?? false;
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
    <section id="preview" className="relative overflow-hidden bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <SectionLabel scene="04" title="Process" className="mb-6" />
        <SplitReveal
          as="h2"
          type="words"
          className="max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          How we build.
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
                    <span>Step {String(activeIndex + 1).padStart(2, "0")}</span>
                    <span className="text-foreground/40">What you get</span>
                  </div>
                  <div className="pointer-events-none flex flex-1 items-center justify-center py-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex w-full justify-center"
                      >
                        <StepVisual id={activeTab.id} reduce={reduce} />
                      </motion.div>
                    </AnimatePresence>
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

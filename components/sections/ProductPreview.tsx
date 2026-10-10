"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { PREVIEW_TABS } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Per-step artwork shown inside the tilting card. Each step is its    */
/*  own sketch of what you actually get — no client names or numbers.   */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

/** A loose "paper on a desk" sheet the artwork sits on (slightly off-square). */
function Sheet({ children, tag }: { children: React.ReactNode; tag: string }) {
  return (
    <div className="relative flex h-full w-full -rotate-[0.6deg] flex-col rounded-2xl border border-white/10 bg-[#0c0c0c] px-6 pb-6 pt-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/45">{tag}</p>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/* ---- 01 Discover: the sitemap we draw together ------------------------ */

function SitemapArt({ reduce }: { reduce: boolean }) {
  const draw = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: EASE },
  });
  const node = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay, ease: EASE },
  });
  const pages = [
    { x: 70, label: "Services" },
    { x: 210, label: "Our work" },
    { x: 350, label: "About" },
    { x: 490, label: "Contact" },
  ];
  return (
    <Sheet tag="Your sitemap — draft one">
      <div className="flex min-h-0 flex-1 flex-col">
        <svg viewBox="0 0 560 290" className="hidden min-h-0 w-full flex-1 sm:block" role="img" aria-label="A sitemap with a home page linking to services, work, about and contact pages">
          <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M280 62 V100" {...draw(0.2)} />
            <motion.path d="M70 100 H490" {...draw(0.4)} />
            {pages.map((pg, i) => (
              <motion.path key={pg.label} d={`M${pg.x} 100 V128`} {...draw(0.7 + i * 0.08)} />
            ))}
            <motion.path d="M70 166 V208" {...draw(1.1)} />
            <motion.path d="M490 166 V208" strokeDasharray="4 5" {...draw(1.2)} />
          </g>

          <motion.g {...node(0.05)}>
            <rect x="215" y="22" width="130" height="40" rx="10" fill="#AA1515" />
            <text x="280" y="48" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="600">Home</text>
          </motion.g>

          {pages.map((pg, i) => (
            <motion.g key={pg.label} {...node(0.9 + i * 0.08)}>
              <rect x={pg.x - 58} y="128" width="116" height="38" rx="9" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <text x={pg.x} y="152" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="15">{pg.label}</text>
            </motion.g>
          ))}

          <motion.g {...node(1.35)}>
            <rect x="12" y="208" width="116" height="36" rx="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <text x="70" y="231" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14">Pricing</text>
          </motion.g>
          <motion.g {...node(1.45)}>
            <rect x="432" y="208" width="116" height="36" rx="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 5" />
            <text x="490" y="231" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14">Booking</text>
          </motion.g>
        </svg>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:hidden">
          <motion.span
            {...node(0.1)}
            className="rounded-lg bg-accent px-6 py-2.5 text-base font-semibold text-white"
          >
            Home
          </motion.span>
          <span className="h-4 w-px bg-white/30" />
          <div className="grid w-full grid-cols-2 gap-3">
            {["Services", "Our work", "About", "Contact", "Pricing", "Booking"].map((label, i) => (
              <motion.span
                key={label}
                {...node(0.25 + i * 0.1)}
                className={`rounded-lg border px-3 py-2.5 text-center text-sm text-foreground/90 ${
                  label === "Booking" ? "border-dashed border-white/30" : "border-white/30 bg-white/[0.04]"
                }`}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </div>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.6, duration: 0.6 }}
          className="mt-4 shrink-0 text-sm leading-snug text-foreground/60 sm:mt-2"
        >
          Every page gets one job. Dashed pages are the maybes we talk through on the call.
        </motion.p>
      </div>
    </Sheet>
  );
}

/* ---- 02 Design: one page, with our reasoning in the margin ------------ */

function DesignArt({ reduce }: { reduce: boolean }) {
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: reduce ? 0 : delay, ease: EASE },
  });
  const notes = [
    { n: "1", text: "One clear action, so nobody has to hunt for how to book." },
    { n: "2", text: "Your own photos and your own words — never stock filler." },
    { n: "3", text: "Big enough to read with a thumb, on a bad connection." },
  ];
  return (
    <Sheet tag="Homepage — first look">
      <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-[1.25fr_1fr] sm:gap-6">
        <div className="relative flex min-h-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <motion.div {...rise(0.1)} className="flex items-center justify-between">
            <span className="h-3 w-16 rounded bg-white/35" />
            <span className="flex gap-2">
              <span className="h-2 w-9 rounded bg-white/15" />
              <span className="h-2 w-9 rounded bg-white/15" />
              <span className="h-2 w-9 rounded bg-white/15" />
            </span>
          </motion.div>
          <motion.div {...rise(0.25)} className="grid flex-[1.3] grid-cols-[1.2fr_1fr] gap-3">
            <div className="flex flex-col justify-center gap-2.5">
              <span className="h-4 w-11/12 rounded bg-white/55" />
              <span className="h-4 w-7/12 rounded bg-white/55" />
              <span className="mt-1 h-2 w-10/12 rounded bg-white/20" />
              <span className="h-2 w-8/12 rounded bg-white/20" />
              <span className="mt-2 h-7 w-28 rounded-full bg-accent" />
            </div>
            <div className="rounded-lg bg-gradient-to-br from-white/15 to-white/[0.04]" />
          </motion.div>
          <motion.div {...rise(0.45)} className="grid flex-1 grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-lg bg-white/[0.05] p-2">
                <span className="flex-1 rounded bg-white/10" />
                <span className="h-2 w-3/4 rounded bg-white/25" />
              </div>
            ))}
          </motion.div>

          {[
            { n: "1", cls: "left-[34%] top-[63%]", d: 0.9 },
            { n: "2", cls: "right-[7%] top-[32%]", d: 1.05 },
            { n: "3", cls: "left-[16%] bottom-[12%]", d: 1.2 },
          ].map((m) => (
            <motion.span
              key={m.n}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : m.d, duration: 0.4, ease: EASE }}
              className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background ${m.cls}`}
            >
              {m.n}
            </motion.span>
          ))}
        </div>

        <ul className="flex flex-col justify-center gap-5">
          {notes.map((note, i) => (
            <motion.li
              key={note.n}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduce ? 0 : 0.9 + i * 0.15, duration: 0.5, ease: EASE }}
              className="flex gap-3 text-[15px] leading-snug text-foreground/80"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background">
                {note.n}
              </span>
              {note.text}
            </motion.li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}

/* ---- 03 Build: the same page on three real screen sizes --------------- */

function Block({ className }: { className?: string }) {
  return <span className={`block rounded bg-white/15 ${className ?? ""}`} />;
}

function BuildArt({ reduce }: { reduce: boolean }) {
  const pop = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduce ? 0 : delay, ease: EASE },
  });
  return (
    <Sheet tag="Same page, three screens">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 items-end justify-center gap-5">
          {/* laptop */}
          <motion.div {...pop(0.15)} className="flex w-[52%] flex-col items-center">
            <div className="grid w-full gap-2 rounded-t-lg border border-white/25 bg-white/[0.04] p-3" style={{ aspectRatio: "16 / 10" }}>
              <div className="flex flex-col gap-2">
                <Block className="h-2 w-1/4" />
                <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-2">
                  <div className="flex flex-col justify-center gap-1.5">
                    <Block className="h-3 w-5/6 !bg-white/45" />
                    <Block className="h-1.5 w-4/6" />
                    <span className="mt-1 block h-4 w-14 rounded-full bg-accent" />
                  </div>
                  <span className="rounded bg-white/10" />
                </div>
                <div className="grid h-1/4 grid-cols-3 gap-2">
                  <span className="rounded bg-white/10" /><span className="rounded bg-white/10" /><span className="rounded bg-white/10" />
                </div>
              </div>
            </div>
            <span className="h-1.5 w-[108%] rounded-b-md bg-white/25" />
          </motion.div>

          {/* tablet */}
          <motion.div {...pop(0.3)} className="w-[24%] rounded-lg border border-white/25 bg-white/[0.04] p-2" style={{ aspectRatio: "3 / 4" }}>
            <div className="flex h-full flex-col gap-1.5">
              <Block className="h-1.5 w-1/3" />
              <Block className="h-2.5 w-5/6 !bg-white/45" />
              <Block className="h-1.5 w-3/5" />
              <span className="block h-3.5 w-10 rounded-full bg-accent" />
              <span className="flex-1 rounded bg-white/10" />
              <div className="grid h-1/4 grid-cols-2 gap-1.5">
                <span className="rounded bg-white/10" /><span className="rounded bg-white/10" />
              </div>
            </div>
          </motion.div>

          {/* phone */}
          <motion.div {...pop(0.45)} className="w-[13%] rounded-xl border border-white/25 bg-white/[0.04] p-1.5" style={{ aspectRatio: "9 / 19" }}>
            <div className="flex h-full flex-col gap-1.5">
              <Block className="h-1 w-1/2" />
              <Block className="h-2 w-5/6 !bg-white/45" />
              <span className="block h-3 w-8 rounded-full bg-accent" />
              <span className="h-1/4 rounded bg-white/10" />
              <span className="flex-1 rounded bg-white/10" />
            </div>
          </motion.div>
        </div>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.9, duration: 0.6 }}
          className="mt-4 text-sm leading-snug text-foreground/60"
        >
          We test on real phones in our hands, not just by resizing a browser window.
        </motion.p>
      </div>
    </Sheet>
  );
}

/* ---- 04 Launch & care: a typical project, and what comes after -------- */

function TimelineArt({ reduce }: { reduce: boolean }) {
  const stops = [
    { when: "Week 1", what: "We talk, plan and sketch your pages." },
    { when: "Week 2", what: "Build, with your feedback along the way." },
    { when: "Week 3", what: "Domain, hosting, and the site goes live.", live: true },
  ];
  return (
    <Sheet tag="A typical project, start to finish">
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative">
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: reduce ? 0 : 0.15, ease: EASE }}
            className="absolute left-0 right-0 top-[9px] hidden h-px origin-left bg-white/30 sm:block"
          />
          <div className="relative grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4">
            {stops.map((st, i) => (
              <motion.div
                key={st.when}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.35 + i * 0.25, duration: 0.55, ease: EASE }}
              >
                <span className="relative flex h-[18px] w-[18px]">
                  {st.live && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                  )}
                  <span
                    className={`relative h-[18px] w-[18px] rounded-full border-2 ${
                      st.live ? "border-accent bg-accent" : "border-white/50 bg-[#0c0c0c]"
                    }`}
                  />
                </span>
                <p className={`mt-4 font-mono text-xs uppercase tracking-widest ${st.live ? "text-accent" : "text-foreground/50"}`}>
                  {st.when}
                  {st.live ? " — live" : ""}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-foreground/85">{st.what}</p>
              </motion.div>
            ))}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 1.1, duration: 0.55, ease: EASE }}
            >
              <span className="block h-[18px] w-full" />
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-foreground/50">After that</p>
              <p className="mt-2 text-[15px] leading-snug text-foreground/85">
                We stay: updates, fixes and SEO tweaks, whenever you need them.
              </p>
            </motion.div>
          </div>
        </div>
        <p className="mt-8 text-sm leading-snug text-foreground/55">
          Bigger builds, like online stores, take a bit longer. We&apos;ll say so on the first call.
        </p>
      </div>
    </Sheet>
  );
}

function StepVisual({ id, reduce }: { id: string; reduce: boolean }) {
  if (id === "design") return <DesignArt reduce={reduce} />;
  if (id === "build") return <BuildArt reduce={reduce} />;
  if (id === "launch") return <TimelineArt reduce={reduce} />;
  return <SitemapArt reduce={reduce} />;
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
              className="relative w-full sm:aspect-[4/3]"
            >
              <motion.div
                style={{
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-8"
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

                <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-between sm:min-h-0">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                    <span>Step {String(activeIndex + 1).padStart(2, "0")}</span>
                    <span className="text-foreground/40">What you get</span>
                  </div>
                  <div className="pointer-events-none min-h-0 flex-1 py-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="h-full w-full"
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

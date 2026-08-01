"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import SplitReveal from "@/components/ui/SplitReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { scrollToHash } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.9 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLHeadingElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setReady(true);
    window.addEventListener("FOR1S:loaded", handler);
    // Safety net in case the preloader event never fires for any reason.
    const fallback = setTimeout(() => setReady(true), 4000);
    return () => {
      window.removeEventListener("FOR1S:loaded", handler);
      clearTimeout(fallback);
    };
  }, []);

  /* Mouse parallax — the extruded headline tilts toward the pointer and a
     soft light follows the cursor across the hero. Listens on `window` and
     checks the pointer against the hero bounds, so no overlay can swallow the
     events. Skipped on touch and for reduced-motion users. */
  useEffect(() => {
    const hero = heroRef.current;
    const tilt = tiltRef.current;
    const light = lightRef.current;
    if (!hero || !tilt) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const toRotY = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power2.out" });
    const toRotX = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power2.out" });
    const toTx = gsap.quickTo(tilt, "x", { duration: 0.8, ease: "power2.out" });
    const toTy = gsap.quickTo(tilt, "y", { duration: 0.8, ease: "power2.out" });

    let inHero = false;

    const apply = (nx: number, ny: number) => {
      toRotY(nx * 14);
      toRotX(-ny * 12);
      toTx(nx * 16);
      toTy(ny * 12);
      if (light) {
        light.style.setProperty("--lx", `${(nx * 80).toFixed(1)}px`);
        light.style.setProperty("--ly", `${(ny * 80).toFixed(1)}px`);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        if (inHero) {
          inHero = false;
          toRotY(0);
          toRotX(0);
          toTx(0);
          toTy(0);
        }
        return;
      }
      inHero = true;
      apply(
        (e.clientX - rect.left) / rect.width - 0.5,
        (e.clientY - rect.top) / rect.height - 0.5
      );
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[18%] right-[-12%] h-[55vw] max-h-[600px] w-[55vw] max-w-[600px] rounded-full bg-accent/[0.12] blur-[110px] animate-pulse-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-25%] left-[-15%] h-[40vw] max-h-[420px] w-[40vw] max-w-[420px] rounded-full bg-accent/[0.06] blur-[100px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-6 pb-10 pt-32 lg:px-12 lg:pb-16 lg:pt-40">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="flex items-start justify-between"
        >
          <SectionLabel scene="01" title="Introducing" light />
          <span className="hidden font-mono text-xs tracking-wideish text-muted md:block">
            REEL 01 — 09
          </span>
        </motion.div>

        <div className="relative mt-16 lg:mt-0">
          {/* Pointer-following light — makes the extrusion feel lit. */}
          <div
            ref={lightRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 rounded-full blur-3xl"
            style={{
              width: "min(46vw, 520px)",
              aspectRatio: "1",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.10), rgba(230,57,70,0.12) 45%, transparent 72%)",
              transform:
                "translate(-50%, -50%) translate(var(--lx, 0px), var(--ly, 0px))",
            }}
          />

          <div style={{ perspective: "1000px" }} className="relative z-10">
            <h1
              ref={tiltRef}
              className="hero-extrude font-display text-fluid-hero font-bold uppercase leading-[0.9] tracking-tightest text-foreground"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {ready && (
                <>
                  <SplitReveal
                    as="span"
                    type="lines"
                    trigger="immediate"
                    delay={0.1}
                    className="block overflow-hidden"
                  >
                    We build SaaS,
                  </SplitReveal>
                  <SplitReveal
                    as="span"
                    type="lines"
                    trigger="immediate"
                    delay={0.3}
                    className="block overflow-hidden text-accent"
                  >
                    you scale it.
                  </SplitReveal>
                </>
              )}
            </h1>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            className="max-w-md  text-muted"
          >
            End-to-end SaaS development — from product strategy and UI/UX to
            full-stack engineering and launch. We turn ambitious ideas into revenue-ready platforms.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            className="flex items-center gap-7"
          >
            <MagneticButton
              variant="glass"
              size="lg"
              cursorText="Go"
              onClick={() => scrollToHash("#final-cta")}
            >
              Book a call
            </MagneticButton>
            <button
              data-cursor="hover"
              onClick={() => scrollToHash("#vision")}
              className="text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              See our work ↓
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="h-10 w-px animate-float bg-gradient-to-b from-transparent via-foreground/40 to-transparent" />
      </motion.div>
    </section>
  );
}

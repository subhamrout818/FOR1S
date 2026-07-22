"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import SplitReveal from "@/components/ui/SplitReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { scrollToHash } from "@/lib/utils";

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

  return (
    <section
      id="hero"
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

        <h1 className="mt-16 font-display text-fluid-hero font-bold uppercase leading-[0.9] tracking-tightest text-foreground lg:mt-0">
          
          {ready && (
            <>
              <SplitReveal
                as="span"
                type="lines"
                trigger="immediate"
                delay={0.1}
                className="block overflow-hidden"
              >
                Your VISION,
              </SplitReveal>
              <SplitReveal
                as="span"
                type="lines"
                trigger="immediate"
                delay={0.3}
                className="block overflow-hidden text-accent"
              >
                bought to life.
              </SplitReveal>
            </>
          )}
        </h1>

        <div className="mt-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            className="max-w-md  text-muted"
          >
            Where cinematic storytelling meets modern engineering.
            Crafting digital experiences that transform ambitious ideas into unforgettable brands.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            className="flex items-center gap-7"
          >
            <MagneticButton
              size="lg"
              cursorText="Go"
              onClick={() => scrollToHash("#pricing")}
            >
              Reserve access
            </MagneticButton>
            <button
              data-cursor="hover"
              onClick={() => scrollToHash("#vision")}
              className="text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              Watch the film ↓
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

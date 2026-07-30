"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { CONTACT } from "@/lib/contact";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-20 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] max-h-[560px] w-[50vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.16] blur-[130px] animate-pulse-glow"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <SectionLabel scene="09" title="Get started" className="mb-10 justify-center" />

        <SplitReveal
          as="h2"
          type="lines"
          stagger={0.05}
          className="font-display text-fluid-xl font-bold uppercase leading-[1] tracking-tightest text-foreground"
        >
          Ready to stop planning and start shipping?
        </SplitReveal>

        <RevealMask blur={false} y={16} delay={0.2} className="mt-8">
          <p className="max-w-md text-base text-muted lg:text-lg">
            Book a free discovery call. We&apos;ll map out your product,
            your timeline, and what it actually takes to get to launch.
          </p>
        </RevealMask>

        <RevealMask blur={false} y={16} delay={0.3} className="mt-12">
          <MagneticButton
            size="lg"
            cursorText="Go"
            onClick={() => window.open(CONTACT.calendar, "_blank")}
          >
            Book a consultation call
          </MagneticButton>
        </RevealMask>
      </div>
    </section>
  );
}

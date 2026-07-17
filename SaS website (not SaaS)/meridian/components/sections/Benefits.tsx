"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { BENEFITS } from "@/lib/data";

function BenefitRow({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!numberRef.current || prefersReducedMotion()) return;

      gsap.fromTo(
        numberRef.current,
        { y: -46 },
        {
          y: 46,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: rowRef }
  );

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 items-center gap-8 border-t border-hairline py-12 md:grid-cols-[0.4fr_0.6fr] lg:py-16"
    >
      <span
        ref={numberRef}
        className="block select-none font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-none text-foreground/[0.08]"
      >
        {index}
      </span>
      <div className="max-w-xl">
        <SplitReveal
          as="h3"
          type="words"
          className="mb-4 font-display text-2xl font-semibold text-foreground lg:text-3xl"
        >
          {title}
        </SplitReveal>
        <RevealMask blur={false} y={12} delay={0.1}>
          <p className="text-base leading-relaxed text-muted lg:text-lg">
            {description}
          </p>
        </RevealMask>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="benefits" className="relative overflow-hidden bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionLabel scene="05" title="Benefits" className="mb-14" />
        <div>
          {BENEFITS.map((benefit, i) => (
            <BenefitRow
              key={benefit.id}
              index={String(i + 1).padStart(2, "0")}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

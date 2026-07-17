import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import GlowCard from "@/components/ui/GlowCard";
import { FEATURES } from "@/lib/data";

export default function Features() {
  return (
    <section id="features" className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel scene="03" title="Features" className="mb-6" />
            <SplitReveal
              as="h2"
              type="words"
              className="max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
            >
              Five decisions that define the machine.
            </SplitReveal>
          </div>
          <RevealMask blur={false} y={16} className="max-w-sm">
            <p className="text-sm leading-relaxed text-muted md:text-base">
              Nothing here is arbitrary. Every system was built, discarded,
              and rebuilt until it earned its place inside the chassis.
            </p>
          </RevealMask>
        </div>

        <div className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-4 lg:gap-5">
          {FEATURES.map((feature, i) => (
            <RevealMask
              key={feature.id}
              delay={i * 0.06}
              y={24}
              className={
                feature.span === "large"
                  ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                  : ""
              }
            >
              <GlowCard className="flex h-full flex-col justify-between p-7 lg:p-8">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-accent">
                    {feature.scene}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-foreground/30 transition-colors duration-300 group-hover:text-accent" />
                </div>
                <div>
                  <h3
                    className={
                      feature.span === "large"
                        ? "mb-3 font-display text-2xl font-semibold text-foreground lg:text-3xl"
                        : "mb-3 font-display text-xl font-semibold text-foreground"
                    }
                  >
                    {feature.title}
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              </GlowCard>
            </RevealMask>
          ))}
        </div>
      </div>
    </section>
  );
}

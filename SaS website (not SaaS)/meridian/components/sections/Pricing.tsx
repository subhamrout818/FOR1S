import { Check } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import MagneticButton from "@/components/ui/MagneticButton";
import { PRICING_TIERS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <SectionLabel
            scene="07"
            title="Pricing"
            className="mb-6 justify-center"
          />
          <SplitReveal
            as="h2"
            type="words"
            className="mx-auto max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
          >
            Three configurations. One standard.
          </SplitReveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
          {PRICING_TIERS.map((tier, i) => (
            <RevealMask key={tier.id} delay={i * 0.08} y={28}>
              <div
                className={cn(
                  "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-8 lg:p-9",
                  tier.highlighted
                    ? "border-accent/40 bg-surface md:-translate-y-5 md:shadow-[0_30px_90px_-40px_rgba(230,57,70,0.35)]"
                    : "border-hairline bg-surface/60"
                )}
              >
                {tier.highlighted && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-6 -top-24 h-40 rotate-6 bg-gradient-to-b from-white/[0.08] to-transparent"
                    />
                    <span className="absolute right-6 top-6 rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                      Most reserved
                    </span>
                  </>
                )}

                <div>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{tier.tagline}</p>

                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-foreground lg:text-5xl">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted">reservation</span>
                  </div>

                  <ul className="mt-8 flex flex-col gap-4">
                    {tier.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-3 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <MagneticButton
                  variant={tier.highlighted ? "solid" : "outline"}
                  size="md"
                  cursorText="Go"
                  className="mt-10 w-full"
                >
                  Reserve {tier.name}
                </MagneticButton>
              </div>
            </RevealMask>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          $100 fully refundable reservation. Final configuration confirmed
          before production.
        </p>
      </div>
    </section>
  );
}

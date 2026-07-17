import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-32 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] max-h-[560px] w-[50vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.16] blur-[130px] animate-pulse-glow"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <SectionLabel scene="09" title="Final call" className="mb-10 justify-center" />

        <SplitReveal
          as="h2"
          type="lines"
          stagger={0.05}
          className="font-display text-fluid-xl font-bold uppercase leading-[1] tracking-tightest text-foreground"
        >
          Some machines are built to impress. This one is built to disappear.
        </SplitReveal>

        <RevealMask blur={false} y={16} delay={0.2} className="mt-8">
          <p className="max-w-md text-base text-muted lg:text-lg">
            Reserve your SAS today. The first production run is limited,
            and units ship in the order they&apos;re reserved.
          </p>
        </RevealMask>

        <RevealMask blur={false} y={16} delay={0.3} className="mt-12">
          <MagneticButton size="lg" cursorText="Go">
            Reserve access — $100 refundable
          </MagneticButton>
        </RevealMask>
      </div>
    </section>
  );
}

import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";

export default function Vision() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden bg-background py-32 lg:py-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
      >
        <div className="h-full w-full animate-morph bg-accent blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionLabel scene="02" title="Vision" className="mb-14" />

        <SplitReveal
          as="p"
          type="lines"
          stagger={0.05}
          className="max-w-4xl font-serif text-fluid-xl italic leading-[1.15] text-foreground"
        >
          We didn&apos;t set out to build a faster machine. We set out to
          build one that finally gets out of the way.
        </SplitReveal>

        <RevealMask delay={0.15} className="ml-auto mt-14 max-w-xl">
          <p className="text-right text-base leading-relaxed text-muted md:text-lg">
            Every material, every circuit, every line of software in FOR1S
            exists to remove something — a delay, a fan, a menu, a
            compromise. What&apos;s left is a machine that responds before
            you finish the thought, and disappears the moment you stop
            noticing it.
          </p>
        </RevealMask>
      </div>
    </section>
  );
}

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
          We didn&apos;t set out to build another agency. We set out to
          build the one we wish existed when we were starting out.
        </SplitReveal>

        <RevealMask delay={0.15} className="ml-auto mt-14 max-w-xl">
          <p className="text-right text-base leading-relaxed text-muted md:text-lg">
            Every decision — tech stack, architecture, design system,
            deployment — is made to serve your users and your revenue.
            We strip away what doesn&apos;t convert, what doesn&apos;t
            scale, and what doesn&apos;t matter. What&apos;s left is a
            product that feels inevitable.
          </p>
        </RevealMask>
      </div>
    </section>
  );
}

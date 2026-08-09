import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";

export default function Vision() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden bg-background py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
      >
        <div className="h-full w-full animate-morph bg-accent blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
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
            Every decision — design, copy, layout, speed — exists to turn
            a visitor into a customer. We strip away what doesn&apos;t
            help your business, what doesn&apos;t load fast, and what
            doesn&apos;t get you found. What&apos;s left is a website
            that makes your business look as good as it is.
          </p>
        </RevealMask>
      </div>
    </section>
  );
}

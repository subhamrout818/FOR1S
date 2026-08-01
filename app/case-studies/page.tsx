import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { CASE_STUDIES } from "@/lib/case-studies";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Case Studies — FOR1S",
  description:
    "Deep-dives into how FOR1S takes products from idea to launch — the strategy, the build, and the results.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-32 lg:px-12">
      {/* Header */}
      <div className="mb-20 lg:mb-28">
        <SectionLabel scene="05" title="Case studies" className="mb-6" />
        <SplitReveal
          as="h1"
          type="words"
          className="max-w-3xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          How we ship.
        </SplitReveal>
        <RevealMask delay={0.15} y={16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            The process, the trade-offs, and the numbers behind a few projects
            we&apos;re proud of.
          </p>
        </RevealMask>
      </div>

      <div className="flex flex-col">
        {CASE_STUDIES.map((study) => (
          <section key={study.id} className="border-t border-hairline">
            <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[0.35fr_0.65fr] lg:py-20">
              {/* Left rail — meta */}
              <RevealMask y={24}>
                <div className="flex flex-col gap-6">
                  <span className="font-mono text-5xl text-accent/80 lg:text-6xl">
                    {study.index}
                  </span>
                  <div>
                    <Link
                      href={`/case-studies/${study.id}`}
                      data-cursor="hover"
                      className="group/name inline-flex items-center gap-3"
                    >
                      <h2 className="font-display text-2xl font-semibold uppercase tracking-tightest text-foreground transition-colors duration-300 group-hover/name:text-accent lg:text-3xl">
                        {study.client}
                      </h2>
                      <ArrowUpRight
                        size={18}
                        className="text-foreground/30 transition-all duration-300 group-hover/name:-translate-y-0.5 group-hover/name:translate-x-0.5 group-hover/name:text-accent"
                      />
                    </Link>
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
                      {study.industry} · {study.year}
                    </p>
                  </div>
                </div>
              </RevealMask>

              {/* Right — story */}
              <div className="flex flex-col gap-10">
                <RevealMask y={24}>
                  <p className="font-serif text-fluid-md italic leading-snug text-foreground">
                    {study.headline}
                  </p>
                </RevealMask>

                <div className="grid gap-8 md:grid-cols-2">
                  <RevealMask y={20} delay={0.05}>
                    <div>
                      <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                        Challenge
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {study.challenge}
                      </p>
                    </div>
                  </RevealMask>
                  <RevealMask y={20} delay={0.1}>
                    <div>
                      <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                        Solution
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {study.solution}
                      </p>
                    </div>
                  </RevealMask>
                </div>

                {/* Results */}
                <RevealMask y={20} delay={0.15}>
                  <div className="grid grid-cols-3 gap-4 rounded-2xl border border-hairline bg-surface/60 px-6 py-6">
                    {study.results.map((result) => (
                      <div key={result.label}>
                        <p className="font-display text-2xl font-bold text-accent lg:text-3xl">
                          {result.value}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </RevealMask>

                {/* Services */}
                <RevealMask y={16} delay={0.2}>
                  <div className="flex flex-wrap gap-2">
                    {study.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-hairline bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </RevealMask>

                {/* Read the full story */}
                <RevealMask y={16} delay={0.25}>
                  <Link
                    href={`/case-studies/${study.id}`}
                    data-cursor="hover"
                    className="group/read inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/70 transition-colors duration-300 hover:text-accent"
                  >
                    Read the full case study
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover/read:-translate-y-0.5 group-hover/read:translate-x-0.5"
                    />
                  </Link>
                </RevealMask>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-6 border-t border-hairline pt-20 text-center">
        <h2 className="max-w-lg font-display text-2xl font-semibold uppercase tracking-tightest text-foreground lg:text-3xl">
          Your project could be next.
        </h2>
        <a
          href={CONTACT.calendar}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
        >
          Book a consultation call
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}

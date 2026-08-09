import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import BrowserMock from "@/components/ui/BrowserMock";
import { CASE_STUDIES } from "@/lib/work";

export default function Work() {
  return (
    <section id="work" className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel scene="07" title="Work" className="mb-6" />
            <SplitReveal
              as="h2"
              type="words"
              className="max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
            >
              Real builds, made to win.
            </SplitReveal>
          </div>
          <RevealMask blur={false} y={16} className="max-w-sm">
            <p className="text-sm leading-relaxed text-muted md:text-base">
              A few of the websites we&apos;ve designed and built — for cafés,
              salons, studios, and personal brands. Every one designed from
              scratch, mobile-first, and built to get found.
            </p>
          </RevealMask>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((project, i) => (
            <RevealMask key={project.slug} delay={i * 0.08} y={28}>
              <Link
                href={`/work/${project.slug}`}
                data-cursor="view"
                data-cursor-text="Open"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface/60 transition-colors duration-500 hover:border-accent/40"
              >
                <BrowserMock
                  name={project.name}
                  monogram={project.monogram}
                  hue={project.hue}
                />
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                      {project.name}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                    {project.industry} · {project.year}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </RevealMask>
          ))}
        </div>
      </div>
    </section>
  );
}

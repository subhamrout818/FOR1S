import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import GlowCard from "@/components/ui/GlowCard";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — FOR1S",
  description:
    "Selected work from FOR1S — SaaS platforms, business websites, and digital experiences for startups and brands.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-32 lg:px-12">
      {/* Header */}
      <div className="mb-16 lg:mb-24">
        <SectionLabel scene="04" title="Work" className="mb-6" />
        <SplitReveal
          as="h1"
          type="words"
          className="max-w-3xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          Projects we&apos;re proud of.
        </SplitReveal>
        <RevealMask delay={0.15} y={16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            A selection of SaaS platforms, websites, and products — each built
            end to end by one team, shipped fast, and made to scale.
          </p>
        </RevealMask>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <RevealMask
            key={project.id}
            delay={(i % 2) * 0.08}
            y={28}
            className={i === 0 ? "md:col-span-2" : ""}
          >
            <GlowCard className="flex h-full flex-col justify-between p-8 lg:p-10">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-accent">
                  {project.index}
                </span>
                <ArrowUpRight className="h-5 w-5 text-foreground/30 transition-colors duration-300 group-hover:text-accent" />
              </div>

              <div className="mt-16">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono uppercase tracking-widest text-muted">
                    {project.category}
                  </span>
                  <span className="h-px w-6 bg-hairline" />
                  <span className="font-mono text-muted">{project.year}</span>
                </div>

                <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground lg:text-4xl">
                  {project.name}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-hairline bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>
          </RevealMask>
        ))}
      </div>
    </div>
  );
}

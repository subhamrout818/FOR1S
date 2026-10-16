"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { CASE_STUDIES } from "@/lib/work";

/**
 * No fabricated testimonials: show verifiable proof of work instead.
 * The projects are explicitly labelled as fictional concept demos.
 */
export default function Testimonials() {
  return (
    <section id="credibility" className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionLabel scene="08" title="Proof, not promises" className="mb-6" />
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal
            as="h2"
            type="words"
            className="max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
          >
            Judge the work. Not a quote.
          </SplitReveal>
          <RevealMask blur={false} y={12} className="max-w-md">
            <p className="text-sm leading-relaxed text-muted md:text-base">
              We’re building our client track record, so we won’t invent testimonials or imply these concepts are paid client projects. Explore the demos, inspect the scope, and decide for yourself.
            </p>
          </RevealMask>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {CASE_STUDIES.map((project, index) => (
            <RevealMask key={project.slug} delay={index * 0.06} y={18}>
              <Link
                href={\`/work/\${project.slug}\`}
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface/50 p-6 transition-colors hover:border-accent/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Concept demo</span>
                  <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-accent" />
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold uppercase tracking-wide text-foreground">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-foreground/70">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Scope and limitations stated</span>
                </div>
              </Link>
            </RevealMask>
          ))}
        </div>
      </div>
    </section>
  );
}

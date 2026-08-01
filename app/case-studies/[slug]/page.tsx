import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealMask from "@/components/ui/RevealMask";
import { CASE_STUDIES } from "@/lib/case-studies";
import { CONTACT } from "@/lib/contact";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.id }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const study = CASE_STUDIES.find((s) => s.id === params.slug);
  return {
    title: study ? `${study.client} — Case Study | FOR1S` : "Case Study | FOR1S",
    description: study?.headline,
    alternates: {
      canonical: study ? `/case-studies/${study.id}` : "/case-studies",
    },
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const index = CASE_STUDIES.findIndex((s) => s.id === params.slug);
  if (index === -1) notFound();

  const study = CASE_STUDIES[index]!;
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length]!;

  return (
    <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-32 lg:px-12">
      {/* Back link */}
      <Link
        href="/case-studies"
        data-cursor="hover"
        className="mb-14 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft size={14} />
        All case studies
      </Link>

      {/* Hero */}
      <header className="border-b border-hairline pb-14">
        <SectionLabel scene="05" title="Case study" className="mb-8" />
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-fluid-xl font-semibold uppercase leading-[0.95] tracking-tightest text-foreground">
            {study.client}
          </h1>
          <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted">
            {study.industry} · {study.year}
          </p>
        </div>
        <p className="mt-8 max-w-2xl font-serif text-fluid-md italic leading-snug text-foreground/90">
          {study.headline}
        </p>
      </header>

      {/* Overview */}
      <RevealMask y={24}>
        <p className="mt-12 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {study.detail.overview}
        </p>
      </RevealMask>

      {/* Narrative sections */}
      <div className="mt-16 flex flex-col gap-14">
        {study.detail.sections.map((section, i) => (
          <RevealMask key={section.heading} y={24} delay={i * 0.04}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.3fr_0.7fr]">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tightest text-foreground lg:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
                  {section.body.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </RevealMask>
        ))}
      </div>

      {/* Results band */}
      <RevealMask y={24}>
        <div className="mt-16 grid grid-cols-3 gap-4 rounded-2xl border border-hairline bg-surface/60 px-6 py-8 md:gap-8">
          {study.results.map((result) => (
            <div key={result.label}>
              <p className="font-display text-3xl font-bold text-accent lg:text-5xl">
                {result.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">
                {result.label}
              </p>
            </div>
          ))}
        </div>
      </RevealMask>

      {/* Services */}
      <RevealMask y={16}>
        <div className="mt-10 flex flex-wrap gap-2">
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

      {/* Next study + CTA */}
      <div className="mt-20 flex flex-col gap-8 border-t border-hairline pt-14">
        <Link
          href={`/case-studies/${next.id}`}
          data-cursor="hover"
          className="group flex items-center justify-between gap-6 rounded-2xl border border-hairline bg-surface/40 px-7 py-7 transition-all duration-300 hover:border-accent/40 lg:px-10"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Next case study — {next.index}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-tightest text-foreground lg:text-3xl">
              {next.client}
            </p>
          </div>
          <ArrowRight
            size={22}
            className="shrink-0 text-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
          />
        </Link>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Want results like these on your next build? Let&apos;s map out what
            it takes.
          </p>
          <a
            href={CONTACT.calendar}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
          >
            Book a consultation call
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

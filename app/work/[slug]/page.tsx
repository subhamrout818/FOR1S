import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import BrowserMock from "@/components/ui/BrowserMock";
import { CASE_STUDIES } from "@/lib/work";
import { CONTACT } from "@/lib/contact";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = CASE_STUDIES.find((p) => p.slug === params.slug);
  if (!project) {
    return { title: "Work — FOR1S" };
  }
  return {
    title: `${project.name} — ${project.industry} website by FOR1S`,
    description: project.summary,
    openGraph: {
      title: `${project.name} — FOR1S`,
      description: project.summary,
    },
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default function WorkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = CASE_STUDIES.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-32 lg:px-12">
      <Link
        href="/#work"
        data-cursor="hover"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft size={14} />
        All work
      </Link>

      <SectionLabel scene="07" title={project.industry} className="mb-6" />

      <h1 className="font-display text-fluid-xl font-bold uppercase leading-[0.98] tracking-tightest text-foreground">
        {project.name}
      </h1>

      <p className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
        <span>{project.year}</span>
        <span className="h-px w-4 bg-hairline" />
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </p>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
        {project.summary}
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-hairline bg-surface/60">
        <BrowserMock
          name={project.name}
          monogram={project.monogram}
          hue={project.hue}
        />
      </div>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-foreground/80">
        {project.overview.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-surface/60 p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Services
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {project.services.map((service) => (
              <li
                key={service}
                className="flex items-start gap-3 text-sm text-foreground/85"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {service}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface/60 p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            At a glance
          </p>
          <dl className="mt-4 flex flex-col gap-4">
            {project.highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center justify-between border-b border-hairline pb-3"
              >
                <dt className="text-xs uppercase tracking-widest text-muted">
                  {h.label}
                </dt>
                <dd className="font-mono text-sm text-foreground">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-hairline bg-surface/60 p-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tightest text-foreground">
            Want something like this?
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Every project starts with a free call. We&apos;ll talk about your
            business and what your website needs to win.
          </p>
        </div>
        <a
          href={CONTACT.calendar}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
        >
          Book a free call
        </a>
      </div>
    </div>
  );
}

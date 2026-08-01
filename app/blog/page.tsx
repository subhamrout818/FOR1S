

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — FOR1S",
  description:
    "Notes and ideas on SaaS strategy, design, engineering, and growth from the FOR1S team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-32 lg:px-12">
      {/* Header */}
      <div className="mb-16 lg:mb-20">
        <SectionLabel scene="08" title="Insights" className="mb-6" />
        <SplitReveal
          as="h1"
          type="words"
          className="font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          Notes &amp; ideas.
        </SplitReveal>
        <RevealMask delay={0.15} y={16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            What we&apos;re learning from shipping software — on strategy,
            design, engineering, and growth.
          </p>
        </RevealMask>
      </div>

      {/* Posts */}
      <div className="flex flex-col">
        {POSTS.map((post, i) => (
          <RevealMask key={post.slug} delay={i * 0.06} y={24}>
            <Link
              href={`/blog/${post.slug}`}
              data-cursor="hover"
              className="group flex flex-col gap-4 border-t border-hairline py-10 transition-colors duration-300 last:border-b lg:flex-row lg:items-center lg:gap-10"
            >
              <span className="font-mono text-xs text-accent lg:w-10">
                {post.index}
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
                  <span>{post.tag}</span>
                  <span className="h-px w-4 bg-hairline" />
                  <span>{post.date}</span>
                  <span className="h-px w-4 bg-hairline" />
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tightest text-foreground transition-colors duration-300 group-hover:text-accent lg:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden font-mono text-xs text-muted md:block">
                  {post.author}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </div>
            </Link>
          </RevealMask>
        ))}
      </div>
    </div>
  );
}

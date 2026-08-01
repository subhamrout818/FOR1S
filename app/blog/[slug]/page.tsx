import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import { POSTS } from "@/lib/blog";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  return {
    title: post ? `${post.title} — FOR1S` : "Blog — FOR1S",
    alternates: { canonical: post ? `/blog/${post.slug}` : "/blog" },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link
        href="/blog"
        data-cursor="hover"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <SectionLabel scene="08" title={post.tag} className="mb-6" />

      <h1 className="font-display text-fluid-lg font-bold uppercase leading-[0.98] tracking-tightest text-foreground">
        {post.title}
      </h1>

      <p className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
        <span>{post.date}</span>
        <span className="h-px w-4 bg-hairline" />
        <span>{post.readTime} read</span>
        <span className="h-px w-4 bg-hairline" />
        <span>{post.author}</span>
      </p>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-foreground/80">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-16 border-t border-hairline pt-10">
        <Link
          href="/blog"
          data-cursor="hover"
          className="text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-4 transition-colors duration-300 hover:text-accent"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}

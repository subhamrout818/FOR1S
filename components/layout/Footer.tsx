"use client";

import Link from "next/link";
import { BRAND, FOOTER_LINKS } from "@/lib/data";
import { scrollToHash } from "@/lib/utils";
import RevealMask from "@/components/ui/RevealMask";

const YEAR = new Date().getFullYear();

/** Check if a link should be rendered as an external anchor */
function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

/** Check if a link is an internal page route (not a hash anchor) */
function isPageRoute(href: string) {
  return href.startsWith("/");
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </span>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {isExternal(link.href) ? (
              <a
                data-cursor="hover"
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-foreground/80 transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </a>
            ) : isPageRoute(link.href) ? (
              <Link
                data-cursor="hover"
                href={link.href}
                className="text-sm text-foreground/80 transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </Link>
            ) : (
              <button
                data-cursor="hover"
                onClick={() => scrollToHash(link.href)}
                className="text-sm text-foreground/80 transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 pb-10 pt-24 lg:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <RevealMask blur={false} y={20}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5">
                <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="26" stroke="#FFFFFF" strokeWidth="2" />
                  <path
                    d="M32 6 C 20 20, 20 44, 32 58 C 44 44, 44 20, 32 6 Z"
                    stroke="#E63946"
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-display text-base font-semibold uppercase tracking-widest text-foreground">
                  {BRAND.name}
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Full-stack SaaS development for startups and enterprises.
                We design, build, and launch software that scales.
              </p>
              <span className="font-mono text-[11px] tracking-wideish text-muted/70">
                {BRAND.filed}
              </span>
            </div>
          </RevealMask>

          <RevealMask blur={false} y={20} delay={0.05}>
            <LinkColumn title="Product" links={[...FOOTER_LINKS.product]} />
          </RevealMask>
          <RevealMask blur={false} y={20} delay={0.1}>
            <LinkColumn title="Company" links={[...FOOTER_LINKS.company]} />
          </RevealMask>
          <RevealMask blur={false} y={20} delay={0.15}>
            <div className="flex flex-col gap-10">
              <LinkColumn title="Legal" links={[...FOOTER_LINKS.legal]} />
              <LinkColumn title="Social" links={[...FOOTER_LINKS.social]} />
            </div>
          </RevealMask>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-hairline pt-8 md:flex-row md:items-center">
          <span className="text-xs text-muted">
            © {YEAR} {BRAND.name} Digital. All rights reserved.
          </span>
          <button
            data-cursor="hover"
            onClick={() => scrollToHash("#hero")}
            className="text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="select-none pb-4 pt-6 text-center font-display font-bold leading-none text-foreground/[0.04]"
        style={{ fontSize: "clamp(4rem, 16vw, 13rem)" }}
      >
        {BRAND.name.toUpperCase()}
      </div>
    </footer>
  );
}

"use client";

import { BRAND, FOOTER_LINKS } from "@/lib/data";
import { scrollToHash } from "@/lib/utils";
import RevealMask from "@/components/ui/RevealMask";

const YEAR = new Date().getFullYear();

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </span>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <button
              data-cursor="hover"
              onClick={() => scrollToHash(link.href)}
              className="text-sm text-foreground/80 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </button>
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
                Precision computing, engineered without compromise. Reserved
                for the people who build what&apos;s next.
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
            © {YEAR} {BRAND.name} Systems. All rights reserved. A placeholder
            brand created for demonstration.
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

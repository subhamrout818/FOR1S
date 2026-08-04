"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BRAND, FOOTER_LINKS } from "@/lib/data";
import { scrollToHash } from "@/lib/utils";
import RevealMask from "@/components/ui/RevealMask";

const YEAR = new Date().getFullYear();

/**
 * Public source-code repo — never a secret, but overridable via env so the
 * URL lives alongside the rest of the project config (see .env.example).
 */
const REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL || "https://github.com/subhamrout818/FOR1S";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.51v-1.78c-2.94.64-3.56-1.42-3.56-1.42-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.08-2.82-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.89 1.08a10.1 10.1 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.21 2.53.1 2.8.67.73 1.08 1.67 1.08 2.82 0 4.04-2.46 4.93-4.81 5.19.38.32.72.97.72 1.96v2.9c0 .28.19.62.73.51A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

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
  const pathname = usePathname();
  const router = useRouter();

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
                onClick={() => {
                  // On the home page smooth-scroll; elsewhere go home + let
                  // Providers glide to the section.
                  if (pathname === "/") scrollToHash(link.href);
                  else router.push("/" + link.href);
                }}
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
          <div className="flex flex-wrap items-center gap-3">
            <a
              data-cursor="hover"
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-widest text-foreground/80 transition-all duration-300 hover:border-accent/60 hover:text-accent"
            >
              <GithubIcon size={14} />
              REPO
            </a>
            <button
              data-cursor="hover"
              onClick={() => scrollToHash("#hero")}
              className="text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent"
            >
              Back to top ↑
            </button>
          </div>
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

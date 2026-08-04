"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** When set, the card renders as a link to this route. */
  href?: string;
}

/**
 * A card with a spotlight that follows the cursor — a soft radial glow that
 * appears under the pointer on hover. Pass `href` to make the whole card a
 * clickable link (marketing cards on Features, dashboard stat/overview cards).
 */
export default function GlowCard({ children, className, style, href }: GlowCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  const classes = cn(
    "group relative block overflow-hidden rounded-2xl border border-hairline bg-surface",
    href && "cursor-pointer transition-colors duration-500 hover:border-accent/40",
    className
  );

  const inner = (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(230,57,70,0.14), transparent 70%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} data-cursor="hover" onMouseMove={handleMouseMove} style={style} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <div onMouseMove={handleMouseMove} style={style} className={classes}>
      {inner}
    </div>
  );
}

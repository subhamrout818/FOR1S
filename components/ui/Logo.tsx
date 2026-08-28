"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  /** Width of the logo in pixels (default: 32) */
  width?: number;
  /** Height of the logo in pixels (default: 32) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use the "small" variant (just the mark without text) */
  small?: boolean;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * FOR1S brand logo component.
 * Uses the logo-finalV1.svg from the public folder.
 */
export default function Logo({
  width = 32,
  height = 32,
  className,
  small = false,
  alt = "FOR1S",
}: LogoProps) {
  // The original logo has dimensions 414x560, so the aspect ratio is ~0.74
  // For the small variant, we'll use just the mark which appears to be the first two paths
  if (small) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 414 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("text-accent", className)}
      >
        <path d="M133.236 258.72L413.27 88.9804V0L133.236 169.74V258.72Z" fill="#AA1515" />
        <path d="M0 468.598L280.034 298.858V209.878L0 379.617V468.598Z" fill="#AA1515" />
        <path d="M190.559 264.526L280.035 209.88L280.519 560H191.527L190.559 264.526Z" fill="#AA1515" />
      </svg>
    );
  }

  // Full logo with text - we use the SVG from public folder as an image
  // The logo-finalV1.svg is the brand mark, we'll combine it with the FOR1S text
  return (
    <div className={cn("flex items-center gap-2.5", className)} role="img" aria-label={alt}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 414 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M133.236 258.72L413.27 88.9804V0L133.236 169.74V258.72Z" fill="#AA1515" />
        <path d="M0 468.598L280.034 298.858V209.878L0 379.617V468.598Z" fill="#AA1515" />
        <path d="M190.559 264.526L280.035 209.88L280.519 560H191.527L190.559 264.526Z" fill="#AA1515" />
      </svg>
      <span className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
        FOR1S
      </span>
    </div>
  );
}
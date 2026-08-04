import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type Lenis from "lenis";

/**
 * Merge Tailwind class names safely, resolving conflicts (last one wins).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * True only for same-origin relative paths ("/dashboard"), never protocol-
 * relative ("//evil.com") or backslash tricks ("/\\evil.com"). Used when
 * redirecting after OAuth / auth to block open-redirects.
 */
export function isSafeRelativePath(path: string | null | undefined): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/\\")
  );
}

/**
 * Smooth-scrolls to a section using the shared Lenis instance set up in
 * <Providers>, falling back to native scrolling if it isn't ready yet.
 */
export function scrollToHash(hash: string) {
  if (typeof window === "undefined") return;
  const target = document.querySelector(hash);
  if (!target) return;

  const lenis = (window as typeof window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { duration: 1.4, offset: -40 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}


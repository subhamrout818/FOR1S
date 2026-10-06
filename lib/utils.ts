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
 * relative ("//evil.com"), backslash tricks ("/\\evil.com"), encoded bypasses
 * ("%2f%2f"), or dot-segments ("/../secret"). Used when redirecting after
 * OAuth / auth to block open-redirects.
 */
export function isSafeRelativePath(path: string | null | undefined): path is string {
  if (typeof path !== "string" || !path.startsWith("/")) return false;

  // Block protocol-relative and backslash tricks (raw + URL-encoded).
  if (
    path.startsWith("//") ||
    path.startsWith("/\\") ||
    path.toLowerCase().startsWith("/%2f") ||
    path.toLowerCase().startsWith("/%5c")
  ) {
    return false;
  }

  // Decode once and reject dot-segment paths that could escape the root.
  try {
    const decoded = decodeURIComponent(path);
    if (decoded.includes("/../") || decoded.includes("/..\\") || decoded.endsWith("/..")) {
      return false;
    }
  } catch {
    // Malformed percent-encoding — reject.
    return false;
  }

  return true;
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


/**
 * Returns the URL only when it is safe to put in an `href`: http(s) or a
 * site-relative path. Anything else (javascript:, data:, …) becomes undefined.
 * Use for URLs that come from the database rather than from our own code.
 */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url || url === "#") return undefined;
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget. Renders nothing unless
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so forms keep working without it.
 *
 * "interaction-only" keeps it invisible for almost everyone; a challenge only
 * appears when Cloudflare is unsure. Tokens are single-use: bump `resetSignal`
 * after every submit (success or failure) to get a fresh one.
 */

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const TURNSTILE_ON = TURNSTILE_SITE_KEY.length > 0;

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
      appearance?: "always" | "execute" | "interaction-only";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const el = document.createElement("script");
      el.src = SCRIPT_SRC;
      el.async = true;
      el.defer = true;
      el.onload = () => resolve();
      el.onerror = () => {
        scriptPromise = null; // allow a retry on the next mount
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(el);
    });
  }
  return scriptPromise;
}

export default function Turnstile({
  onToken,
  resetSignal = 0,
  className,
}: {
  /** Called with a fresh token, or null when it expires / errors / is reset. */
  onToken: (token: string | null) => void;
  resetSignal?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    if (!TURNSTILE_ON) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(hostRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          size: "flexible",
          appearance: "interaction-only",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // Widget already gone — nothing to clean up.
        }
      }
      widgetId.current = null;
    };
  }, []);

  // A used token is dead — fetch a new one whenever the parent asks.
  useEffect(() => {
    if (resetSignal === 0 || !widgetId.current || !window.turnstile) return;
    onTokenRef.current(null);
    try {
      window.turnstile.reset(widgetId.current);
    } catch {
      // Ignore: the widget will refresh itself when it expires.
    }
  }, [resetSignal]);

  if (!TURNSTILE_ON) return null;
  return <div ref={hostRef} className={className} />;
}

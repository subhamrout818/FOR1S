"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PortalState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * Fetch a cookie-authenticated portal endpoint and expose loading/error/reload.
 * The httpOnly session cookie is sent automatically — no client token needed.
 */
export function usePortalData<T>(url: string): PortalState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const latest = useRef(0);

  const reload = useCallback(async () => {
    // Only the most recent request may write state, so a slow older response
    // can't overwrite newer data (e.g. after approve → comment in quick succession).
    const id = ++latest.current;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (id !== latest.current) return;
      if (json.success) {
        setData(json as T);
      } else {
        setError(json.message || "Failed to load");
      }
    } catch {
      if (id !== latest.current) return;
      setError("Network error. Please try again.");
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}

/** Minimal mutating POST helper for portal actions (cookie-authenticated). */
export async function portalAction<T = { success: boolean }>(
  url: string,
  body?: unknown
): Promise<{ ok: boolean; data: T; message: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = (await res.json()) as T & { message?: string; success?: boolean };
    return {
      ok: res.ok && !!data.success,
      data,
      message: data.message || (res.ok ? "" : "Something went wrong"),
    };
  } catch {
    return { ok: false, data: {} as T, message: "Network error. Please try again." };
  }
}

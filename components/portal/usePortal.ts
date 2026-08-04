"use client";

import { useCallback, useEffect, useState } from "react";

interface PortalState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * Fetch a Bearer-authenticated portal endpoint and expose loading/error/reload.
 */
export function usePortalData<T>(url: string, token: string | null): PortalState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json as T);
      } else {
        setError(json.message || "Failed to load");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) reload();
  }, [token, reload]);

  return { data, loading, error, reload };
}

/** Minimal mutating POST helper for portal actions. */
export async function portalAction<T = { success: boolean }>(
  url: string,
  token: string | null,
  body?: unknown
): Promise<{ ok: boolean; data: T; message: string }> {
  if (!token) return { ok: false, data: {} as T, message: "Not signed in" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
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

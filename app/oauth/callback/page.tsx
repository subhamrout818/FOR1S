"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

/**
 * Client handoff after an OAuth provider redirects back. The server set the
 * httpOnly session cookie before redirecting here, so this page just hydrates
 * the user via /api/auth/me and redirects on — no token ever touches the URL.
 */
export default function OAuthCallbackPage() {
  const { completeOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    const next = params.get("next");

    if (err) {
      setError(
        err === "access_denied"
          ? "Sign-in was cancelled."
          : "Something went wrong during sign-in. Please try again."
      );
      return;
    }

    completeOAuth(next);
  }, [completeOAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      {error ? (
        <div className="w-full max-w-sm text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 text-sm text-muted">
          <Loader2 size={18} className="animate-spin text-accent" />
          Signing you in…
        </div>
      )}
    </div>
  );
}

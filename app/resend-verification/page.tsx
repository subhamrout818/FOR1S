"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const initialEmail = new URLSearchParams(window.location.search).get("email");
    if (initialEmail) setEmail(initialEmail);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSent(true);
      } else {
        setError(
          response.status === 429
            ? "Too many requests. Please wait before trying again."
            : data.message || "We couldn't send the verification email. Please try again."
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter the address you used to create your FOR1S account.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center">
            <p className="text-sm text-emerald-300">
              If an unverified account matches this address, a fresh verification email may arrive shortly.
            </p>
            <p className="mt-2 text-xs text-muted">
              Check your inbox and spam folder. The link is valid for 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-5 text-sm text-foreground underline underline-offset-4 hover:text-accent"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={cn(
                  "w-full rounded-xl border border-hairline bg-background px-4 py-3",
                  "text-sm text-foreground placeholder:text-muted",
                  "transition-all duration-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                  "hover:border-foreground/20"
                )}
              />
            </div>
            <MagneticButton
              type="submit"
              variant="solid"
              size="lg"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "Sending…" : "Resend verification email"}
            </MagneticButton>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted">
          Already verified?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-accent">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

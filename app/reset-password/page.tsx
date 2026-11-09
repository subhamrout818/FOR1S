"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const stagger = {
  initial: { opacity: 0, y: 16 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) setError("This reset link is invalid or expired. Request a new one.");
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else {
        setError(data.message || "Could not reset your password");
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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <motion.div
          custom={0}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-10 text-center"
        >
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-muted">
            Choose a strong password to continue.
          </p>
        </motion.div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center"
          >
            <p className="text-sm text-emerald-300">
              Your password has been updated.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Log in now
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                {(error.toLowerCase().includes("invalid") || error.toLowerCase().includes("expired") || error.toLowerCase().includes("missing")) && (
                  <span className="mt-2 block">
                    <Link href="/forgot-password" className="font-medium text-foreground underline underline-offset-4 hover:text-accent">
                      Request a new reset link
                    </Link>
                  </span>
                )}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              custom={1}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                New password
              </label>
                <div className="relative">
                                <input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  required
                                  minLength={8}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="At least 8 characters"
                                  disabled={!token}
                                  className={cn(
                                    "w-full rounded-xl border border-hairline bg-background py-3 pl-4 pr-12",
                                    "text-sm text-foreground placeholder:text-muted",
                                    "transition-all duration-300",
                                    "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                                    "hover:border-foreground/20",
                                    "disabled:pointer-events-none disabled:opacity-50"
                                  )}
                                />
                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:text-accent"
                                  >
                                    {showPassword ? (
                                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M3 3l18 18" />
                                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.2-1.1 2.7-2.5 4" />
                                        <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                                      </svg>
                                    ) : (
                                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                    )}
                                  </button>
                </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <label
                htmlFor="confirm"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
                <div className="relative">
                                <input
                                  id="confirm"
                                  type={showConfirmPassword ? "text" : "password"}
                                  required
                                  minLength={8}
                                  value={confirm}
                                  onChange={(e) => setConfirm(e.target.value)}
                                  placeholder="Repeat your password"
                                  disabled={!token}
                                  className={cn(
                                    "w-full rounded-xl border border-hairline bg-background py-3 pl-4 pr-12",
                                    "text-sm text-foreground placeholder:text-muted",
                                    "transition-all duration-300",
                                    "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                                    "hover:border-foreground/20",
                                    "disabled:pointer-events-none disabled:opacity-50"
                                  )}
                                />
                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showConfirmPassword}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:text-accent"
                                  >
                                    {showConfirmPassword ? (
                                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M3 3l18 18" />
                                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.2-1.1 2.7-2.5 4" />
                                        <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                                      </svg>
                                    ) : (
                                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                    )}
                                  </button>
                </div>
            </motion.div>

            <motion.div
              custom={3}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <MagneticButton
                type="submit"
                variant="solid"
                size="lg"
                className="w-full justify-center"
                disabled={loading || !token}
              >
                {loading ? "Saving…" : "Update password"}
              </MagneticButton>
            </motion.div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

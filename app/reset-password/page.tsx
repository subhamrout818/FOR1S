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
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                disabled={!token}
                className={cn(
                  "w-full rounded-xl border border-hairline bg-background px-4 py-3",
                  "text-sm text-foreground placeholder:text-muted",
                  "transition-all duration-300",
                  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                  "hover:border-foreground/20",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              />
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
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                disabled={!token}
                className={cn(
                  "w-full rounded-xl border border-hairline bg-background px-4 py-3",
                  "text-sm text-foreground placeholder:text-muted",
                  "transition-all duration-300",
                  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                  "hover:border-foreground/20",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              />
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

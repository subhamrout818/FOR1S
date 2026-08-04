"use client";

import { useState, type FormEvent } from "react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || data.errors
          ? Object.values(data.errors ?? {}).flat().join(", ")
          : "Something went wrong");
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
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center"
          >
            <p className="text-sm text-emerald-300">
              If an account exists for <span className="font-medium">{email}</span>,
              a reset link is on its way.
            </p>
            <p className="mt-2 text-xs text-muted">
              The link expires in 15 minutes. Check your spam folder if you
              don&apos;t see it.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Back to login
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
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cn(
                  "w-full rounded-xl border border-hairline bg-background px-4 py-3",
                  "text-sm text-foreground placeholder:text-muted",
                  "transition-all duration-300",
                  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                  "hover:border-foreground/20"
                )}
              />
            </motion.div>

            <motion.div
              custom={2}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <MagneticButton
                type="submit"
                variant="solid"
                size="lg"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send reset link"}
              </MagneticButton>
            </motion.div>
          </form>
        )}

        <motion.p
          custom={3}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mt-8 text-center text-sm text-muted"
        >
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

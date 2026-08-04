"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import OAuthButtons from "@/components/auth/OAuthButtons";

const stagger = {
  initial: { opacity: 0, y: 16 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<"verified" | "invalid" | "resent" | null>(null);

  // Read one-shot banner flags from the URL (?verified=1 / ?verify=invalid).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") setBanner("verified");
    if (params.get("verify") === "invalid") setBanner("invalid");
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorCode(null);
    setLoading(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.message || "Login failed");
      setErrorCode(result.code ?? null);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setError("");
      setErrorCode(null);
      setBanner("resent");
    } catch {
      // Keep the error banner; the user can retry.
    } finally {
      setResending(false);
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
        {/* Header */}
        <motion.div
          custom={0}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Log in to your FOR1S account
          </p>
        </motion.div>

        {/* Social login */}
        <motion.div
          custom={1}
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <OAuthButtons mode="login" />
        </motion.div>

        {/* Divider */}
        <motion.div
          custom={2}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="my-6 flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-xs uppercase tracking-widest text-muted">
            or continue with email
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </motion.div>

        {/* One-shot banners */}
        <AnimatePresence>
          {banner === "verified" && (
            <motion.p
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              Email verified — you can log in now.
            </motion.p>
          )}
          {banner === "invalid" && (
            <motion.p
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-red-300"
            >
              That verification link is invalid or expired.{" "}
              <Link
                href="/forgot-password"
                className="underline underline-offset-2"
              >
                Request a new one
              </Link>
              .
            </motion.p>
          )}
          {banner === "resent" && (
            <motion.p
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              Verification email sent — check your inbox.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Form */}
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
                {errorCode === "EMAIL_NOT_VERIFIED" && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="ml-2 underline underline-offset-2 disabled:opacity-60"
                  >
                    {resending ? "Resending…" : "Resend verification email"}
                  </button>
                )}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            custom={3}
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
            custom={4}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-accent"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={cn(
                "w-full rounded-xl border border-hairline bg-background px-4 py-3",
                "text-sm text-foreground placeholder:text-muted",
                "transition-all duration-300",
                "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                "hover:border-foreground/20"
              )}
            />
          </motion.div>

          {/* Remember me */}
          <motion.div
            custom={5}
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex items-center justify-between"
          >
            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-hairline bg-background accent-[#E63946]"
              />
              Keep me signed in for 7 days
            </label>
          </motion.div>

          <motion.div
            custom={6}
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
              {loading ? "Logging in…" : "Log in"}
            </MagneticButton>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          custom={7}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mt-8 text-center text-sm text-muted"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Too many requests. Please wait a bit before trying again."
            : "Couldn't send the verification email. Please try again."
        );
        return;
      }
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
          <span className="text-xs uppercase tracking-widest text-foreground/70">
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
                href="/resend-verification"
                className="underline underline-offset-2"
              >
                Resend verification email
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
              If an unverified account matches this address, a verification email may arrive shortly. Check your inbox and spam folder; if it doesn&apos;t arrive, try again later.
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
              name="email"
              type="email"
              autoComplete="username"
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
            <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={cn(
                              "w-full rounded-xl border border-hairline bg-background py-3 pl-4 pr-12",
                              "text-sm text-foreground placeholder:text-muted",
                              "transition-all duration-300",
                              "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                              "hover:border-foreground/20"
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

"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Turnstile, { TURNSTILE_ON } from "@/components/ui/Turnstile";

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

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (TURNSTILE_ON && !captcha) {
      setError("Please wait a moment while we finish a quick security check, then try again.");
      return;
    }
    setLoading(true);

    const result = await signup(name, email, password, captcha ?? "");
    // Tokens are single-use — get a fresh one for any retry.
    setCaptcha(null);
    setCaptchaReset((n) => n + 1);

    if (result.success) {
      if (result.needsVerification) {
        // Account created but not verified — show the "check your email" state.
        setRegisteredEmail(email);
        setLoading(false);
      } else {
        // Dev mode (no email provider) — already logged in.
        router.push("/");
      }
    } else {
      setError(result.message || "Registration failed");
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
        {registeredEmail ? (
          /* Post-signup: awaiting email verification */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-hairline bg-background/60 px-6 py-10 text-center"
          >
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Check your inbox
            </h1>
            <p className="mt-3 text-sm text-muted">
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{registeredEmail}</span>.
              Click it to activate your account, then log in.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
            >
              Go to login
            </Link>
            <p className="mt-4 text-sm text-muted">
              Didn&apos;t receive it?{" "}
              <Link
                href={`/resend-verification?email=${encodeURIComponent(registeredEmail)}`}
                className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
              >
                Resend verification email
              </Link>
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div
              custom={0}
              variants={stagger}
              initial="initial"
              animate="animate"
              className="mb-8 text-center"
            >
              <h1 className="font-display text-3xl font-semibold text-foreground">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted">
                Get started with FOR1S
              </p>
            </motion.div>

            {/* Social signup */}
            <motion.div
              custom={1}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <OAuthButtons mode="signup" />
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
                or sign up with email
              </span>
              <span className="h-px flex-1 bg-hairline" />
            </motion.div>

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
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
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
                  autoComplete="email"
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
                custom={5}
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                                  <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
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

              <motion.div
                custom={6}
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <Turnstile onToken={setCaptcha} resetSignal={captchaReset} className="mb-4" />
                <MagneticButton
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {loading ? "Creating account…" : "Create account"}
                </MagneticButton>
              </motion.div>
            </form>
          </>
        )}

        {/* Footer */}
        <motion.p
          custom={7}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mt-8 text-center text-sm text-muted"
        >
          Already have an account?{" "}
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

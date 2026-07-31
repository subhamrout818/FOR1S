"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signup(name, email, password);

    if (result.success) {
      router.push("/");
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
        {/* Header */}
        <motion.div
          custom={0}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-10 text-center"
        >
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Get started with FOR1S
          </p>
        </motion.div>

        {/* Continue with Google */}
        <motion.button
          custom={1}
          variants={stagger}
          initial="initial"
          animate="animate"
          onClick={() => {}}
          className={cn(
            "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl",
            "border border-hairline bg-background px-5 py-3.5",
            "text-sm font-medium text-foreground/90 transition-all duration-300",
            "hover:border-foreground/30 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shine effect on hover */}
          <motion.span
            className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <svg viewBox="0 0 24 24" width="20" height="20" className="z-10 shrink-0">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="z-10">Sign up with Google</span>
        </motion.button>

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
              type="text"
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
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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
              {loading ? "Creating account…" : "Create account"}
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

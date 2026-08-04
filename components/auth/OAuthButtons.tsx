"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
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
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className="z-10 shrink-0" fill="currentColor">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.51v-1.78c-2.94.64-3.56-1.42-3.56-1.42-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.08-2.82-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.89 1.08a10.1 10.1 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.21 2.53.1 2.8.67.73 1.08 1.67 1.08 2.82 0 4.04-2.46 4.93-4.81 5.19.38.32.72.97.72 1.96v2.9c0 .28.19.62.73.51A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

const buttonBase = cn(
  "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl",
  "border border-hairline bg-background px-5 py-3.5",
  "text-sm font-medium text-foreground/90 transition-all duration-300",
  "hover:border-foreground/30 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
  "disabled:pointer-events-none disabled:opacity-60"
);

/** Continue-with-Google / Continue-with-GitHub buttons (login + register). */
export default function OAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const [pending, setPending] = useState<"google" | "github" | null>(null);

  const start = (provider: "google" | "github") => {
    setPending(provider);
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  return (
    <div className="grid gap-3">
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={pending !== null}
        onClick={() => start("google")}
        className={buttonBase}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <GoogleIcon />
        <span className="z-10">
          {mode === "login" ? "Continue with Google" : "Sign up with Google"}
        </span>
      </motion.button>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={pending !== null}
        onClick={() => start("github")}
        className={buttonBase}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <GithubIcon />
        <span className="z-10">
          {mode === "login" ? "Continue with GitHub" : "Sign up with GitHub"}
        </span>
      </motion.button>
    </div>
  );
}

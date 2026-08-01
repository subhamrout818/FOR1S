"use client";

import { motion } from "framer-motion";
import { forwardRef, useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "glass";
  size?: "md" | "lg";
  cursorText?: string;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    { children, className, variant = "solid", size = "md", cursorText, ...props },
    forwardedRef
  ) => {
    const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
      strength: 0.35,
    });
    const glowRef = useRef<HTMLDivElement>(null);

    // Magnetic pull + a Services-card-style radial glow that follows the cursor.
    const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      handleMouseMove(e);
      const glow = glowRef.current;
      if (glow) {
        const rect = e.currentTarget.getBoundingClientRect();
        glow.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
        glow.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
      }
    };

    return (
      <motion.button
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="view"
        data-cursor-text={cursorText ?? ""}
        style={{ x, y }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-colors duration-300",
          size === "md" ? "px-6 py-3 text-sm" : "px-8 py-4 text-base",
          variant === "solid" && "bg-accent text-white hover:bg-accent-dim",
          variant === "outline" &&
            "border border-foreground/25 text-foreground hover:border-accent hover:text-accent",
          variant === "ghost" && "text-foreground/80 hover:text-foreground",
          variant === "glass" &&
            "rounded-2xl border border-hairline bg-surface/80 text-white backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-accent/50",
          className
        )}
        {...(props as any)}
      >
        {/* Cursor-following crimson glow (glass only) — mirrors the Services cards */}
        {variant === "glass" && (
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(240px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(230,57,70,0.28), transparent 70%)",
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
export default MagneticButton;

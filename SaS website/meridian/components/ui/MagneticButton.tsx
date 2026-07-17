"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
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

    return (
      <motion.button
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="view"
        data-cursor-text={cursorText ?? ""}
        style={{ x, y }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-colors duration-300",
          size === "md" ? "px-6 py-3 text-sm" : "px-8 py-4 text-base",
          variant === "solid" &&
            "bg-accent text-white hover:bg-accent-dim",
          variant === "outline" &&
            "border border-foreground/25 text-foreground hover:border-accent hover:text-accent",
          variant === "ghost" && "text-foreground/80 hover:text-foreground",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
export default MagneticButton;

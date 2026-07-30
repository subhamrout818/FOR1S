"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlowCard({ children, className }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-hairline bg-surface",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(230,57,70,0.14), transparent 70%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

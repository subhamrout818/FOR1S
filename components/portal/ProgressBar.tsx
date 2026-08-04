import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Single-hue magnitude bar (brand accent). Clamped 0–100.
 */
export default function ProgressBar({
  value,
  className,
  barClassName,
  animate = true,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  animate?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-accent", barClassName)}
        initial={animate ? { width: 0 } : false}
        whileInView={animate ? { width: `${pct}%` } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Calendar } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

/* ─── Props ─────────────────────────────────── */

interface ActionPanelProps {
  email: string;
  calendarUrl: string;
}

/* ─── Animation variants ────────────────────── */

const panelVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto" as const,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.8, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.9,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Local magnetic action button ──────────── */

function MagneticActionButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.3,
    stiffness: 150,
    damping: 15,
  });

  return (
    <motion.a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      variants={itemVariants}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.92 }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-surface text-foreground/70 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
    >
      {icon}
    </motion.a>
  );
}

/* ─── Panel component ───────────────────────── */

export default function ActionPanel({
  email,
  calendarUrl,
}: ActionPanelProps) {
  const prefersReduced = useReducedMotion();

  // Skip animation when user prefers reduced motion
  if (prefersReduced) {
    return (
      <div className="flex items-center justify-center gap-3 pt-4">
        <MagneticActionButton
          href={`mailto:${email}`}
          label="Email"
          icon={<Mail size={18} />}
        />
        <MagneticActionButton
          href={calendarUrl}
          label="Book a call"
          icon={<Calendar size={18} />}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <motion.div
        variants={itemContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex items-center justify-center gap-3 pt-4"
      >
        <MagneticActionButton
          href={`mailto:${email}`}
          label="Email"
          icon={<Mail size={18} />}
        />
        <MagneticActionButton
          href={calendarUrl}
          label="Book a call"
          icon={<Calendar size={18} />}
        />
      </motion.div>
    </motion.div>
  );
}

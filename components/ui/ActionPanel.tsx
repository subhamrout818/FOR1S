"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Calendar } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

/* ─── Props ─────────────────────────────────── */

interface ActionPanelProps {
  whatsappUrl: string;
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

/* ─── WhatsApp inline SVG ───────────────────── */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.507 14.307l-3.81-1.62a.72.72 0 00-.937.202l-.76.958a.465.465 0 01-.534.174 6.843 6.843 0 01-3.9-3.9.468.468 0 01.174-.534l.957-.76a.72.72 0 00.202-.938l-1.62-3.81a.72.72 0 00-.958-.396l-.79.316a1.5 1.5 0 00-.92 1.25A11.52 11.52 0 0016.593 16.7a1.5 1.5 0 001.25-.92l.316-.79a.72.72 0 00-.652-.683z" />
    </svg>
  );
}

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
  whatsappUrl,
  email,
  calendarUrl,
}: ActionPanelProps) {
  const prefersReduced = useReducedMotion();

  // Skip animation when user prefers reduced motion
  if (prefersReduced) {
    return (
      <div className="flex items-center justify-center gap-3 pt-4">
        <MagneticActionButton
          href={whatsappUrl}
          label="WhatsApp"
          icon={<WhatsAppIcon />}
        />
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
          href={whatsappUrl}
          label="WhatsApp"
          icon={<WhatsAppIcon />}
        />
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

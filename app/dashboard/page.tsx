"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import {
  CreditCard,
  User,
  FileText,
  MessageSquare,
  ArrowDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Card config — real info and navigation only, no fabricated stats.  */
/* ------------------------------------------------------------------ */

interface CardDef {
  key: string;
  label: string;
  icon: typeof CreditCard;
  stat: string;
  sub: string;
  accent: string; // Tailwind ring/border colour
  bgGlow: string; // subtle rgba for shadow
  href?: string;
}

const cards: CardDef[] = [
  {
    key: "billing",
    label: "Billing",
    icon: CreditCard,
    stat: "No active plan",
    sub: "Choose a plan to get started",
    href: "/dashboard/billing",
    accent: "border-l-accent",
    bgGlow: "rgba(230,57,70,0.15)",
  },
  {
    key: "account",
    label: "Account",
    icon: User,
    stat: "Your account",
    sub: "Manage profile & security",
    href: "/dashboard/account",
    accent: "border-l-blue-500",
    bgGlow: "rgba(59,130,246,0.15)",
  },
  {
    key: "contact",
    label: "Get in touch",
    icon: MessageSquare,
    stat: "Book a call",
    sub: "Map out your build with us",
    href: "/contact",
    accent: "border-l-emerald-500",
    bgGlow: "rgba(16,185,129,0.15)",
  },
  {
    key: "blog",
    label: "Insights",
    icon: FileText,
    stat: "Read the blog",
    sub: "Notes on strategy, design & code",
    href: "/blog",
    accent: "border-l-amber-500",
    bgGlow: "rgba(245,158,11,0.15)",
  },
];

/* ------------------------------------------------------------------ */
/*  Card component                                                    */
/* ------------------------------------------------------------------ */

function DashCard({
  card,
  index,
  userName,
  userEmail,
}: {
  card: CardDef;
  index: number;
  userName: string;
  userEmail: string;
}) {
  const Icon = card.icon;
  // The account card shows real signed-in data, not a static value.
  const stat = card.key === "account" ? userName : card.stat;
  const sub = card.key === "account" ? userEmail : card.sub;

  const inner = (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", y: 24 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-hairline p-6 transition-all duration-500",
        "bg-background/60 backdrop-blur-sm",
        card.accent,
        "border-l-4"
      )}
      style={{
        boxShadow: `0 0 40px ${card.bgGlow}`,
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute -inset-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${card.bgGlow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            {card.label}
          </p>
          <p className="font-display text-3xl font-semibold text-foreground">
            {stat}
          </p>
          <p className="text-sm text-muted">{sub}</p>
        </div>

        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            "bg-white/5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
          )}
        >
          <Icon size={22} strokeWidth={1.5} className="text-foreground/70" />
        </div>
      </div>
    </motion.div>
  );

  if (card.href) {
    return (
      <Link href={card.href} data-cursor="hover" className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [splashDone, setSplashDone] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Auth guard — key on the stored token, not isAuthenticated, so a
     transient /api/auth/me network failure doesn't bounce a valid user to login. */
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  /* Splash → auto-scroll to grid */
  useEffect(() => {
    if (splashDone || !isAuthenticated) return;
    const t = setTimeout(() => {
      setSplashDone(true);
      // scroll down to the grid after splash
      requestAnimationFrame(() => {
        const lenis = (
          window as typeof window & { __lenis?: import("lenis").default }
        ).__lenis;
        if (lenis && gridRef.current) {
          lenis.scrollTo(gridRef.current, { duration: 1.8, offset: -80 });
        } else if (gridRef.current) {
          gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [splashDone, isAuthenticated]);

  if (isLoading || !token) return null;

  const firstName = user?.name?.split(" ")[0] ?? "User";

  return (
    <>
      {/* ================================================================ */}
      {/*  SPLASH                                                          */}
      {/* ================================================================ */}
      <AnimatePresence>
        {!splashDone && (
          <motion.section
            key="splash"
            exit={{ opacity: 0, filter: "blur(6px)", y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 18, mass: 1 }}
              className="mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-hairline"
            >
              <Avatar
                src={user?.profileImage}
                size={96}
                className="border-2 border-hairline"
              />
            </motion.div>

            {/* Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-semibold text-foreground md:text-5xl"
            >
              Welcome, {firstName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-3 text-sm text-muted"
            >
              {user?.email}
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Your dashboard
              </span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ArrowDown size={16} className="text-muted" />
              </motion.span>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================================================================ */}
      {/*  MAIN DASHBOARD                                                  */}
      {/* ================================================================ */}
      <div
        ref={gridRef}
        className={cn(
          "relative mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32 transition-opacity duration-700",
          splashDone ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Top bar — title + profile picture */}
        <div className="mb-14 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted">
              Welcome back, {firstName}
            </p>
          </div>

          {/* Profile picture — top right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-hairline transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_rgba(230,57,70,0.3)]"
          >
            <Avatar
              src={user?.profileImage}
              size={56}
              className="border-2 border-hairline transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        </div>

        {/* Dashboard grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <DashCard
              key={card.key}
              card={card}
              index={i}
              userName={firstName}
              userEmail={user?.email ?? ""}
            />
          ))}
        </div>
      </div>
    </>
  );
}

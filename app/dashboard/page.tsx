"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  FileText,
  Receipt,
  MessageSquare,
  ArrowDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Card config                                                       */
/* ------------------------------------------------------------------ */

interface CardDef {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  stat: string;
  sub: string;
  accent: string; // Tailwind ring/border colour
  bgGlow: string; // subtle rgba for shadow
}

const cards: CardDef[] = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    stat: "Active",
    sub: "All systems online",
    accent: "border-l-accent",
    bgGlow: "rgba(230,57,70,0.15)",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    stat: "5 ongoing",
    sub: "3 in review · 2 in dev",
    accent: "border-l-blue-500",
    bgGlow: "rgba(59,130,246,0.15)",
  },
  {
    key: "meeting",
    label: "Meeting",
    icon: CalendarCheck,
    stat: "2 today",
    sub: "3pm sprint · 4pm 1:1",
    accent: "border-l-emerald-500",
    bgGlow: "rgba(16,185,129,0.15)",
  },
  {
    key: "files",
    label: "Files",
    icon: FileText,
    stat: "24 docs",
    sub: "Shared with your team",
    accent: "border-l-amber-500",
    bgGlow: "rgba(245,158,11,0.15)",
  },
  {
    key: "invoices",
    label: "Invoices",
    icon: Receipt,
    stat: "3 due",
    sub: "Next payment in 7d",
    accent: "border-l-violet-500",
    bgGlow: "rgba(139,92,246,0.15)",
  },
  {
    key: "messages",
    label: "Messages",
    icon: MessageSquare,
    stat: "7 unread",
    sub: "From 4 conversations",
    accent: "border-l-cyan-500",
    bgGlow: "rgba(6,182,212,0.15)",
  },
];

/* ------------------------------------------------------------------ */
/*  Ghibli profile picture                                            */
/* ------------------------------------------------------------------ */

async function fetchGhibliAvatar(): Promise<string | null> {
  try {
    const res = await fetch("https://ghibliapi.vercel.app/films");
    if (!res.ok) return null;
    const films: { movie_banner?: string }[] = await res.json();
    const banners = films
      .map((f) => f.movie_banner)
      .filter((b): b is string => !!b);
    if (!banners.length) return null;
    return banners[Math.floor(Math.random() * banners.length)]!;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Card component                                                    */
/* ------------------------------------------------------------------ */

function DashCard({
  card,
  index,
}: {
  card: CardDef;
  index: number;
}) {
  const Icon = card.icon;

  return (
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
            {card.stat}
          </p>
          <p className="text-sm text-muted">{card.sub}</p>
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
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [splashDone, setSplashDone] = useState(false);
  const [ghibliUrl, setGhibliUrl] = useState<string | null>(null);
  const [ghibliLoaded, setGhibliLoaded] = useState(false);
  const [ghibliFilm, setGhibliFilm] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  /* Auth guard — key on the stored token, not isAuthenticated, so a
     transient /api/auth/me network failure doesn't bounce a valid user to login. */
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  /* Fetch Ghibli avatar on mount */
  useEffect(() => {
    fetchGhibliAvatar().then((url) => {
      if (url) {
        setGhibliUrl(url);
        // derive film name from URL for alt text
        const slug = url.split("/").pop()?.split(".")[0] ?? "";
        setGhibliFilm(slug.replace(/-/g, " "));
      }
    });
  }, []);

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
              {ghibliUrl ? (
                <img
                  src={ghibliUrl}
                  alt={ghibliFilm || "Ghibli avatar"}
                  className="h-full w-full object-cover"
                  onLoad={() => setGhibliLoaded(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
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
            {ghibliUrl ? (
              <img
                src={ghibliUrl}
                alt={ghibliFilm || "Profile"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5 text-lg font-medium text-foreground/70">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            )}
          </motion.div>
        </div>

        {/* Dashboard grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <DashCard key={card.key} card={card} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}

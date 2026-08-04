"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import UserDropdown from "@/components/layout/UserDropdown";
import {
  LayoutDashboard,
  FolderKanban,
  Film,
  MessageSquare,
  FileArchive,
  CreditCard,
  LifeBuoy,
  Settings,
  Users,
  Magnet,
  Wallet,
  UsersRound,
  ArrowUpRight,
  X,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const CLIENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/deliverables", label: "Deliverables", icon: Film },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/files", label: "Files", icon: FileArchive },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/deliverables", label: "Deliverables", icon: Film },
  { href: "/admin/leads", label: "Leads", icon: Magnet },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/team", label: "Team", icon: UsersRound },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/** Active when the route equals the item OR lives under it (not for exact "/"). */
function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export default function DashboardShell({
  variant,
  children,
}: {
  variant: "client" | "admin";
  children: React.ReactNode;
}) {
  const { user, token, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = variant === "client" ? CLIENT_NAV : ADMIN_NAV;
  const portalLabel = variant === "client" ? "Client portal" : "Studio";

  /* Auth + role guard. Keys on the stored token so a transient /me failure
     doesn't bounce a valid session. */
  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (variant === "client" && isAdmin) {
      router.replace("/admin");
      return;
    }
    if (variant === "admin" && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, token, isAdmin, variant, router]);

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  if (isLoading || !token) return null;
  if ((variant === "client" && isAdmin) || (variant === "admin" && !isAdmin)) {
    return null;
  }

  const firstName = user?.name?.split(" ")[0] ?? "User";

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-6 py-6"
        data-cursor="hover"
      >
        <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="26" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M32 6 C 20 20, 20 44, 32 58 C 44 44, 44 20, 32 6 Z"
            stroke="#E63946"
            strokeWidth="2"
          />
        </svg>
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
          FOR1S
        </span>
        <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted">
          {portalLabel}
        </span>
      </Link>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-300",
                active
                  ? "bg-white/6 text-foreground"
                  : "text-muted hover:bg-white/[0.03] hover:text-foreground"
              )}
            >
              <item.icon
                size={17}
                strokeWidth={1.5}
                className={cn(
                  "transition-colors",
                  active ? "text-accent" : "text-muted group-hover:text-foreground"
                )}
              />
              <span className="font-medium">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-hairline p-4">
        <Link
          href="/"
          data-cursor="hover"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
        >
          <span>View website</span>
          <ArrowUpRight size={15} />
        </Link>
        {variant === "client" ? (
          <p className="mt-3 px-3.5 font-mono text-[10px] uppercase tracking-widest text-muted/60">
            Hello, {firstName}
          </p>
        ) : (
          <p className="mt-3 px-3.5 font-mono text-[10px] uppercase tracking-widest text-muted/60">
            Owner workspace
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* ============ Top bar ============ */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-hairline bg-background/85 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
            >
              {open ? <X size={18} /> : <LayoutDashboard size={18} />}
            </button>
            <Link href="/" data-cursor="hover" className="lg:hidden">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
                FOR1S
              </span>
            </Link>
          </div>
          <UserDropdown />
        </div>
      </header>

      {/* ============ Sidebar (desktop) ============ */}
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 border-r border-hairline bg-background/40 lg:block">
        {sidebar}
      </aside>

      {/* ============ Sidebar (mobile drawer) ============ */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed bottom-0 left-0 top-16 z-40 w-72 border-r border-hairline bg-background lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============ Main ============ */}
      <main className="pt-16 lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-8">{children}</div>
      </main>
    </div>
  );
}

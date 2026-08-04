"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  Settings,
  User,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const items = [
    {
      label: isAdmin ? "Admin" : "Dashboard",
      href: isAdmin ? "/admin" : "/dashboard",
      icon: isAdmin ? LayoutDashboard : User,
    },
    ...(isAdmin
      ? [{ label: "Settings", href: "/admin/settings", icon: Settings }]
      : [
          { label: "Account", href: "/dashboard/account", icon: User },
          { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
        ]),
    { label: "Log out", href: null, icon: LogOut, action: "logout" as const },
  ] as const;

  const firstName = user?.name?.split(" ")[0] ?? "User";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleClick = (item: (typeof items)[number]) => {
    setOpen(false);
    if ("action" in item && item.action === "logout") {
      logout();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-all duration-300",
          "hover:text-foreground hover:bg-white/5",
          open && "text-foreground bg-white/5"
        )}
      >
        <Avatar src={user?.profileImage} size={28} />
        <span className="font-medium">{firstName}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 32,
              mass: 0.8,
            }}
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-hairline",
              "bg-background/80 backdrop-blur-2xl shadow-2xl shadow-black/40"
            )}
          >
            <div className="py-1.5">
              {items.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => handleClick(item)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-all duration-200",
                    "text-muted hover:text-foreground",
                    "action" in item && item.action === "logout"
                      ? "hover:text-red-400"
                      : "hover:bg-white/5"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

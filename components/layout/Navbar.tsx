"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { BRAND, NAV_LINKS } from "@/lib/data";
import { cn, scrollToHash } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import MagneticButton from "@/components/ui/MagneticButton";
import UserDropdown from "@/components/layout/UserDropdown";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 240 && !menuOpen);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);

    if (pathname === "/") {
      // Already on the home page — smooth-scroll with Lenis
      scrollToHash(href);
    } else {
      // Navigate to the home page with the hash so the section comes into view
      router.push("/" + href);
    }
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          scrolled
            ? "border-hairline bg-background/75 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-12">
          <button
            onClick={() => handleNavClick("#hero")}
            data-cursor="hover"
            className="flex items-center gap-2.5"
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
              {BRAND.name}
            </span>
          </button>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                data-cursor="hover"
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <MagneticButton
                  variant="solid"
                  size="md"
                  cursorText="Go"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </MagneticButton>
                <UserDropdown />
              </>
            ) : (
              <>
                <MagneticButton
                  variant="outline"
                  size="md"
                  cursorText="Go"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </MagneticButton>
                <MagneticButton
                  variant="solid"
                  size="md"
                  cursorText="Go"
                  onClick={() => router.push("/register")}
                >
                  Sign up
                </MagneticButton>
              </>
            )}
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col gap-1.5 md:hidden"
          >
            <span
              className={cn(
                "h-px w-6 bg-foreground transition-transform duration-300",
                menuOpen && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-foreground transition-transform duration-300",
                menuOpen && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-8 bg-background px-8 md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavClick(link.href)}
                className="text-left font-display text-4xl font-semibold text-foreground"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * NAV_LINKS.length, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              {isAuthenticated ? (
                <>
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <span className="text-lg">👤</span>
                    <span className="text-foreground">{user?.name}</span>
                  </p>
                  <MagneticButton
                    variant="solid"
                    size="lg"
                    onClick={() => { router.push("/dashboard"); setMenuOpen(false); }}
                  >
                    Dashboard
                  </MagneticButton>
                  <MagneticButton
                    variant="outline"
                    size="lg"
                    onClick={() => { router.push("/dashboard"); setMenuOpen(false); }}
                  >
                    Account
                  </MagneticButton>
                  <MagneticButton
                    variant="outline"
                    size="lg"
                    onClick={() => { router.push("/dashboard/billing"); setMenuOpen(false); }}
                  >
                    Billing
                  </MagneticButton>
                  <MagneticButton
                    variant="ghost"
                    size="lg"
                    onClick={() => { logout(); setMenuOpen(false); }}
                  >
                    Log out
                  </MagneticButton>
                </>
              ) : (
                <>
                  <MagneticButton
                    variant="outline"
                    size="lg"
                    onClick={() => { router.push("/login"); setMenuOpen(false); }}
                  >
                    Log in
                  </MagneticButton>
                  <MagneticButton
                    variant="solid"
                    size="lg"
                    onClick={() => { router.push("/register"); setMenuOpen(false); }}
                  >
                    Sign up
                  </MagneticButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

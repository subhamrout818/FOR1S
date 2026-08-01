"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/members";

/**
 * Member profile page. Shows the member's photo as a low-opacity overlay
 * background (so the site's dark theme stays visible), plays a dashboard-style
 * splash (photo + name) and then eases into their story.
 */
export default function MemberStory({ member }: { member: Member }) {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Photo overlay background — low opacity, theme shows through */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src={member.image}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-[0.16] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/25 to-background" />
      </div>

      {/* Splash — profile first, then ease into the page */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, filter: "blur(6px)", y: -30 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-background px-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="h-28 w-28 overflow-hidden rounded-full border-2 border-hairline"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-4xl font-semibold text-foreground md:text-5xl"
            >
              {member.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-3 font-mono text-xs uppercase tracking-widest text-muted"
            >
              {member.role}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-32 transition-opacity duration-700",
          splashDone ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <Link
          href="/#members"
          data-cursor="hover"
          className="mb-14 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-accent"
        >
          <ArrowLeft size={14} />
          Back to the team
        </Link>

        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {member.role}
        </p>
        <h1 className="mt-4 font-display text-fluid-lg font-semibold uppercase leading-[0.98] tracking-tightest text-foreground">
          {member.name}
        </h1>

        <div className="mt-10 space-y-6 border-t border-hairline pt-10 text-base leading-relaxed text-foreground/80">
          {member.story.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

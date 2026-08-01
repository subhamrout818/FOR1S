'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SectionLabel from "@/components/ui/SectionLabel";

/* ---------- Types ---------- */

interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  image: string;
}

/* ---------- Data ---------- */

const TEAM: TeamMember[] = [
  {
    id: "01",
    slug: "subham-rout",
    name: "Subham Rout",
    role: "Founder & Frontend",
    image: "/subham.jpg",
  },
  {
    id: "04",
    slug: "tanuj-joshi",
    name: "Tanuj Joshi",
    role: "Marketing",
    image: "/tanuj.jpg",
  },
];

/* ---------- Main Component ---------- */

export default function TeamSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position resources (Global for the floating card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics for the floating card
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Detect mobile for conditional rendering logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    // Offset the cursor card so it doesn't block the text
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  return (
    <div
      id="members"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full cursor-default bg-neutral-950 px-6 py-24 text-neutral-200 md:px-12"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />

      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
          <SectionLabel scene="06" title="Members" className="mb-6" />
            <h1 className="text-4xl font-light tracking-tighter text-white sm:text-6xl md:text-8xl">
              Built <span className="text-neutral-600">By</span>
            </h1>
          </div>
          <div className="h-px flex-1 bg-neutral-900 mx-8 hidden md:block" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Founding Team
          </p>
        </motion.header>

        {/* The List — each bar is a clickable link to the member's page */}
        <div className="flex flex-col">
          {TEAM.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Global Floating Cursor Image */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative h-64 w-80 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
              >
                <Image
                  src={TEAM.find((t) => t.id === activeId)!.image}
                  alt="Preview"
                  fill
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-white/80">Active</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component (whole bar is clickable) ---------- */

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: {
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}) {
  const isDimmed = isAnyActive && !isActive;
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDimmed ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => router.push(`/team/${data.slug}`)}
      data-cursor="view"
      data-cursor-text="View"
      className="group relative cursor-pointer border-t border-neutral-900 transition-colors duration-500 last:border-b"
    >
      <div className="relative z-10 flex flex-col py-8 md:flex-row md:items-center md:justify-between md:py-12">
        {/* Name & Index Section */}
        <div className="flex items-baseline gap-6 pl-4 md:gap-12 md:pl-0 transition-transform duration-500 group-hover:translate-x-4">
          <span className="font-mono text-xs text-neutral-600">
            0{index + 1}
          </span>
          <h2 className="text-3xl font-medium tracking-tight text-neutral-400 transition-colors duration-300 group-hover:text-white md:text-6xl">
            {data.name}
          </h2>
        </div>

        {/* Role & Icon Section */}
        <div className="mt-4 flex items-center justify-between pl-12 pr-4 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-neutral-400">
            {data.role}
          </span>

          {/* Desktop Arrow */}
          <motion.div
            animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
            className="hidden text-white md:block"
          >
            <ArrowUpRight size={28} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

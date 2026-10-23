'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SectionLabel from "@/components/ui/SectionLabel";
import { MEMBERS } from "@/lib/members";

interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  image?: string;
}

const TEAM: TeamMember[] = MEMBERS.map((member, index) => ({
  id: String(index + 1).padStart(2, "0"),
  slug: member.slug,
  name: member.name,
  role: member.role,
  image: member.image,
}));

export default function TeamSection() {
  const [showOtherMembers, setShowOtherMembers] = useState(false);

  return (
    <section
      id="members"
      className="relative w-full cursor-default bg-neutral-950 px-6 py-14 text-neutral-200 md:px-12 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <SectionLabel scene="06" title="Team" className="mb-4" />
            <h2 className="text-4xl font-light tracking-tighter text-white sm:text-6xl md:text-8xl">
              Built <span className="text-neutral-600">By</span>
            </h2>
          </div>
          <div className="mx-8 hidden h-px flex-1 bg-neutral-900 md:block" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            FOR1S Team
          </p>
        </motion.header>

        <div className="flex flex-col">
          <TeamRow data={TEAM[0]!} index={0} primary />

          <div className="flex justify-end border-t border-neutral-900 py-3">
            <button
              type="button"
              aria-expanded={showOtherMembers}
              aria-controls="other-team-members"
              onClick={() => setShowOtherMembers((visible) => !visible)}
              className="group inline-flex items-center gap-3 px-2 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-400"
            >
              <span>{showOtherMembers ? "Hide other members" : "Other members"}</span>
              <motion.span
                animate={{ rotate: showOtherMembers ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="inline-flex"
              >
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </motion.span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showOtherMembers && (
              <motion.div
                id="other-team-members"
                key="other-team-members"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-1 pt-1">
                  <p className="mb-2 pl-4 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-600 md:pl-0">
                    Team
                  </p>
                  {TEAM.slice(1).map((member, index) => (
                    <TeamRow key={member.id} data={member} index={index + 1} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function TeamRow({
  data,
  index,
  primary = false,
}: {
  data: TeamMember;
  index: number;
  primary?: boolean;
}) {
  const router = useRouter();

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={() => router.push(`/team/${data.slug}`)}
      data-cursor="view"
      data-cursor-text="View"
      className={`group relative w-full cursor-pointer border-t border-neutral-900 text-left transition-colors duration-500 last:border-b ${primary ? "bg-white/[0.015]" : ""}`}
    >
      <span className={`relative z-10 flex flex-col md:flex-row md:items-center md:justify-between ${primary ? "py-6 md:py-9" : "py-4 md:py-5"}`}>
        <span className={`flex items-baseline gap-4 pl-4 transition-transform duration-500 group-hover:translate-x-2 md:gap-8 md:pl-0 ${primary ? "" : "md:pl-3"}`}>
          <span className={`font-mono ${primary ? "text-xs text-red-500/80" : "text-[10px] text-neutral-600"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`font-medium tracking-tight transition-colors duration-300 group-hover:text-white ${primary ? "text-3xl text-neutral-100 sm:text-4xl md:text-6xl" : "text-xl text-neutral-400 sm:text-2xl md:text-3xl"}`}>
            {data.name}
          </span>
        </span>

        <span className={`mt-2 flex items-center justify-between pl-10 pr-4 md:mt-0 md:justify-end md:gap-8 md:pl-0 md:pr-1 ${primary ? "md:pr-0" : "md:pr-1"}`}>
          <span className={`font-medium uppercase tracking-[0.18em] transition-colors group-hover:text-neutral-200 ${primary ? "text-xs text-neutral-300 sm:text-sm" : "text-[10px] text-neutral-500 sm:text-xs"}`}>
            {data.role}
          </span>
          <span className={`text-white/80 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${primary ? "" : "opacity-60"}`}>
            <ArrowUpRight size={primary ? 24 : 18} strokeWidth={1.5} />
          </span>
        </span>
      </span>
    </motion.button>
  );
}

"use client";

import Link from "next/link";
import PageHeader from "@/components/portal/PageHeader";
import { MEMBERS } from "@/lib/members";
import { useAuth } from "@/lib/auth-context";

export default function AdminTeamPage() {
  const { isLoading } = useAuth();

  // Client-gated like every other admin page — the data APIs enforce the role
  // server-side, this just prevents anonymous visitors from seeing the shell.
  if (isLoading) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Team"
        title="The studio"
        sub="The people behind every project."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((m) => (
          <div
            key={m.slug}
            className="group overflow-hidden rounded-2xl border border-hairline bg-background/60 transition-colors hover:border-accent/40"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.image}
                alt={m.name}
                className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="font-display text-lg font-semibold text-foreground">{m.name}</p>
              <p className="text-sm text-accent">{m.role}</p>
              <Link
                href={`/team/${m.slug}`}
                data-cursor="hover"
                className="mt-3 inline-block text-xs uppercase tracking-widest text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                View profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

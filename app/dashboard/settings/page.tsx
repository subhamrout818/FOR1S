"use client";

import Link from "next/link";
import { ArrowUpRight, Bell, Check, KeyRound, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Reveal from "@/components/portal/Reveal";
import PageHeader from "@/components/portal/PageHeader";
import Avatar from "@/components/ui/Avatar";

export default function SettingsPage() {
  const { user } = useAuth();

  const provider = user?.provider ?? "credentials";
  const googleLinked = provider === "google";
  const githubLinked = provider === "github";

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        sub="Your profile, security, connections and preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Reveal>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <UserIcon size={14} className="text-accent" /> Profile
            </p>
            <div className="mt-5 flex items-center gap-4">
              <Avatar src={user?.profileImage} size={56} className="border-2 border-hairline" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-sm text-muted">{user?.email}</p>
                {user?.company && (
                  <p className="truncate text-xs text-muted">{user.company}</p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">
              Update your name, photo, email and password in one place.
            </p>
            <Link
              href="/dashboard/account"
              data-cursor="hover"
              className="group mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
            >
              Manage profile &amp; security
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Connections */}
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <KeyRound size={14} className="text-accent" /> Connections
            </p>
            <div className="mt-5 space-y-3">
              {[
                { name: "Google", linked: googleLinked },
                { name: "GitHub", linked: githubLinked },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-xl border border-hairline bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  {c.linked ? (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                      <Check size={12} /> Connected
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Not linked
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Linking Google or GitHub lets you sign in without a password.
              {provider !== "credentials" && " You're currently signed in via one of them."}
            </p>
          </div>
        </Reveal>

        {/* Security */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <ShieldCheck size={14} className="text-accent" /> Security
            </p>
            <p className="mt-5 text-sm text-muted">
              {user?.hasPassword
                ? "You have a password set. Change it or add two-factor anytime."
                : "You signed in without a password. Set one to enable email changes and password sign-in."}
            </p>
            <Link
              href="/dashboard/account"
              data-cursor="hover"
              className="group mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
            >
              Password settings
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Notifications */}
        <Reveal delay={0.15}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <Bell size={14} className="text-accent" /> Notifications
            </p>
            <div className="mt-5 space-y-3">
              {[
                "New deliveries",
                "Approval reminders",
                "Invoice & payment updates",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <span className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Email notifications aren&apos;t wired up yet. Everything still
              shows up here in your workspace the moment it happens.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

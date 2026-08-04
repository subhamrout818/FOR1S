"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Reveal from "@/components/portal/Reveal";
import PageHeader from "@/components/portal/PageHeader";
import Avatar from "@/components/ui/Avatar";
import { CONTACT } from "@/lib/contact";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Studio settings"
        sub="Business details, owner access and workspace management."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Owner */}
        <Reveal>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <UserIcon size={14} className="text-accent" /> Owner profile
            </p>
            <div className="mt-5 flex items-center gap-4">
              <Avatar src={user?.profileImage} size={56} className="border-2 border-hairline" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-sm text-muted">{user?.email}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  <ShieldCheck size={12} /> Admin
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/account"
              data-cursor="hover"
              className="group mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
            >
              Manage account
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Business info */}
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
              <Building2 size={14} className="text-accent" /> Business
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
                <span className="text-muted">Email</span>
                <span className="text-foreground">{CONTACT.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
                <span className="text-muted">Bookings</span>
                <span className="text-foreground">{CONTACT.calendar}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Workspace</span>
                <span className="text-foreground">Client portal</span>
              </div>
            </div>
            <p className="mt-auto pt-5 text-xs text-muted">
              Clients see a separate dashboard — this studio view stays yours.
            </p>
          </div>
        </Reveal>

        {/* Quick management */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground">
              Workspace shortcuts
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Clients", href: "/admin/clients" },
                { label: "Deliverables", href: "/admin/deliverables" },
                { label: "Leads", href: "/admin/leads" },
                { label: "Payments", href: "/admin/payments" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="hover"
                  className="group flex items-center justify-between rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 transition-colors hover:border-accent/40"
                >
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <ArrowUpRight
                    size={15}
                    className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

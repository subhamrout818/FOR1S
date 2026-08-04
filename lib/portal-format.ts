/* ------------------------------------------------------------------ */
/*  Client-safe formatting + status metadata for the portal            */
/* ------------------------------------------------------------------ */

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function formatDate(
  iso: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }
): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", opts);
}

/** "Aug 08" — used on upcoming rows and deadlines. */
export function formatDayMonth(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export function timeAgo(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

/* ------------------------------------------------------------------ */
/*  Status metadata — colour is always paired with a text label        */
/* ------------------------------------------------------------------ */

export interface StatusMeta {
  label: string;
  cls: string; // tailwind pill classes
}

const pill = (border: string, bg: string, text: string) =>
  `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${border} ${bg} ${text}`;

export const DELIVERABLE_STATUS: Record<string, StatusMeta> = {
  draft: { label: "Draft", cls: pill("border-hairline", "bg-white/5", "text-muted") },
  "in-review": {
    label: "Ready for review",
    cls: pill("border-blue-500/30", "bg-blue-500/10", "text-blue-400"),
  },
  "changes-requested": {
    label: "Changes requested",
    cls: pill("border-amber-500/30", "bg-amber-500/10", "text-amber-400"),
  },
  approved: {
    label: "Approved",
    cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400"),
  },
  delivered: {
    label: "Delivered",
    cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400"),
  },
};

export const INVOICE_STATUS: Record<string, StatusMeta> = {
  paid: { label: "Paid", cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400") },
  pending: { label: "Due", cls: pill("border-amber-500/30", "bg-amber-500/10", "text-amber-400") },
  overdue: { label: "Overdue", cls: pill("border-accent/40", "bg-accent/10", "text-accent") },
  cancelled: { label: "Cancelled", cls: pill("border-hairline", "bg-white/5", "text-muted") },
};

export const TICKET_STATUS: Record<string, StatusMeta> = {
  open: { label: "Open", cls: pill("border-amber-500/30", "bg-amber-500/10", "text-amber-400") },
  replied: { label: "Replied", cls: pill("border-blue-500/30", "bg-blue-500/10", "text-blue-400") },
  closed: { label: "Closed", cls: pill("border-hairline", "bg-white/5", "text-muted") },
};

export const MILESTONE_STATUS: Record<string, StatusMeta> = {
  completed: { label: "Done", cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400") },
  "in-progress": { label: "In progress", cls: pill("border-blue-500/30", "bg-blue-500/10", "text-blue-400") },
  upcoming: { label: "Upcoming", cls: pill("border-hairline", "bg-white/5", "text-muted") },
};

export const PROJECT_STATUS: Record<string, StatusMeta> = {
  active: { label: "In progress", cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400") },
  paused: { label: "Paused", cls: pill("border-amber-500/30", "bg-amber-500/10", "text-amber-400") },
  completed: { label: "Completed", cls: pill("border-hairline", "bg-white/5", "text-muted") },
};

export const LEAD_STATUS: Record<string, StatusMeta> = {
  new: { label: "New", cls: pill("border-blue-500/30", "bg-blue-500/10", "text-blue-400") },
  contacted: { label: "Contacted", cls: pill("border-amber-500/30", "bg-amber-500/10", "text-amber-400") },
  qualified: { label: "Qualified", cls: pill("border-violet-500/30", "bg-violet-500/10", "text-violet-400") },
  won: { label: "Won", cls: pill("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-400") },
  lost: { label: "Lost", cls: pill("border-hairline", "bg-white/5", "text-muted") },
};

export const KIND_LABEL: Record<string, string> = {
  reel: "Reel",
  photo: "Photos",
  design: "Design",
  video: "Video",
  website: "Website",
  document: "Document",
  other: "Other",
};

export const FOLDER_KIND_LABEL: Record<string, string> = {
  brand: "Brand assets",
  raw: "Raw footage",
  final: "Final exports",
  documents: "Documents",
  general: "Files",
};

export function metaFor(map: Record<string, StatusMeta>, key: string): StatusMeta {
  return (
    map[key] ?? {
      label: key.replace(/-/g, " "),
      cls: pill("border-hairline", "bg-white/5", "text-muted"),
    }
  );
}

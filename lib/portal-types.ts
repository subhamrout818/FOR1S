/* ------------------------------------------------------------------ */
/*  Client-side types mirroring the portal / admin API responses.      */
/* ------------------------------------------------------------------ */

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  status: string;
  progress: number;
  value: number;
  currency: string;
  nextDeadline: string | null;
  endsAt: string | null;
  createdAt: string;
  milestones: MilestoneItem[];
  deliverables: DeliverableItem[];
  folders: FolderWithFiles[];
  stats: {
    total: number;
    done: number;
    pendingReviews: number;
    totalPaid: number;
    totalValue: number;
  };
}

export interface MilestoneItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  completedAt: string | null;
}

export interface DeliverableItem {
  id: string;
  title: string;
  kind: string;
  status: string;
  version: number;
  dueAt: string | null;
  deliveredAt: string | null;
  commentsCount?: number;
  project?: { id: string; name: string; slug: string };
}

export interface FolderWithFiles {
  id: string;
  name: string;
  kind: string;
  files: FileItem[];
  project?: { id: string; name: string; slug: string };
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  mimeType: string | null;
  size: number | null;
  kind: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  number: string;
  projectId: string | null;
  description: string;
  amount: number;
  status: string;
  dueDate: string | null;
  issuedAt: string;
  paid?: number;
  client?: { id: string; name: string; email: string };
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  detail: string | null;
  createdAt: string;
  project: { id: string; name: string; slug: string } | null;
  /** Present in the admin workspace, absent for the client feed. */
  actor?: { id: string; name: string } | null;
}

export interface TicketItem {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
}

export interface ThreadItem {
  id: string;
  title: string;
  kind: string;
  status: string;
  version: number;
  commentsCount: number;
  href: string;
  project: { id: string; name: string; slug: string };
}

export interface WorkspaceData {
  user: { id: string; name: string; email: string; company: string | null; profileImage: string | null };
  projects: ProjectSummary[];
  activeProject: ProjectSummary | null;
  needsAttention: {
    reviews: DeliverableItem[];
    outstanding: InvoiceItem[];
  };
  upcoming: Array<{
    date: string;
    title: string;
    kind: string;
    href: string;
    project: string;
  }>;
  activity: ActivityItem[];
  invoices: InvoiceItem[];
  billing: { totalValue: number; paid: number; remaining: number };
  folders: FolderWithFiles[];
  threads: ThreadItem[];
  tickets: TicketItem[];
}

export interface DeliverableDetail {
  id: string;
  title: string;
  kind: string;
  status: string;
  description: string | null;
  mediaUrl: string | null;
  posterUrl: string | null;
  version: number;
  dueAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  project: { id: string; name: string; slug: string };
  versions: Array<{
    id: string;
    version: number;
    status: string;
    note: string | null;
    mediaUrl: string | null;
    posterUrl: string | null;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    body: string;
    createdAt: string;
    author: { id: string; name: string; profileImage: string | null; isAdmin: boolean };
  }>;
}

export interface AdminWorkspace {
  metrics: {
    revenueThisMonth: number;
    outstanding: number;
    activeClients: number;
    activeProjects: number;
    pendingApprovals: number;
    upcomingDeadlines: number;
    newLeads: number;
    totalClients: number;
    totalUsers: number;
  };
  clients: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    profileImage: string | null;
    createdAt: string;
    projectsCount: number;
    activeProjectsCount: number;
    totalValue: number;
    paid: number;
    outstanding: number;
  }>;
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    progress: number;
    value: number;
    nextDeadline: string | null;
    client: { id: string; name: string; email: string };
    deliverablesCount: number;
    approvedCount: number;
  }>;
  deliverables: Array<{
    id: string;
    title: string;
    kind: string;
    status: string;
    version: number;
    dueAt: string | null;
    project: { id: string; name: string; slug: string };
    client: { id: string; name: string };
  }>;
  leads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    budget: string | null;
    service: string | null;
    source: string | null;
    status: string;
    notes: string | null;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    reference: string | null;
    status: string;
    paidAt: string;
    invoice: { number: string; description: string };
    user: { id: string; name: string; email: string };
  }>;
  invoices: InvoiceItem[];
  tickets: TicketItem[];
  recentActivity: ActivityItem[];
}

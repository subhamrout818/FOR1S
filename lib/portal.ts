import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Auth helper                                                        */
/* ------------------------------------------------------------------ */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string | null;
  profileImage: string | null;
}

/** Resolve the authenticated user (no password) from a Bearer token. */
export async function requireAuth(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
      profileImage: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Serialization helpers                                              */
/* ------------------------------------------------------------------ */

/** Prisma Decimal → number (so responses stay JSON-safe). */
export function money(
  n: { toString(): string } | number | null | undefined
): number {
  if (n == null) return 0;
  return typeof n === "number" ? n : Number(n.toString());
}

export function hasDatePassed(iso: string | null | undefined): boolean {
  return !!iso && new Date(iso).getTime() < Date.now();
}

/** Invoice status with "overdue" computed at read time. */
export function invoiceStatus(inv: {
  status: string;
  dueDate: string | Date | null;
}): string {
  if (inv.status === "pending" && hasDatePassed(inv.dueDate as string | null)) {
    return "overdue";
  }
  return inv.status;
}

/* ------------------------------------------------------------------ */
/*  Client workspace — the entire portal for one signed-in client      */
/* ------------------------------------------------------------------ */

export async function getClientWorkspace(userId: string) {
  const [user, projects, invoices, tickets, activities, folders] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          profileImage: true,
        },
      }),
      prisma.project.findMany({
        where: { clientId: userId },
        orderBy: { updatedAt: "desc" },
        include: {
          milestones: { orderBy: { sortOrder: "asc" } },
          deliverables: {
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { comments: true } } },
          },
          folders: { include: { files: { orderBy: { createdAt: "desc" } } } },
          invoices: true,
        },
      }),
      prisma.invoice.findMany({
        where: { userId },
        orderBy: { issuedAt: "desc" },
        include: { payments: true },
      }),
      prisma.supportTicket.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.activityEvent.findMany({
        where: {
          OR: [{ actorId: userId }, { project: { clientId: userId } }],
        },
        orderBy: { createdAt: "desc" },
        take: 14,
        include: {
          project: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.folder.findMany({
        where: { project: { clientId: userId } },
        orderBy: { name: "asc" },
        include: {
          project: { select: { id: true, name: true, slug: true } },
          files: { orderBy: { createdAt: "desc" } },
        },
      }),
    ]);

  if (!user) return null;

  // ---- Projects ----------------------------------------------------
  const projectsSerialized = projects.map((p) => {
    const total = p.deliverables.length;
    const done = p.deliverables.filter((d) =>
      ["approved", "delivered"].includes(d.status)
    ).length;
    const pendingReviews = p.deliverables.filter((d) =>
      ["in-review", "changes-requested"].includes(d.status)
    ).length;
    const totalPaid = p.invoices.reduce(
      (acc, i) => (i.status === "paid" ? acc + money(i.amount) : acc),
      0
    );
    const totalValue = p.invoices.reduce(
      (acc, i) => acc + money(i.amount),
      0
    );

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      status: p.status,
      progress: p.progress,
      value: money(p.value),
      currency: p.currency,
      nextDeadline: p.nextDeadline,
      endsAt: p.endsAt,
      createdAt: p.createdAt,
      milestones: p.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        dueDate: m.dueDate,
        status: m.status,
        completedAt: m.completedAt,
      })),
      deliverables: p.deliverables.map((d) => ({
        id: d.id,
        title: d.title,
        kind: d.kind,
        status: d.status,
        version: d.version,
        dueAt: d.dueAt,
        deliveredAt: d.deliveredAt,
        commentsCount: d._count.comments,
      })),
      folders: p.folders.map((f) => ({
        id: f.id,
        name: f.name,
        kind: f.kind,
        files: f.files.map((file) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          mimeType: file.mimeType,
          size: file.size,
          kind: file.kind,
          createdAt: file.createdAt,
        })),
      })),
      stats: { total, done, pendingReviews, totalPaid, totalValue },
    };
  });

  const activeProject =
    projectsSerialized.find((p) => p.status === "active") ??
    projectsSerialized[0] ??
    null;

  // ---- Invoices + billing ------------------------------------------
  const invoicesSerialized = invoices.map((i) => ({
    id: i.id,
    number: i.number,
    projectId: i.projectId,
    description: i.description,
    amount: money(i.amount),
    status: invoiceStatus(i),
    dueDate: i.dueDate,
    issuedAt: i.issuedAt,
    paid: money(
      i.payments
        .filter((p) => p.status === "completed")
        .reduce((acc, p) => acc + money(p.amount), 0)
    ),
  }));

  const totalValue = projectsSerialized.reduce((a, p) => a + (p.value || 0), 0);
  const paid = invoicesSerialized.reduce(
    (a, i) => (i.status === "paid" ? a + i.amount : a),
    0
  );

  // ---- Needs attention ---------------------------------------------
  const reviews = projectsSerialized.flatMap((p) =>
    p.deliverables
      .filter((d) => ["in-review", "changes-requested"].includes(d.status))
      .map((d) => ({ ...d, project: { id: p.id, name: p.name, slug: p.slug } }))
  );
  const outstanding = invoicesSerialized.filter((i) =>
    ["pending", "overdue"].includes(i.status)
  );

  // ---- Upcoming ----------------------------------------------------
  const upcoming = projectsSerialized
    .flatMap((p) => [
      ...p.milestones
        .filter(
          (m) =>
            m.status !== "completed" &&
            new Date(m.dueDate).getTime() > Date.now() - 24 * 60 * 60 * 1000
        )
        .map((m) => ({
          date: m.dueDate,
          title: m.title,
          kind: "milestone",
          href: `/dashboard/projects/${p.slug}`,
          project: p.name,
        })),
      ...p.deliverables
        .filter(
          (d) => d.dueAt && new Date(d.dueAt).getTime() > Date.now()
        )
        .map((d) => ({
          date: d.dueAt!,
          title: `${d.title} delivery`,
          kind: "deliverable",
          href: `/dashboard/deliverables/${d.id}`,
          project: p.name,
        })),
    ])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  // ---- Messages / threads ------------------------------------------
  const commentThreads = projectsSerialized.flatMap((p) =>
    p.deliverables
      .filter((d) => d.commentsCount > 0)
      .map((d) => ({
        id: d.id,
        title: d.title,
        kind: d.kind,
        status: d.status,
        version: d.version,
        commentsCount: d.commentsCount,
        href: `/dashboard/deliverables/${d.id}`,
        project: { id: p.id, name: p.name, slug: p.slug },
      }))
  );

  // ---- Files -------------------------------------------------------
  const foldersSerialized = folders.map((f) => ({
    id: f.id,
    name: f.name,
    kind: f.kind,
    project: { id: f.project.id, name: f.project.name, slug: f.project.slug },
    files: f.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      mimeType: file.mimeType,
      size: file.size,
      kind: file.kind,
      createdAt: file.createdAt,
    })),
  }));

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      profileImage: user.profileImage,
    },
    projects: projectsSerialized,
    activeProject,
    needsAttention: { reviews, outstanding },
    upcoming,
    activity: activities.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      detail: a.detail,
      createdAt: a.createdAt,
      project: a.project
        ? { id: a.project.id, name: a.project.name, slug: a.project.slug }
        : null,
    })),
    invoices: invoicesSerialized,
    billing: { totalValue, paid, remaining: totalValue - paid },
    folders: foldersSerialized,
    threads: commentThreads,
    tickets: tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Deliverable detail                                                 */
/* ------------------------------------------------------------------ */

export async function getDeliverableDetail(deliverableId: string, userId: string) {
  const deliverable = await prisma.deliverable.findFirst({
    where: { id: deliverableId, project: { clientId: userId } },
    include: {
      project: { select: { id: true, name: true, slug: true } },
      versions: { orderBy: { version: "asc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, profileImage: true, role: true } } },
      },
    },
  });
  if (!deliverable) return null;

  return {
    id: deliverable.id,
    title: deliverable.title,
    kind: deliverable.kind,
    status: deliverable.status,
    description: deliverable.description,
    mediaUrl: deliverable.mediaUrl,
    posterUrl: deliverable.posterUrl,
    version: deliverable.version,
    dueAt: deliverable.dueAt,
    deliveredAt: deliverable.deliveredAt,
    createdAt: deliverable.createdAt,
    project: deliverable.project,
    versions: deliverable.versions,
    comments: deliverable.comments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      author: {
        id: c.author.id,
        name: c.author.name,
        profileImage: c.author.profileImage,
        isAdmin: c.author.role === "admin",
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Admin workspace                                                    */
/* ------------------------------------------------------------------ */

export async function getAdminWorkspace() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    payments,
    invoices,
    projects,
    clients,
    leads,
    tickets,
    deliverables,
    activity,
    users,
  ] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      take: 50,
      include: {
        invoice: { select: { number: true, description: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.invoice.findMany({
      orderBy: { issuedAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        deliverables: { select: { id: true, status: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "client" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        profileImage: true,
        createdAt: true,
      },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.deliverable.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: {
        project: {
          select: { id: true, name: true, slug: true, client: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.activityEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        project: { select: { id: true, name: true, slug: true } },
        actor: { select: { id: true, name: true } },
      },
    }),
    prisma.user.count(),
  ]);

  // Revenue this month = completed payments in the current calendar month.
  const revenueThisMonth = payments
    .filter((p) => p.status === "completed" && p.paidAt >= startOfMonth)
    .reduce((acc, p) => acc + money(p.amount), 0);

  const outstanding = invoices
    .filter((i) =>
      ["pending", "overdue"].includes(invoiceStatus(i))
    )
    .reduce((acc, i) => acc + money(i.amount), 0);

  const pendingApprovals = deliverables.filter((d) =>
    ["in-review", "changes-requested"].includes(d.status)
  ).length;

  const upcomingDeadlines = projects.filter((p) => {
    const d = p.nextDeadline ? new Date(p.nextDeadline).getTime() : 0;
    return d > Date.now();
  }).length;

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const activeClients = projects
    .filter((p) => p.status === "active")
    .reduce((acc, p) => acc.add(p.clientId), new Set<string>()).size;

  const newLeads = leads.filter((l) => l.createdAt >= startOfMonth).length;

  // Per-client rollups
  const clientMap = new Map(
    clients.map((c) => [
      c.id,
      {
        ...c,
        projectsCount: 0,
        activeProjectsCount: 0,
        totalValue: 0,
        paid: 0,
        outstanding: 0,
      },
    ])
  );
  for (const p of projects) {
    const row = clientMap.get(p.clientId);
    if (!row) continue;
    row.projectsCount += 1;
    if (p.status === "active") row.activeProjectsCount += 1;
    row.totalValue += money(p.value);
  }
  for (const i of invoices) {
    const row = clientMap.get(i.userId);
    if (!row) continue;
    if (i.status === "paid") row.paid += money(i.amount);
    else if (["pending", "overdue"].includes(invoiceStatus(i)))
      row.outstanding += money(i.amount);
  }

  return {
    metrics: {
      revenueThisMonth,
      outstanding,
      activeClients,
      activeProjects,
      pendingApprovals,
      upcomingDeadlines,
      newLeads,
      totalClients: clients.length,
      totalUsers: users,
    },
    clients: [...clientMap.values()].map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      company: c.company,
      profileImage: c.profileImage,
      createdAt: c.createdAt,
      projectsCount: c.projectsCount,
      activeProjectsCount: c.activeProjectsCount,
      totalValue: c.totalValue,
      paid: c.paid,
      outstanding: c.outstanding,
    })),
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      status: p.status,
      progress: p.progress,
      value: money(p.value),
      nextDeadline: p.nextDeadline,
      client: { id: p.clientId, name: p.client.name, email: p.client.email },
      deliverablesCount: p.deliverables.length,
      approvedCount: p.deliverables.filter((d) =>
        ["approved", "delivered"].includes(d.status)
      ).length,
    })),
    deliverables: deliverables.map((d) => ({
      id: d.id,
      title: d.title,
      kind: d.kind,
      status: d.status,
      version: d.version,
      dueAt: d.dueAt,
      project: {
        id: d.project.id,
        name: d.project.name,
        slug: d.project.slug,
      },
      client: { id: d.project.client.id, name: d.project.client.name },
    })),
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      company: l.company,
      phone: l.phone,
      budget: l.budget,
      service: l.service,
      source: l.source,
      status: l.status,
      notes: l.notes,
      createdAt: l.createdAt,
    })),
    payments: payments.map((p) => ({
      id: p.id,
      amount: money(p.amount),
      method: p.method,
      reference: p.reference,
      status: p.status,
      paidAt: p.paidAt,
      invoice: p.invoice,
      user: p.user,
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      number: i.number,
      description: i.description,
      amount: money(i.amount),
      status: invoiceStatus(i),
      dueDate: i.dueDate,
      issuedAt: i.issuedAt,
      client: { id: i.userId, name: i.user.name, email: i.user.email },
    })),
    tickets: tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      status: t.status,
      createdAt: t.createdAt,
      user: { id: t.user.id, name: t.user.name, email: t.user.email },
    })),
    recentActivity: activity.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      detail: a.detail,
      createdAt: a.createdAt,
      project: a.project
        ? { id: a.project.id, name: a.project.name, slug: a.project.slug }
        : null,
      actor: a.actor ? { id: a.actor.id, name: a.actor.name } : null,
    })),
  };
}

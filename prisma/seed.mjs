import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const day = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * day);
const daysFromNow = (n) => new Date(Date.now() + n * day);

async function upsertUser({ email, name, role, company, password }) {
  return prisma.user.upsert({
    where: { email },
    update: { role, company, emailVerified: true },
    create: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      provider: "credentials",
      role,
      company,
      emailVerified: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Plans — mirrored from the marketing pricing (lib/data.ts)          */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    key: "personal",
    name: "Personal",
    tagline: "For portfolios, freelancers, and personal brands",
    price: 899,
    priceRange: "$699 – $1,499",
    highlighted: false,
    specs: [
      "1–3 pages, custom designed",
      "Mobile-first, loads fast",
      "Contact form",
      "SEO basics",
      "Domain + hosting set up",
      "Optional care plan — $39/mo",
      "Launch in ~1 week",
    ],
  },
  {
    key: "business",
    name: "Business",
    tagline: "For local businesses that want to win online",
    price: 2900,
    priceRange: "$1,900 – $4,500",
    highlighted: true,
    specs: [
      "Up to 7 pages, custom designed",
      "Booking, contact, and map",
      "Copy polish that sells",
      "Google-ready SEO",
      "Speed + mobile optimization",
      "Care plan — first month included",
      "Launch in 2–3 weeks",
    ],
  },
  {
    key: "custom",
    name: "Custom",
    tagline: "E-commerce, booking systems, brands, and more",
    price: 6500,
    priceRange: "$8,000 – $25,000+",
    highlighted: false,
    specs: [
      "Online store or custom features",
      "Brand identity & logo (add-on)",
      "Photo or video add-ons",
      "Priority support",
      "Monthly care plan",
      "Custom timeline",
    ],
  },
];

async function seedPlans() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: plan,
      create: plan,
    });
  }
  console.log("✓ plans");
}

/* ------------------------------------------------------------------ */
/*  Demo workspace — Brew & Co. (a café client)                        */
/*                                                                     */
/*  Website-focused demo so the portal reads like a web studio's       */
/*  client workspace, not a video agency. All amounts in USD.          */
/* ------------------------------------------------------------------ */

async function resetDemoWorkspace(clientId) {
  // The demo account is re-seeded on every run; scoped to the demo client so
  // real client data is never touched.
  const projects = await prisma.project.findMany({
    where: { clientId },
    select: { id: true },
  });
  const projectIds = projects.map((p) => p.id);

  await prisma.activityEvent.deleteMany({
    where: { OR: [{ projectId: { in: projectIds } }, { actorId: clientId }] },
  });
  await prisma.fileAsset.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.folder.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.comment.deleteMany({
    where: { deliverable: { projectId: { in: projectIds } } },
  });
  await prisma.deliverableVersion.deleteMany({
    where: { deliverable: { projectId: { in: projectIds } } },
  });
  await prisma.deliverable.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.milestone.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.invoice.deleteMany({ where: { userId: clientId } }); // cascades payments
  await prisma.supportTicket.deleteMany({ where: { userId: clientId } });
  await prisma.project.deleteMany({ where: { clientId } });
}

async function seedDemoWorkspace(client) {
  await resetDemoWorkspace(client.id);

  // Project 1 — Brew & Co. Website
  const website = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "Brew & Co. Website",
      slug: "brew-website",
      tagline: "A new website for the neighborhood café",
      description:
        "A custom website for Brew & Co. — warm design, real photography, and a booking flow that turns searches into tables.",
      status: "active",
      progress: 68,
      value: 2900,
      currency: "USD",
      nextDeadline: daysFromNow(4),
      endsAt: daysFromNow(16),
      milestones: {
        create: [
          {
            title: "Discovery & menu deep-dive",
            description: "Kickoff call, menu review, competitor scan.",
            dueDate: daysAgo(25),
            status: "completed",
            sortOrder: 0,
            completedAt: daysAgo(23),
          },
          {
            title: "Design concepts",
            description: "Two distinct directions, refined to one.",
            dueDate: daysAgo(10),
            status: "completed",
            sortOrder: 1,
            completedAt: daysAgo(8),
          },
          {
            title: "Build",
            description: "Home, menu, booking flow, and SEO.",
            dueDate: daysFromNow(4),
            status: "in-progress",
            sortOrder: 2,
          },
          {
            title: "Launch & go live",
            description: "QA, training, and publishing.",
            dueDate: daysFromNow(16),
            status: "upcoming",
            sortOrder: 3,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "Home page",
            kind: "website",
            status: "in-review",
            description:
              "The opening page — headline, photos, and the book-a-table button above the fold.",
            version: 2,
            dueAt: daysAgo(7),
            deliveredAt: daysAgo(7),
            versions: {
              create: [
                {
                  version: 1,
                  status: "changes-requested",
                  note: "Initial concept",
                  createdAt: daysAgo(9),
                },
                {
                  version: 2,
                  status: "in-review",
                  note: "New hero photos, booking button above the fold",
                  createdAt: daysAgo(7),
                },
              ],
            },
            comments: {
              create: [
                {
                  authorId: client.id,
                  body: "The font feels off — can we try a heavier display face?",
                  createdAt: daysAgo(8),
                },
                {
                  authorId: client.id,
                  body: "Also, the booking button should sit above the fold.",
                  createdAt: daysAgo(8),
                },
              ],
            },
          },
          {
            title: "Menu & hours",
            kind: "website",
            status: "changes-requested",
            description: "The menu page with the updated autumn menu and hours.",
            version: 1,
            dueAt: daysFromNow(7),
            deliveredAt: daysAgo(1),
            versions: {
              create: [
                {
                  version: 1,
                  status: "changes-requested",
                  note: "First pass — awaiting notes",
                  createdAt: daysAgo(1),
                },
              ],
            },
            comments: {
              create: [
                {
                  authorId: client.id,
                  body: "Section 2 feels too dark against the menu photos. Can we lift the contrast?",
                  createdAt: daysAgo(0),
                },
              ],
            },
          },
          {
            title: "Book a table",
            kind: "website",
            status: "in-review",
            description: "The booking flow — date, time, party size, confirm.",
            version: 1,
            dueAt: daysFromNow(2),
            deliveredAt: daysAgo(0),
            versions: {
              create: [
                {
                  version: 1,
                  status: "in-review",
                  note: "First pass",
                  createdAt: daysAgo(0),
                },
              ],
            },
          },
          {
            title: "SEO & launch prep",
            kind: "website",
            status: "draft",
            description: "Google Business sync, meta tags, and launch checklist.",
            version: 1,
            dueAt: daysFromNow(11),
          },
        ],
      },
      folders: {
        create: [
          { name: "Pages", kind: "final" },
          { name: "Brand Assets", kind: "brand" },
          { name: "Documents", kind: "documents" },
        ],
      },
    },
  });

  // Project 2 — Brew & Co. Brand Identity
  const brand = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "Brew & Co. Brand Identity",
      slug: "brew-brand",
      tagline: "Logo, colors, and type for the new look",
      description:
        "A refreshed identity to match the new website — logo, palette, and type used consistently across the site and storefront.",
      status: "active",
      progress: 55,
      value: 1400,
      currency: "USD",
      nextDeadline: daysFromNow(4),
      endsAt: daysFromNow(25),
      milestones: {
        create: [
          {
            title: "Brand workshop",
            description: "Moodboards and the words the brand lives by.",
            dueDate: daysAgo(6),
            status: "completed",
            sortOrder: 0,
            completedAt: daysAgo(5),
          },
          {
            title: "Logo directions",
            description: "Two logo routes, refined to one.",
            dueDate: daysFromNow(4),
            status: "in-progress",
            sortOrder: 1,
          },
          {
            title: "Guidelines",
            description: "Colors, type, and usage rules.",
            dueDate: daysFromNow(18),
            status: "upcoming",
            sortOrder: 2,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "Logo concepts",
            kind: "design",
            status: "approved",
            description: "The chosen wordmark and its primary variations.",
            version: 1,
            dueAt: daysAgo(5),
            deliveredAt: daysAgo(5),
            versions: {
              create: [
                {
                  version: 1,
                  status: "approved",
                  note: "Final approved logo set",
                  createdAt: daysAgo(5),
                },
              ],
            },
            comments: {
              create: [
                {
                  authorId: client.id,
                  body: "Love it. Ship it.",
                  createdAt: daysAgo(5),
                },
              ],
            },
          },
          {
            title: "Colors & type",
            kind: "design",
            status: "in-review",
            description: "The palette and typeface pairing for the site.",
            version: 2,
            dueAt: daysAgo(2),
            deliveredAt: daysAgo(0),
            versions: {
              create: [
                {
                  version: 1,
                  status: "changes-requested",
                  note: "First palette",
                  createdAt: daysAgo(3),
                },
                {
                  version: 2,
                  status: "in-review",
                  note: "Warmed the browns as requested",
                  createdAt: daysAgo(0),
                },
              ],
            },
            comments: {
              create: [
                {
                  authorId: client.id,
                  body: "Can the brown be warmer? It's fighting the photos.",
                  createdAt: daysAgo(2),
                },
                {
                  authorId: client.id,
                  body: "This is much better, ready when you are.",
                  createdAt: daysAgo(0),
                },
              ],
            },
          },
          {
            title: "Brand guidelines",
            kind: "document",
            status: "draft",
            description: "The one-page rules for using the brand.",
            version: 1,
            dueAt: daysFromNow(11),
          },
        ],
      },
      folders: {
        create: [
          { name: "Brand Assets", kind: "brand" },
          { name: "Documents", kind: "documents" },
        ],
      },
    },
  });

  // Project 3 — Brew & Co. Care Plan
  const care = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "Brew & Co. Care Plan",
      slug: "brew-care",
      tagline: "Monthly website care & updates",
      description:
        "Monthly updates, SEO tweaks, and support so the website keeps working while the café runs itself.",
      status: "active",
      progress: 30,
      value: 1440,
      currency: "USD",
      nextDeadline: daysFromNow(10),
      endsAt: daysFromNow(24),
      milestones: {
        create: [
          {
            title: "July refresh",
            description: "Menu update, summer hours, small tweaks.",
            dueDate: daysAgo(3),
            status: "completed",
            sortOrder: 0,
            completedAt: daysAgo(2),
          },
          {
            title: "August refresh",
            description: "Seasonal menu, photos, SEO pass.",
            dueDate: daysFromNow(10),
            status: "upcoming",
            sortOrder: 1,
          },
          {
            title: "September refresh",
            description: "Fall menu and event page.",
            dueDate: daysFromNow(18),
            status: "upcoming",
            sortOrder: 2,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "July refresh report",
            kind: "document",
            status: "delivered",
            description: "What changed on the site this month.",
            version: 1,
            dueAt: daysAgo(3),
            deliveredAt: daysAgo(2),
            versions: {
              create: [
                {
                  version: 1,
                  status: "delivered",
                  note: "July update shipped",
                  createdAt: daysAgo(2),
                },
              ],
            },
          },
          {
            title: "August refresh",
            kind: "website",
            status: "draft",
            description: "Seasonal menu and photo refresh.",
            version: 1,
            dueAt: daysFromNow(10),
          },
        ],
      },
      folders: {
        create: [{ name: "Reports", kind: "documents" }],
      },
    },
  });

  /* Files for the project folders */
  const webPages = await prisma.folder.findFirst({ where: { projectId: website.id, name: "Pages" } });
  const webBrand = await prisma.folder.findFirst({ where: { projectId: website.id, name: "Brand Assets" } });
  const webDocs = await prisma.folder.findFirst({ where: { projectId: website.id, name: "Documents" } });
  const brandBrand = await prisma.folder.findFirst({ where: { projectId: brand.id, name: "Brand Assets" } });
  await prisma.fileAsset.createMany({
    data: [
      {
        projectId: website.id,
        folderId: webBrand.id,
        name: "brand_kit.zip",
        url: "#",
        mimeType: "application/zip",
        size: 48212000,
        kind: "brand",
        uploadedById: client.id,
        createdAt: daysAgo(6),
      },
      {
        projectId: website.id,
        folderId: webDocs.id,
        name: "copy_deck_v3.pdf",
        url: "#",
        mimeType: "application/pdf",
        size: 2210418,
        kind: "documents",
        uploadedById: client.id,
        createdAt: daysAgo(4),
      },
      {
        projectId: website.id,
        folderId: webPages.id,
        name: "sitemap_v2.pdf",
        url: "#",
        mimeType: "application/pdf",
        size: 1182033,
        kind: "final",
        uploadedById: client.id,
        createdAt: daysAgo(2),
      },
      {
        projectId: brand.id,
        folderId: brandBrand.id,
        name: "logo_pack.zip",
        url: "#",
        mimeType: "application/zip",
        size: 8612000,
        kind: "brand",
        uploadedById: client.id,
        createdAt: daysAgo(4),
      },
    ],
  });

  /* Invoices + payments (USD) */
  const inv001 = await prisma.invoice.create({
    data: {
      number: "INV-001",
      userId: client.id,
      projectId: website.id,
      description: "Brew & Co. Website — 50% milestone",
      amount: 1450,
      status: "paid",
      dueDate: daysAgo(8),
      issuedAt: daysAgo(16),
    },
  });
  const inv002 = await prisma.invoice.create({
    data: {
      number: "INV-002",
      userId: client.id,
      projectId: website.id,
      description: "Brew & Co. Website — final payment",
      amount: 1450,
      status: "pending",
      dueDate: daysFromNow(14),
      issuedAt: daysAgo(3),
    },
  });
  const inv003 = await prisma.invoice.create({
    data: {
      number: "INV-003",
      userId: client.id,
      projectId: brand.id,
      description: "Brand Identity — 50% milestone",
      amount: 700,
      status: "paid",
      dueDate: daysAgo(2),
      issuedAt: daysAgo(12),
    },
  });
  const inv004 = await prisma.invoice.create({
    data: {
      number: "INV-004",
      userId: client.id,
      projectId: brand.id,
      description: "Brand Identity — final payment",
      amount: 700,
      status: "pending",
      dueDate: daysFromNow(6),
      issuedAt: daysAgo(1),
    },
  });
  const inv005 = await prisma.invoice.create({
    data: {
      number: "INV-005",
      userId: client.id,
      projectId: care.id,
      description: "Care Plan — July",
      amount: 120,
      status: "paid",
      dueDate: daysAgo(4),
      issuedAt: daysAgo(9),
    },
  });

  await prisma.payment.createMany({
    data: [
      {
        invoiceId: inv001.id,
        userId: client.id,
        amount: 1450,
        method: "bank",
        reference: "TR-882140",
        paidAt: daysAgo(3),
      },
      {
        invoiceId: inv003.id,
        userId: client.id,
        amount: 700,
        method: "manual",
        reference: "SIM-550912",
        paidAt: daysAgo(2),
      },
      {
        invoiceId: inv005.id,
        userId: client.id,
        amount: 120,
        method: "manual",
        reference: "SIM-601118",
        paidAt: daysAgo(4),
      },
    ],
  });

  /* Activity feed */
  await prisma.activityEvent.createMany({
    data: [
      {
        projectId: website.id,
        actorId: client.id,
        type: "approval",
        title: "Logo concepts approved",
        detail: "Approved on Brew & Co. Brand Identity",
        createdAt: daysAgo(0.08), // ~2h ago
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "upload",
        title: "12 new assets uploaded",
        detail: "brand_kit.zip and 11 more",
        createdAt: daysAgo(1),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "payment",
        title: "Payment received",
        detail: "INV-001 · $1,450",
        createdAt: daysAgo(3),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "comment",
        title: "New comment on Home page",
        detail: "The booking button should sit above the fold.",
        createdAt: daysAgo(2),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "delivery",
        title: "Home page v2 delivered",
        detail: "Ready for review",
        createdAt: daysAgo(7),
      },
    ],
  });

  /* Support tickets */
  await prisma.supportTicket.createMany({
    data: [
      {
        userId: client.id,
        subject: "How do I update my menu prices myself?",
        message:
          "We changed some prices this week. Can I edit them on the site, or do I send you the list?",
        status: "open",
        createdAt: daysAgo(2),
      },
      {
        userId: client.id,
        subject: "Calendar integration",
        message: "Can we sync the booking calendar to Google Calendar?",
        status: "closed",
        createdAt: daysAgo(20),
        updatedAt: daysAgo(18),
      },
    ],
  });

  console.log("✓ demo workspace (Brew & Co.)");
}

/* ------------------------------------------------------------------ */
/*  Demo leads (only when the table is empty)                          */
/* ------------------------------------------------------------------ */

async function seedLeads() {
  const count = await prisma.lead.count();
  if (count > 0) {
    console.log("✓ leads — skipped (table not empty)");
    return;
  }
  await prisma.lead.createMany({
    data: [
      {
        name: "Rohan Kapoor",
        email: "rohan@northwind.studio",
        company: "Northwind Studio",
        budget: "$4,500 – $8,000",
        service: "Business Website",
        source: "contact-form",
        status: "new",
        notes: "Wants a booking flow and an online store.",
        createdAt: daysAgo(1),
      },
      {
        name: "Meera Nair",
        email: "meera@lumina.co",
        company: "Lumina & Co",
        budget: "$1,500 – $3,000",
        service: "Business Website",
        source: "instagram",
        status: "contacted",
        createdAt: daysAgo(3),
      },
      {
        name: "Arjun Bhat",
        email: "arjun@fitmile.in",
        company: "FitMile",
        budget: "$6,000+",
        service: "Custom Website",
        source: "referral",
        status: "won",
        createdAt: daysAgo(26),
      },
      {
        name: "Sara Ali",
        email: "sara@mothmag.com",
        company: "Moth Magazine",
        budget: "$1,500 – $3,000",
        service: "Personal Portfolio",
        source: "contact-form",
        status: "qualified",
        createdAt: daysAgo(5),
      },
    ],
  });
  console.log("✓ demo leads");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  await seedPlans();

  // Demo accounts + demo data are a development convenience. Never seed them
  // against a production database — gate on NODE_ENV / SEED_DEMO.
  const demo = process.env.NODE_ENV !== "production" || process.env.SEED_DEMO === "1";

  if (demo) {
    const admin = await upsertUser({
      email: "for1s.contact@gmail.com",
      name: "Subham Rout",
      role: "admin",
      password: process.env.SEED_ADMIN_PASSWORD || "admin@123",
    });
    console.log("✓ admin:", admin.email, "(role: admin)");

    const client = await upsertUser({
      email: "subhamrout818@gmail.com",
      name: "Subham Rout",
      role: "client",
      company: "FOR1S Demo",
      password: process.env.SEED_CLIENT_PASSWORD || "client@123",
    });
    console.log("✓ client:", client.email, "(role: client)");

    await seedDemoWorkspace(client);
    await seedLeads();
  } else {
    console.log("✓ demo data skipped (production)");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
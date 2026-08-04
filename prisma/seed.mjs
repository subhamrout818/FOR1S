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

const SAMPLE_VIDEOS = {
  reelA: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  reelB: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  reelC: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
};

/* ------------------------------------------------------------------ */
/*  Plans (kept from the original seed)                                */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    key: "landing",
    name: "Landing Page",
    tagline: "High-impact, single-page presence",
    price: 2500,
    priceRange: "$2,500 – $4,500",
    highlighted: false,
    specs: [
      "1–5 pages",
      "GSAP, Three.js, premium animations",
      "Fully responsive",
      "SEO basics",
      "Launch in 1–2 weeks",
    ],
  },
  {
    key: "saas",
    name: "SaaS Product",
    tagline: "Full-stack, production-grade platform",
    price: 12000,
    priceRange: "$12,000 – $20,000+",
    highlighted: true,
    specs: [
      "Authentication & user management",
      "Dashboard & admin panel",
      "Database & API architecture",
      "Payments & email integration",
      "Analytics & production deployment",
    ],
  },
  {
    key: "business",
    name: "Business Website",
    tagline: "Multi-page, fully functional site",
    price: 5000,
    priceRange: "$5,000 – $8,000",
    highlighted: false,
    specs: [
      "Multiple pages",
      "CMS / blog if needed",
      "Contact forms & integrations",
      "Custom animations",
      "Full deployment & handoff",
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
/*  Demo workspace — The Brew House (a café client)                    */
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

  // Project 1 — Website Redesign
  const website = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "Website Redesign",
      slug: "brew-website",
      tagline: "A fresh digital presence for the cafe",
      description:
        "A complete redesign of the The Brew House website — new brand direction, modern motion, and a booking flow that actually converts.",
      status: "active",
      progress: 68,
      value: 22000,
      currency: "INR",
      nextDeadline: daysFromNow(4),
      endsAt: daysFromNow(16),
      milestones: {
        create: [
          {
            title: "Discovery & brand audit",
            description: "Stakeholder calls, menu deep-dive, competitor scan.",
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
            title: "Development",
            description: "Build, motion, CMS, and integrations.",
            dueDate: daysFromNow(4),
            status: "in-progress",
            sortOrder: 2,
          },
          {
            title: "Launch & handoff",
            description: "QA, training, and going live.",
            dueDate: daysFromNow(16),
            status: "upcoming",
            sortOrder: 3,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "Website Hero",
            kind: "website",
            status: "in-review",
            description:
              "The opening scene — headline, extruded artwork, and the booking CTA.",
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
                  note: "Swapped display face, tightened the fold",
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
            title: "Landing Page",
            kind: "website",
            status: "changes-requested",
            description: "The scroll experience below the hero.",
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
            title: "Case Studies",
            kind: "website",
            status: "draft",
            description: "Three customer stories for the new site.",
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

  // Project 2 — August Social Media
  const social = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "August Social Media",
      slug: "brew-social",
      tagline: "Reels, carousels & stories for the summer push",
      description:
        "A monthly content engine: 8 reels, weekly carousels, and story templates that keep The Brew House front-of-mind.",
      status: "active",
      progress: 55,
      value: 12000,
      currency: "INR",
      nextDeadline: daysFromNow(4),
      endsAt: daysFromNow(25),
      milestones: {
        create: [
          {
            title: "Content calendar",
            description: "Themes, hooks, and the August grid.",
            dueDate: daysAgo(6),
            status: "completed",
            sortOrder: 0,
            completedAt: daysAgo(5),
          },
          {
            title: "Reels batch 1",
            description: "Reels 01–08.",
            dueDate: daysFromNow(4),
            status: "in-progress",
            sortOrder: 1,
          },
          {
            title: "Reels batch 2",
            description: "Reels 09–12 + carousels.",
            dueDate: daysFromNow(18),
            status: "upcoming",
            sortOrder: 2,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "Reel 06",
            kind: "reel",
            status: "approved",
            description: "Cold brew pour — the 'recipe in 20 seconds' hook.",
            mediaUrl: SAMPLE_VIDEOS.reelA,
            version: 1,
            dueAt: daysAgo(5),
            deliveredAt: daysAgo(5),
            versions: {
              create: [
                {
                  version: 1,
                  status: "approved",
                  note: "Final approved cut",
                  mediaUrl: SAMPLE_VIDEOS.reelA,
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
            title: "Reel 07",
            kind: "reel",
            status: "in-review",
            description: "Barista spotlight — the 'why I love this job' angle.",
            mediaUrl: SAMPLE_VIDEOS.reelB,
            version: 2,
            dueAt: daysAgo(2),
            deliveredAt: daysAgo(0),
            versions: {
              create: [
                {
                  version: 1,
                  status: "changes-requested",
                  note: "First cut",
                  mediaUrl: SAMPLE_VIDEOS.reelB,
                  createdAt: daysAgo(3),
                },
                {
                  version: 2,
                  status: "in-review",
                  note: "Reshot the 0:17 shot as requested",
                  mediaUrl: SAMPLE_VIDEOS.reelB,
                  createdAt: daysAgo(0),
                },
              ],
            },
            comments: {
              create: [
                {
                  authorId: client.id,
                  body: "Can we change the shot at 0:17?",
                  createdAt: daysAgo(2),
                },
                {
                  authorId: client.id,
                  body: "The new cut is great, ready when you are.",
                  createdAt: daysAgo(0),
                },
              ],
            },
          },
          {
            title: "Reel 08",
            kind: "reel",
            status: "draft",
            description: "Customer POV — slow Sunday mornings.",
            mediaUrl: SAMPLE_VIDEOS.reelC,
            version: 1,
            dueAt: daysFromNow(4),
            versions: {
              create: [
                {
                  version: 1,
                  status: "draft",
                  note: "Rough cut",
                  mediaUrl: SAMPLE_VIDEOS.reelC,
                  createdAt: daysAgo(1),
                },
              ],
            },
          },
          {
            title: "Reel 09",
            kind: "reel",
            status: "draft",
            description: "Behind the counter — batch day.",
            version: 1,
            dueAt: daysFromNow(11),
          },
        ],
      },
      folders: {
        create: [
          { name: "Raw Footage", kind: "raw" },
          { name: "Final Exports", kind: "final" },
        ],
      },
    },
  });

  const socialRaw = await prisma.folder.findFirst({ where: { projectId: social.id, name: "Raw Footage" } });
  const socialFinal = await prisma.folder.findFirst({ where: { projectId: social.id, name: "Final Exports" } });
  await prisma.fileAsset.createMany({
    data: [
      {
        projectId: social.id,
        folderId: socialFinal.id,
        name: "Reel_06_final.mp4",
        url: SAMPLE_VIDEOS.reelA,
        mimeType: "video/mp4",
        size: 18420230,
        kind: "final",
        uploadedById: client.id,
        createdAt: daysAgo(5),
      },
      {
        projectId: social.id,
        folderId: socialFinal.id,
        name: "Reel_07_v2.mp4",
        url: SAMPLE_VIDEOS.reelB,
        mimeType: "video/mp4",
        size: 19280113,
        kind: "final",
        uploadedById: client.id,
        createdAt: daysAgo(0),
      },
      {
        projectId: social.id,
        folderId: socialRaw.id,
        name: "august_shoot_cutdowns.mp4",
        url: SAMPLE_VIDEOS.reelC,
        mimeType: "video/mp4",
        size: 482312000,
        kind: "raw",
        uploadedById: client.id,
        createdAt: daysAgo(1),
      },
      {
        projectId: social.id,
        folderId: socialRaw.id,
        name: "august_cover_takes.zip",
        url: "#",
        mimeType: "application/zip",
        size: 8904120,
        kind: "raw",
        uploadedById: client.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  // Project 3 — Product Photography
  const photos = await prisma.project.create({
    data: {
      clientId: client.id,
      name: "Product Photography",
      slug: "brew-photoshoot",
      tagline: "Signature brews & merch, shot for the web",
      description:
        "A dedicated shoot day for hero product shots of the signature range — used across the website, menu and socials.",
      status: "active",
      progress: 30,
      value: 8500,
      currency: "INR",
      nextDeadline: daysFromNow(10),
      endsAt: daysFromNow(24),
      milestones: {
        create: [
          {
            title: "Scouting & styling",
            description: "Location, props, and the shot list.",
            dueDate: daysAgo(3),
            status: "completed",
            sortOrder: 0,
            completedAt: daysAgo(2),
          },
          {
            title: "Product shoot",
            description: "The full day on set.",
            dueDate: daysFromNow(10),
            status: "upcoming",
            sortOrder: 1,
          },
          {
            title: "Post-production",
            description: "Colour, retouch, and final exports.",
            dueDate: daysFromNow(18),
            status: "upcoming",
            sortOrder: 2,
          },
        ],
      },
      deliverables: {
        create: [
          {
            title: "Product Shots",
            kind: "photo",
            status: "draft",
            description: "Hero shots of the signature range.",
            version: 1,
            dueAt: daysFromNow(14),
          },
        ],
      },
      folders: {
        create: [{ name: "Shot List", kind: "documents" }],
      },
    },
  });

  /* Files for the project folders */
  const webBrand = await prisma.folder.findFirst({
    where: { projectId: website.id, name: "Brand Assets" },
  });
  const webDocs = await prisma.folder.findFirst({
    where: { projectId: website.id, name: "Documents" },
  });
  const photoDocs = await prisma.folder.findFirst({
    where: { projectId: photos.id, name: "Shot List" },
  });
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
        projectId: photos.id,
        folderId: photoDocs.id,
        name: "shot_list_v1.pdf",
        url: "#",
        mimeType: "application/pdf",
        size: 1182033,
        kind: "documents",
        uploadedById: client.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  /* Invoices + payments */
  const inv001 = await prisma.invoice.create({
    data: {
      number: "INV-001",
      userId: client.id,
      projectId: website.id,
      description: "Website Redesign — 50% milestone",
      amount: 11000,
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
      description: "Website Redesign — final payment",
      amount: 11000,
      status: "pending",
      dueDate: daysFromNow(14),
      issuedAt: daysAgo(3),
    },
  });
  const inv003 = await prisma.invoice.create({
    data: {
      number: "INV-003",
      userId: client.id,
      projectId: social.id,
      description: "August Social Media — batch 1",
      amount: 6000,
      status: "paid",
      dueDate: daysAgo(2),
      issuedAt: daysAgo(12),
    },
  });
  const inv004 = await prisma.invoice.create({
    data: {
      number: "INV-004",
      userId: client.id,
      projectId: social.id,
      description: "August Social Media — batch 2",
      amount: 8500,
      status: "pending",
      dueDate: daysFromNow(6),
      issuedAt: daysAgo(1),
    },
  });
  const inv005 = await prisma.invoice.create({
    data: {
      number: "INV-005",
      userId: client.id,
      projectId: photos.id,
      description: "Product Photography — booking",
      amount: 4250,
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
        amount: 11000,
        method: "bank",
        reference: "NEFT-882140",
        paidAt: daysAgo(3),
      },
      {
        invoiceId: inv003.id,
        userId: client.id,
        amount: 6000,
        method: "upi",
        reference: "UPI-550912",
        paidAt: daysAgo(2),
      },
      {
        invoiceId: inv005.id,
        userId: client.id,
        amount: 4250,
        method: "upi",
        reference: "UPI-601118",
        paidAt: daysAgo(4),
      },
    ],
  });

  /* Activity feed */
  await prisma.activityEvent.createMany({
    data: [
      {
        projectId: social.id,
        actorId: client.id,
        type: "approval",
        title: "Reel 06 approved",
        detail: "Approved on August Social Media",
        createdAt: daysAgo(0.08), // ~2h ago
      },
      {
        projectId: social.id,
        actorId: client.id,
        type: "upload",
        title: "14 new assets uploaded",
        detail: "august_shoot_cutdowns.mp4 and 13 more",
        createdAt: daysAgo(1),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "payment",
        title: "Payment received",
        detail: "INV-001 · ₹11,000",
        createdAt: daysAgo(3),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "comment",
        title: "New comment on Website Hero",
        detail: "The booking button should sit above the fold.",
        createdAt: daysAgo(2),
      },
      {
        projectId: website.id,
        actorId: client.id,
        type: "delivery",
        title: "Website Hero v2 delivered",
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
        subject: "How do I download the brand kit?",
        message:
          "I need the updated logo files for a new print run. Where are they stored?",
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

  console.log("✓ demo workspace (The Brew House)");
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
        budget: "₹3–5L",
        service: "SaaS Product",
        source: "contact-form",
        status: "new",
        notes: "Wants a multi-tenant booking platform.",
        createdAt: daysAgo(1),
      },
      {
        name: "Meera Nair",
        email: "meera@lumina.co",
        company: "Lumina & Co",
        budget: "₹1–2L",
        service: "Website Redesign",
        source: "instagram",
        status: "contacted",
        createdAt: daysAgo(3),
      },
      {
        name: "Arjun Bhat",
        email: "arjun@fitmile.in",
        company: "FitMile",
        budget: "₹4–6L",
        service: "SaaS Product",
        source: "referral",
        status: "won",
        createdAt: daysAgo(26),
      },
      {
        name: "Sara Ali",
        email: "sara@mothmag.com",
        company: "Moth Magazine",
        budget: "₹50–80k",
        service: "Business Website",
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

  const admin = await upsertUser({
    email: "admin@for1s.in",
    name: "Subham Rout",
    role: "admin",
    password: "admin1234",
  });
  console.log("✓ admin:", admin.email, "(role: admin)");

  const client = await upsertUser({
    email: "client@for1s.in",
    name: "Aarav Mehta",
    role: "client",
    company: "The Brew House",
    password: "client1234",
  });
  console.log("✓ client:", client.email, "(role: client)");

  await seedDemoWorkspace(client);
  await seedLeads();

  console.log("\nSeed complete.");
  console.log("  → Admin portal:  admin@for1s.in / admin1234");
  console.log("  → Client portal: client@for1s.in / client1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: plan,
      create: plan,
    });
    console.log(`✓ plan: ${plan.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

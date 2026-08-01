export interface Project {
  id: string;
  index: string;
  name: string;
  category: string;
  year: string;
  tags: string[];
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: "finflow",
    index: "01",
    name: "Finflow",
    category: "SaaS · Fintech",
    year: "2026",
    tags: ["Next.js", "Stripe", "Postgres"],
    description:
      "A full-stack finance platform from napkin sketch to production in 8 weeks — auth, dashboards, payments, and a billing engine that scaled to 1K users in the first month.",
  },
  {
    id: "taskhive",
    index: "02",
    name: "TaskHive",
    category: "SaaS · Productivity",
    year: "2025",
    tags: ["React", "Node.js", "WebSockets"],
    description:
      "Real-time team task management with live collaboration. Shipped on time and on budget after three agencies had failed to deliver.",
  },
  {
    id: "clouddesk",
    index: "03",
    name: "CloudDesk",
    category: "SaaS · Support",
    year: "2025",
    tags: ["Next.js", "PostgreSQL", "AWS"],
    description:
      "A support operations platform architected for scale from day one — now serving 50K+ users without a single rewrite.",
  },
  {
    id: "loopline",
    index: "04",
    name: "Loopline",
    category: "Web Platform",
    year: "2024",
    tags: ["Next.js", "Stripe", "Supabase"],
    description:
      "A subscription-based web platform with member portals, automated billing, and a design system that kept product teams shipping independently.",
  },
  {
    id: "databridge",
    index: "05",
    name: "DataBridge",
    category: "SaaS · Analytics",
    year: "2024",
    tags: ["TypeScript", "ClickHouse", "Docker"],
    description:
      "An analytics dashboard that turns raw event streams into decisions. Real-time queries, custom visualizations, and enterprise-grade security.",
  },
  {
    id: "novastudio",
    index: "06",
    name: "Nova Studio",
    category: "Brand + Website",
    year: "2023",
    tags: ["GSAP", "Three.js", "Vercel"],
    description:
      "A cinematic marketing site and brand system for a creative studio — motion-first, conversion-focused, and fast enough to feel instant.",
  },
];

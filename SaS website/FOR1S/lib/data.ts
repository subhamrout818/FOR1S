export const BRAND = {
  name: "FOR1S",
  short: "FR1",
  filed: "FOR1S DIGITAL™",
  tagline: "Ship SaaS. Scale fast.",
};

export const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Services", href: "#features" },
  { label: "Process", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    id: "f1",
    scene: "01",
    title: "Full-stack, end to end",
    description:
      "Strategy, design, frontend, backend, infrastructure — one team, one vision. No handoff gaps, no translation loss between agencies.",
    span: "large",
  },
  {
    id: "f2",
    scene: "02",
    title: "Ship fast, iterate faster",
    description:
      "We launch MVPs in weeks, not months. Then we refine with real data. Speed isn't a compromise — it's a strategy.",
    span: "small",
  },
  {
    id: "f3",
    scene: "03",
    title: "Built to scale",
    description:
      "Architecture designed for your first 100 users and your next 10 million. No rewrite needed when traction hits.",
    span: "small",
  },
  {
    id: "f4",
    scene: "04",
    title: "Design that converts",
    description:
      "UI/UX isn't decoration — it's revenue. Every screen is engineered to reduce friction, increase retention, and guide users to value.",
    span: "small",
  },
  {
    id: "f5",
    scene: "05",
    title: "Post-launch, not post-sale",
    description:
      "We don't disappear after deploy. Monitoring, iterations, feature sprints — we stay in the trenches with you.",
    span: "small",
  },
] as const;

export const PREVIEW_TABS = [
  {
    id: "strategy",
    label: "Strategy",
    description:
      "We start with your business goals, not code. Market research, user interviews, competitive mapping — the foundation that makes engineering decisions obvious.",
    specs: [
      { label: "Discovery sprint", value: "1–2 weeks" },
      { label: "Deliverables", value: "Roadmap + PRD" },
      { label: "Tech advisory", value: "Included" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description:
      "Figma-first, component-driven design systems. Every pixel has intent — from onboarding flows to billing dashboards.",
    specs: [
      { label: "Design system", value: "Tailored" },
      { label: "Prototyping", value: "High-fidelity" },
      { label: "Handoff", value: "Dev-ready Figma" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    description:
      "Modern stack, production-grade from day one. CI/CD, testing, observability — not afterthoughts, built in.",
    specs: [
      { label: "Stack", value: "Next.js / Node / Python" },
      { label: "Infra", value: "AWS / Vercel / Docker" },
      { label: "Deploy cadence", value: "Daily" },
    ],
  },
  {
    id: "scale",
    label: "Scale",
    description:
      "From MVP to millions of users. Performance tuning, cost optimization, and feature velocity that keeps up with your growth.",
    specs: [
      { label: "Uptime target", value: "99.9%" },
      { label: "Avg. load time", value: "< 1.5s" },
      { label: "Support", value: "Ongoing sprints" },
    ],
  },
] as const;

export const BENEFITS = [
  {
    id: "b1",
    title: "One team, zero handoffs",
    description:
      "No juggling five freelancers or three agencies. Strategy, design, code, and content — one team, one Slack channel, one bill.",
  },
  {
    id: "b2",
    title: "Speed without shortcuts",
    description:
      "We ship fast because we've done this before. Battle-tested patterns, not reinvented wheels. Your MVP in weeks, not quarters.",
  },
  {
    id: "b3",
    title: "Built for growth",
    description:
      "What works for 100 users should work for 100,000. We architect for scale from day one so you never pay for a rewrite.",
  },
  {
    id: "b4",
    title: "We don't disappear",
    description:
      "Launch day isn't the finish line. We stick around for iterations, optimizations, and the feature sprints that keep your product competitive.",
  },
] as const;



export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "They didn't just build our platform — they understood the market better than we did. Launched in 8 weeks, hit 1K users in the first month.",
    name: "Sarah K.",
    role: "CEO, Finflow",
  },
  {
    id: "t2",
    quote:
      "We've worked with three agencies before FOR1S. First one that actually shipped on time, on budget, and with quality we didn't have to redo.",
    name: "Marcus L.",
    role: "Founder, TaskHive",
  },
  {
    id: "t3",
    quote:
      "Our MVP went from napkin sketch to production in six weeks. The architecture they chose has scaled to 50K users without a single rewrite.",
    name: "Priya N.",
    role: "CTO, CloudDesk",
  },
  {
    id: "t4",
    quote:
      "What impressed me most wasn't the code — it was the product thinking. They challenged our assumptions and saved us months of building the wrong thing.",
    name: "James R.",
    role: "Head of Product, Loopline",
  },
  {
    id: "t5",
    quote:
      "We needed a team that could move fast without cutting corners. FOR1S delivered a SaaS platform that our enterprise clients actually compliment.",
    name: "Anika M.",
    role: "COO, DataBridge",
  },
] as const;

export const PRICING_TIERS = [
  {
    id: "landing",
    name: "Landing Page",
    tagline: "High-impact, single-page presence",
    price: "$2,500",
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
    id: "saas",
    name: "SaaS Product",
    tagline: "Full-stack, production-grade platform",
    price: "$12,000",
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
    id: "business",
    name: "Business Website",
    tagline: "Multi-page, fully functional site",
    price: "$5,000",
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
] as const;

export const FAQ_ITEMS = [
  {
    id: "q1",
    question: "What types of projects do you take on?",
    answer:
      "Everything from high-end landing pages and multi-page business sites to full-stack SaaS platforms with auth, dashboards, payments, and APIs. If it runs in a browser and drives revenue, we can build it.",
  },
  {
    id: "q2",
    question: "How long does a typical project take?",
    answer:
      "Landing pages ship in 1–2 weeks. Business websites take 3–5 weeks. Full SaaS builds run 6–12 weeks depending on complexity. We move fast because we've done this before — not because we cut corners.",
  },
  {
    id: "q3",
    question: "What's your tech stack?",
    answer:
      "We're stack-agnostic but opinionated. Next.js, React, Node.js, Python, PostgreSQL, AWS, and Vercel are our go-tos. We pick what fits your product — not what fits our resume.",
  },
  {
    id: "q4",
    question: "Do you work with early-stage startups?",
    answer:
      "Absolutely. Some of our best work has been with pre-revenue founders who needed a technical partner, not just a vendor. We'll help you figure out what to build first.",
  },
  {
    id: "q5",
    question: "What happens after launch?",
    answer:
      "We offer ongoing sprint-based support — bug fixes, new features, performance tuning, and scaling. Most clients stay on a monthly retainer because it's cheaper than hiring in-house.",
  },
  {
    id: "q6",
    question: "Do you also handle video production?",
    answer:
      "Yes. We produce premium commercial edits and brand content. Single commercials start at $500, with package pricing for ongoing video needs. Ask us about bundled web + video deals.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Services", href: "#features" },
    { label: "Process", href: "#preview" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "Vision", href: "#vision" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

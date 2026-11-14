import { CONTACT, SOCIAL } from "@/lib/contact";

export const BRAND = {
  name: "FOR1S",
  short: "FR1",
  filed: "FOR1S DIGITAL™",
  tagline: "Websites that win customers.",
};

export const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Services", href: "#features" },
  { label: "Process", href: "#preview" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    id: "f1",
    scene: "01",
    title: "End to end, one team",
    description:
      "Design, copy, build, and launch — handled by the same small team. One person to talk to, one timeline, one price. No agencies juggling, no handoff gaps.",
    span: "large",
  },
  {
    id: "f2",
    scene: "02",
    title: "Fast on every phone",
    description:
      "Your customers browse on phones with patchy connections. We build pages that load in a blink and feel premium everywhere — speed isn't a bonus, it's expected.",
    span: "small",
  },
  {
    id: "f3",
    scene: "03",
    title: "Found on Google",
    description:
      "A beautiful site nobody finds is just a poster. We build in SEO fundamentals from day one to give search engines a clearer understanding of your business; rankings depend on competition, relevance, and ongoing work.",
    span: "small",
  },
  {
    id: "f4",
    scene: "04",
    title: "Made to stand out",
    description:
      "No templates, no borrowed layouts. Your site is designed from scratch around your business, your customers, and your goals — so you never look like your competitor.",
    span: "small",
  },
  {
    id: "f5",
    scene: "05",
    title: "We don't disappear",
    description:
      "Launch day isn't the finish line. Updates, fixes, and improvements — we stay with you so your site keeps working while you run your business.",
    span: "small",
  },
] as const;

export const PREVIEW_TABS = [
  {
    id: "discover",
    label: "Discover",
    description:
      "We start with your business, not code. What you do, who your customers are, what they search for, and what your competitors are up to. Then we map exactly what your website needs to win.",
    specs: [
      { label: "Kickoff call", value: "1–2 days" },
      { label: "Deliverables", value: "Sitemap + copy plan" },
      { label: "Cost", value: "Included" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description:
      "Wireframes first, then design. Every page is built around one goal — helping a visitor take the next useful step — with a look that's unmistakably yours. You review, and we refine within the agreed scope and revision rounds.",
    specs: [
      { label: "Design", value: "Tailored to your brand" },
      { label: "Preview", value: "Clickable mockup" },
      { label: "Revisions", value: "Defined in the proposal" },
    ],
  },
  {
    id: "build",
    label: "Build",
    description:
      "Clean, modern code on a platform that's fast, secure, and easy to update. Mobile-first, SEO-ready, and tested on real phones — so it looks premium everywhere it loads.",
    specs: [
      { label: "Stack", value: "Modern web platform" },
      { label: "Mobile", value: "Responsive layouts" },
      { label: "SEO", value: "Technical foundations included" },
    ],
  },
  {
    id: "launch",
    label: "Launch & care",
    description:
      "We handle the domain, hosting, and going live — then we stay. Updates, SEO tweaks, and support so your website keeps earning for months and years, not just launch week.",
    specs: [
      { label: "Domain + hosting", value: "Handled for you" },
      { label: "Going live", value: "1–3 weeks typical" },
      { label: "Support", value: "Care plans included" },
    ],
  },
] as const;

export const BENEFITS = [
  {
    id: "b1",
    title: "One team, zero chaos",
    description:
      "Design, copy, build, and launch from the same small team. One person to talk to, one timeline, one price. No juggling freelancers who blame each other.",
  },
  {
    id: "b2",
    title: "Your business can't wait months",
    description:
      "We aim for 1–3 weeks on straightforward sites by keeping the scope focused and the work organized. Timelines depend on the pages, integrations, content, and feedback your project needs.",
  },
  {
    id: "b3",
    title: "Grows with your business",
    description:
      "Start with a site that gets you customers today. Add booking, an online store, or new pages whenever you're ready — without paying for a rebuild.",
  },
  {
    id: "b4",
    title: "We don't disappear",
    description:
      "Launch day isn't the finish line. We stay for updates, fixes, and the improvements that keep your website working while you run your business.",
  },
] as const;

export const PRICING_TIERS = [
  {
    id: "launch",
    name: "Launch",
    tagline: "For personal brands and simple local businesses",
    price: "₹19,000",
    priceRange: "₹19,000",
    highlighted: false,
    specs: [
      "1–3 custom-designed pages",
      "Mobile-first responsive layout",
      "Contact form",
      "Basic on-page SEO",
      "Deployment support",
      "Timeline agreed after scoping",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For cafés, salons, studios, and local businesses",
    price: "₹49,000",
    priceRange: "₹49,000",
    highlighted: false,
    specs: [
      "Up to 5–7 agreed pages",
      "Custom responsive website design",
      "Contact, WhatsApp, and map links",
      "SEO foundations and analytics setup",
      "Launch support",
      "CMS, ordering, and booking systems scoped separately",
    ],
  },
  {
    id: "signature-3d",
    name: "Signature 3D",
    tagline: "For brands that want a memorable, interactive 3D experience",
    price: "₹69,000",
    priceRange: "₹69,000",
    highlighted: true,
    specs: [
      "Up to 5–7 agreed pages",
      "Bespoke 3D / WebGL hero experience",
      "One custom interactive 3D scene",
      "Advanced motion and interaction design",
      "Responsive layouts and performance fallback",
      "SEO foundations and launch support",
      "Base 3D experience included — no 3D add-on fee",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "For e-commerce, ordering, booking, and custom platforms",
    price: "₹99,000+",
    priceRange: "₹99,000+",
    highlighted: false,
    specs: [
      "Technical discovery and custom scope",
      "E-commerce or online ordering workflows",
      "Payments, integrations, and automation",
      "Custom admin or CMS functionality",
      "Priority support options",
      "Timeline and fee based on requirements",
    ],
  },
] as const;

export const PRICING_ADDONS = [
  {
    name: "QR digital menu",
    price: "₹3,000–₹5,000",
    description: "Mobile-friendly menu page and QR destination.",
  },
  {
    name: "WhatsApp enquiry / order flow",
    price: "₹5,000–₹8,000",
    description: "Click-to-chat or a clearly defined enquiry flow.",
  },
  {
    name: "Table reservation workflow",
    price: "₹8,000–₹15,000",
    description: "Reservation request form or agreed provider integration.",
  },
  {
    name: "Editable menu / CMS",
    price: "₹10,000–₹15,000",
    description: "Owner editing for agreed content types, with roles and training.",
  },
  {
    name: "Additional custom page",
    price: "₹3,000–₹5,000",
    description: "One additional designed page using agreed content and functionality.",
  },
  {
    name: "Copywriting / content polish",
    price: "₹4,000–₹8,000",
    description: "Writing or editing supplied business content; photography excluded.",
  },
  {
    name: "Advanced motion / scroll",
    price: "₹5,000–₹9,000",
    description: "Additional motion beyond the selected package scope.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "q1",
    question: "Do I need to know anything technical?",
    answer:
      "No. You don't write code, buy hosting, or touch servers — we handle everything from domain to launch. You provide your photos, your services or menu, and your story; we do the rest.",
  },
  {
    id: "q2",
    question: "How long does a website take?",
    answer:
      "Most sites go live in 1–3 weeks. Personal sites take about a week, business sites 2–3 weeks, and bigger builds like online stores or booking systems a little longer. You see progress the whole way — never a black box.",
  },
  {
    id: "q3",
    question: "How much does it cost?",
    answer:
      "For India, Launch websites start at ₹19,000, Business websites at ₹49,000, Signature 3D websites at ₹69,000, and custom platforms at ₹99,000+. The Signature 3D base includes one bespoke 3D / WebGL hero experience and one custom interactive scene. Add-ons such as CMS, reservations, ordering, extra pages, and content work are priced separately. International projects are quoted in USD. Every project starts with a free discovery call and a written scope.",
  },
    id: "q4",
    question: "What do I need to provide?",
    answer:
      "Photos of your business, your services or menu, your story, and any branding you already have. No professional photos? We'll guide you on taking great ones with your phone — or we can shoot it for you.",
  },
  {
    id: "q5",
    question: "What happens after launch?",
    answer:
      "Optional care plans can cover updates, tweaks, backups, and support after launch. We'll agree on the scope and monthly cost up front, so you know what's covered and what would be quoted separately.",
  },
  {
    id: "q6",
    question: "Do you also make videos and content?",
    answer:
      "Photo or video can be scoped as an add-on when it supports the project. We’ll agree on the deliverables, production needs, and cost before work begins.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Services", href: "#features" },
    { label: "Process", href: "#preview" },
    { label: "Work", href: "#work" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "Vision", href: "#vision" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Email", href: `mailto:${CONTACT.contactEmail}` },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  social: [
    { label: SOCIAL.instagram.label, href: SOCIAL.instagram.url },
    { label: SOCIAL.x.label, href: SOCIAL.x.url },
    { label: SOCIAL.youtube.label, href: SOCIAL.youtube.url },
  ],
} as const;
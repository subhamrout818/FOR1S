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
      "Design, development, and launch — coordinated by the same small team. One person to talk to, one agreed scope, one timeline, and one price.",
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
      "We guide domain and hosting setup, deploy the agreed site, and include three months of defined post-launch maintenance. New features and third-party fees are separate unless the proposal explicitly includes them.",
    specs: [
      { label: "Domain + hosting", value: "Setup guidance; fees separate" },
      { label: "Going live", value: "Timeline agreed after scoping" },
      { label: "Support", value: "3 months of defined maintenance" },
    ],
  },
] as const;

export const BENEFITS = [
  {
    id: "b1",
    title: "One team, zero chaos",
    description:
      "Design, development, and launch from the same small team. One person to talk to, one agreed scope, one timeline, and one price.",
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
      "Start with a site that explains your business clearly and helps visitors take the next step. Add booking, an online store, or new pages later when the requirements and budget are clear.",
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
    id: "personal",
    name: "Personal",
    tagline: "For portfolios, freelancers, and personal brands",
    price: "₹15,000",
    priceRange: "₹12,000–₹18,000",
    highlighted: false,
    specs: [
      "1–3 pages, custom designed",
      "Responsive mobile-first layouts",
      "Contact form",
      "SEO fundamentals and page metadata",
      "Domain and hosting setup guidance",
      "3 months of defined post-launch maintenance",
      "Timeline agreed after scoping",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For local businesses that want to win online",
    price: "₹22,000",
    priceRange: "₹18,000–₹25,000",
    highlighted: true,
    specs: [
      "Up to 7 pages, custom designed",
      "Contact, map, and booking links",
      "Content structure and copy polish within agreed scope",
      "SEO fundamentals and page metadata",
      "Speed and responsive-layout checks",
      "3 months of defined post-launch maintenance",
      "Timeline agreed after scoping",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "E-commerce, booking systems, and custom requirements",
    price: "Custom quote",
    priceRange: "₹25,000+",
    highlighted: false,
    specs: [
      "Online store or custom features, defined in the proposal",
      "Booking/order integrations scoped and quoted separately",
      "Brand identity, logo, photo, or video add-ons if required",
      "3 months of defined post-launch maintenance",
      "Custom timeline based on requirements",
      "Ongoing care after the included period quoted separately",
    ],
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "q1",
    question: "Do I need to know anything technical?",
    answer:
      "No. You don't need to manage servers. We'll guide you through setup and make clear which domain, hosting, paid tools, or third-party fees are separate. You provide approved photos, service or menu details, and business information; we'll agree who handles the remaining content.",
  },
  {
    id: "q2",
    question: "How long does a website take?",
    answer:
      "A straightforward personal site may take around a week and a small business site around 2–3 weeks, depending on scope, content, integrations, and feedback. We confirm the timeline in the proposal and keep you updated as work progresses.",
  },
  {
    id: "q3",
    question: "How much does it cost?",
    answer:
      "Our indicative India pricing is ₹12,000–₹18,000 for a personal website, ₹18,000–₹25,000 for a small business website, and ₹25,000+ for custom requirements. These are starting ranges, not a fixed quote. Domain, hosting, paid tools, and third-party costs are separate unless the proposal explicitly includes them.",
  },
  {
    id: "q4",
    question: "What do I need to provide?",
    answer:
      "Photos of your business, your services or menu, your story, and any branding you already have. If you need professional photography or video, we can discuss whether a separately scoped add-on is suitable for your project.",
  },
  {
    id: "q5",
    question: "What happens after launch?",
    answer:
      "Our packages include three months of defined post-launch maintenance, with the exact coverage written into your proposal. New features, redesigns, third-party fees, and support after that period are quoted separately unless agreed otherwise.",
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
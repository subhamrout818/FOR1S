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
      "A beautiful site nobody finds is just a poster. SEO is built in from day one — so your business shows up when people search for what you do.",
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
      "Wireframes first, then design. Every page is built around one goal — turning a visitor into a customer — with a look that's unmistakably yours. You review, we refine, until you love it.",
    specs: [
      { label: "Design", value: "Tailored to your brand" },
      { label: "Preview", value: "Clickable mockup" },
      { label: "Revisions", value: "Until you love it" },
    ],
  },
  {
    id: "build",
    label: "Build",
    description:
      "Clean, modern code on a platform that's fast, secure, and easy to update. Mobile-first, SEO-ready, and tested on real phones — so it looks premium everywhere it loads.",
    specs: [
      { label: "Stack", value: "Modern web platform" },
      { label: "Mobile", value: "Perfect on every phone" },
      { label: "SEO", value: "Built in from day one" },
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
      "Most sites ship in 1–3 weeks — not because we cut corners, but because we've done this many times before. Your website goes live when it can start winning you customers.",
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
    id: "personal",
    name: "Personal",
    tagline: "For portfolios, freelancers, and personal brands",
    price: "$899",
    priceRange: "$499 – $1,499",
    highlighted: false,
    specs: [
      "1–3 pages, custom designed",
      "Mobile-first, loads fast",
      "Contact form",
      "SEO basics",
      "Domain + hosting set up",
      "Launch in ~1 week",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For local businesses that want to win online",
    price: "$2,900",
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
    id: "custom",
    name: "Custom",
    tagline: "E-commerce, booking systems, brands, and more",
    price: "$6,500",
    priceRange: "$4,500 – $12,000+",
    highlighted: false,
    specs: [
      "Online store or custom features",
      "Brand identity & logo",
      "Photo or video add-ons",
      "Priority support",
      "Monthly care plan",
      "Custom timeline",
    ],
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
      "It depends on what you need. Personal websites start around $499, business websites from $1,900, and custom builds are quoted individually. Every project starts with a free call, so you know exactly what it'll cost before we begin — no surprises.",
  },
  {
    id: "q4",
    question: "What do I need to provide?",
    answer:
      "Photos of your business, your services or menu, your story, and any branding you already have. No professional photos? We'll guide you on taking great ones with your phone — or we can shoot it for you.",
  },
  {
    id: "q5",
    question: "What happens after launch?",
    answer:
      "We offer care plans — updates, tweaks, backups, and support — so your site stays fast, secure, and fresh. Most clients keep us on a small monthly plan because it's cheaper than fixing things later.",
  },
  {
    id: "q6",
    question: "Do you also make videos and content?",
    answer:
      "Yes. We produce short commercials and brand videos for our website clients. Ask about bundled web + video deals — a video on your homepage is one of the fastest ways to build trust.",
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
    { label: SOCIAL.instagramPersonal.label, href: SOCIAL.instagramPersonal.url },
    { label: SOCIAL.x.label, href: SOCIAL.x.url },
    { label: SOCIAL.youtube.label, href: SOCIAL.youtube.url },
  ],
} as const;
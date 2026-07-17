export const BRAND = {
  name: "SAS",
  short: "MRD",
  filed: "SAS SYSTEMS™ — PLACEHOLDER MARK",
  tagline: "Your VISION, bought to life.",
};

export const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    id: "f1",
    scene: "01",
    title: "Zero-latency interface",
    description:
      "Every interaction is predicted before it's requested. Input to response in under a millisecond — fast enough to feel like thought, not software.",
    span: "large",
  },
  {
    id: "f2",
    scene: "02",
    title: "Adaptive thermal core",
    description:
      "A liquid-graphite cooling system that reshapes itself under load — silent at idle, cold under full performance. No fans, no noise, no throttling.",
    span: "small",
  },
  {
    id: "f3",
    scene: "03",
    title: "Machined from one block",
    description:
      "The chassis is carved from a single piece of aerospace-grade aluminum. No seams, no visible screws, no flex under pressure.",
    span: "small",
  },
  {
    id: "f4",
    scene: "04",
    title: "On-device intelligence",
    description:
      "Every model runs locally. Nothing you create leaves the machine unless you choose to send it — private by architecture, not by policy.",
    span: "small",
  },
  {
    id: "f5",
    scene: "05",
    title: "72-hour density",
    description:
      "A cell chemistry built for endurance, not headlines. Three full working days on a single charge, under real load.",
    span: "small",
  },
] as const;

export const PREVIEW_TABS = [
  {
    id: "performance",
    label: "Performance",
    description:
      "Sustained multi-core throughput tuned for real workloads, not synthetic peaks. It runs the same on hour eight as it does on minute one.",
    specs: [
      { label: "Sustained clock", value: "4.8 GHz" },
      { label: "Cores", value: "16" },
      { label: "Input latency", value: "0.2 ms" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description:
      "Machined from a single block of aerospace-grade aluminum and finished by hand. Nothing on the surface is there by accident.",
    specs: [
      { label: "Weight", value: "1.02 kg" },
      { label: "Thickness", value: "9.8 mm" },
      { label: "Finish", value: "Anodized graphite" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    description:
      "On-device model inference, fully private by default. Your work is yours — nothing is sent anywhere unless you say so.",
    specs: [
      { label: "Inference", value: "On-device" },
      { label: "Local model", value: "70B parameters" },
      { label: "Data sent by default", value: "0 KB" },
    ],
  },
  {
    id: "endurance",
    label: "Endurance",
    description:
      "Built for the full arc of a working week, not a single afternoon. Fast to top up, slow to fade.",
    specs: [
      { label: "Battery", value: "72 hr typical use" },
      { label: "Fast charge", value: "0–80% in 22 min" },
      { label: "Standby", value: "45 days" },
    ],
  },
] as const;

export const BENEFITS = [
  {
    id: "b1",
    title: "Focus, uninterrupted",
    description:
      "No fan noise. No thermal throttling mid-task. No notification bloat competing for your attention. Just the kind of silence that lets you notice you've been working for four hours.",
  },
  {
    id: "b2",
    title: "Carry less, do more",
    description:
      "One machine replaces the drawer of chargers, dongles, and backups. One bag, one charge, one less thing to think about before you leave the house.",
  },
  {
    id: "b3",
    title: "Private by default",
    description:
      "Intelligence that runs on-device means your drafts, your data, and your work stay exactly where you left them — even from us.",
  },
  {
    id: "b4",
    title: "Built to last a decade",
    description:
      "No glue holding it together. No parts designed to fail on schedule. We built SAS to be owned outright, not slowly replaced.",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "I stopped noticing the machine about a week in. That's the whole point of good tools — they disappear.",
    name: "Analiese K.",
    role: "Systems Architect",
  },
  {
    id: "t2",
    quote:
      "Three days of 8K timelines on a single charge. I didn't believe the number until I stopped charging it.",
    name: "Julian R.",
    role: "Documentary Editor",
  },
  {
    id: "t3",
    quote:
      "The first machine I've used that can run a full structural simulation without sounding like it's under attack.",
    name: "Priya M.",
    role: "Structural Engineer",
  },
  {
    id: "t4",
    quote:
      "Nothing leaves this thing unless I tell it to. That shouldn't feel rare in 2026, but it does.",
    name: "Devon T.",
    role: "Independent Researcher",
  },
  {
    id: "t5",
    quote:
      "It's the first product launch in years that felt like it was designed by people who actually use the thing.",
    name: "Mireille S.",
    role: "Product Designer",
  },
] as const;

export const PRICING_TIERS = [
  {
    id: "core",
    name: "Core",
    tagline: "For everyday precision",
    price: "$2,400",
    highlighted: false,
    specs: [
      "16GB unified memory",
      "512GB storage",
      "Zero-latency interface",
      "48-hour battery",
      "1-year limited warranty",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For sustained performance",
    price: "$3,200",
    highlighted: true,
    specs: [
      "32GB unified memory",
      "1TB storage",
      "Adaptive thermal core",
      "72-hour battery",
      "3-year limited warranty",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "For uncompromising work",
    price: "$4,600",
    highlighted: false,
    specs: [
      "64GB unified memory",
      "2TB storage",
      "Studio-finish chassis",
      "96-hour battery",
      "5-year limited warranty",
    ],
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "q1",
    question: "How is SAS different from a typical laptop?",
    answer:
      "SAS is designed and machined as a single system — chassis, cooling, and software built together rather than assembled from off-the-shelf parts. That's what lets it run silent, cool, and fast for the entire time you're using it, not just the first ten minutes.",
  },
  {
    id: "q2",
    question: "How long does it take to ship?",
    answer:
      "Reservations open today. First units begin shipping in the initial production run, with confirmed orders fulfilled in the sequence they were reserved. You'll receive a tracked shipping estimate as soon as your unit enters production.",
  },
  {
    id: "q3",
    question: "Can I upgrade storage or memory later?",
    answer:
      "Memory is unified into the core architecture and set at the time of build. Storage can be expanded through a certified service visit, keeping the sealed chassis intact and the warranty valid.",
  },
  {
    id: "q4",
    question: "What's covered under warranty?",
    answer:
      "Every configuration includes coverage for manufacturing defects, battery performance below rated capacity, and full parts and labor. Studio configurations include five years of coverage as standard.",
  },
  {
    id: "q5",
    question: "Is my data ever sent off-device?",
    answer:
      "Not by default. On-device intelligence means inference happens locally. Nothing is transmitted unless you explicitly enable a connected feature — and you can see exactly what's shared before you turn it on.",
  },
  {
    id: "q6",
    question: "Can I trade in an existing machine?",
    answer:
      "Yes. Trade-in credit is calculated during checkout based on your current device's condition and applied directly to your reservation total.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Preview", href: "#preview" },
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

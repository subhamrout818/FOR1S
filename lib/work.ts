/**
 * Concept projects and interactive demos showcasing FOR1S design and development.
 * These are not claims of completed client engagements.
 *
 * Replace concept copy with verified project details only when real client work
 * and outcomes can be substantiated. Do not imply unmeasured business results.

 */

export interface CaseStudy {
  slug: string;
  name: string;
  industry: string;
  year: string;
  tags: string[];
  summary: string;
  monogram: string;
  /** Accent gradient used for the mock thumbnail */
  hue: [string, string];
  services: string[];
  overview: string[];
  highlights: { label: string; value: string }[];
  /** Static screenshot of the built site — replaces the gradient mock when present */
  thumbnail?: string;
  /** Live demo URL — the hero screenshot links here when present */
  demoUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "brew-and-co",
    name: "Brew & Co.",
    industry: "Café & Restaurant",
    year: "2026",
    tags: ["Website", "Booking"],
    summary:
      "A café website concept exploring menu, hours, location, and a mobile-friendly booking journey.",
    monogram: "B",
    hue: ["#C9A06B", "#2C1D12"],
    thumbnail: "/demo/brew-and-co/hero.png",
    demoUrl: "/demo/brew-and-co/index.html",
    services: ["Design", "Build", "Booking flow", "SEO"],
    overview: [
      "Brew & Co. is a neighborhood café whose storefront was great but whose online presence didn't match it. They needed a site that answered the three questions customers actually ask: what's on the menu, when are you open, and how do I book a table.",
      "We designed a warm, editorial site around real photography and a simple, honest layout. One page for the story, one for the menu, one for hours and location, and a booking flow short enough to finish on a phone between customers.",
      "The site is built to load fast on mobile data, ranks for local searches like 'coffee near me', and is easy for the owners to update themselves — new menu items, holiday hours, and events in minutes, no developer needed.",
    ],
    highlights: [
      { label: "Pages", value: "4" },
      { label: "Booking flow", value: "3 taps" },
      { label: "Mobile-first", value: "Yes" },
      { label: "Launched", value: "2.5 weeks" },
    ],
  },
  {
    slug: "studio-arun",
    name: "Studio Arun",
    industry: "Photographer",
    year: "2026",
    tags: ["Portfolio", "Brand"],
    summary:
      "A photographer portfolio concept with a cinematic gallery and focused enquiry experience.",
    monogram: "A",
    hue: ["#C9A06B", "#0E0D0B"],
    thumbnail: "/demo/studio-arun/hero.png",
    demoUrl: "/demo/studio-arun/index.html",
    services: ["Design", "Build", "Branding", "Gallery"],
    overview: [
      "Studio Arun is a portrait and wedding photographer who was sharing work through social pages and messaging apps. Every enquiry started with 'send me your work', and every answer was a link to someone else's platform.",
      "We built a portfolio site that does the talking: a full-screen gallery that feels like the work, a clean structure that lets clients see weddings, portraits, and commercial work separately, and a simple enquiry form that lands bookings in one place.",
      "The design is minimal on purpose — the photography is the product. The site loads fast, looks premium on a phone when a potential client opens it mid-conversation, and gives the studio a home that isn't rented from anyone.",
    ],
    highlights: [
      { label: "Galleries", value: "3" },
      { label: "Portfolio site", value: "Yes" },
      { label: "Enquiry flow", value: "Included" },
      { label: "Launched", value: "2 weeks" },
    ],
  },
  {
    slug: "glow-and-co",
    name: "Glow & Co.",
    industry: "Salon & Spa",
    year: "2026",
    tags: ["Website", "Booking", "Brand"],
    summary:
      "A salon website concept exploring brand presentation, service information, and a booking journey.",
    monogram: "G",
    hue: ["#C2879B", "#5A2A3D"],
    thumbnail: "/demo/glow-and-co/hero.png",
    demoUrl: "/demo/glow-and-co/index.html",
    services: ["Design", "Build", "Online booking", "Brand"],
    overview: [
      "Glow & Co. is a salon where every detail is deliberate — except its website, which said nothing about the experience inside. They needed to match the premium feel of the space online and make booking painless.",
      "We designed an elegant, editorial site with the salon's own photography, clear services and pricing, and an online booking flow that sends confirmations and reminders automatically.",
      "Beyond the website, we tightened the brand — logo, typography, and color used consistently across the site. The result is a site that feels like the salon, gets found on Google, and turns a search into an appointment.",
    ],
    highlights: [
      { label: "Pages", value: "5" },
      { label: "Online booking", value: "Yes" },
      { label: "Brand refresh", value: "Included" },
      { label: "Launched", value: "3 weeks" },
    ],
  },
];

/**
 * Real client testimonials. Empty until the first real quotes exist —
 * the section only renders when there are entries. Add real words from
 * real clients here; never invent them.
 *
 * shape: { name, business, quote }
 */
export const TESTIMONIALS: { name: string; business: string; quote: string }[] = [];

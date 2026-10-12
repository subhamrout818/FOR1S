/**
 * Fictional concept projects and interactive demos showcasing FOR1S design
 * and development. These are not completed client engagements.
 *
 * Keep claims about client work, launches, timelines, and business outcomes out
 * of these entries until they can be supported by real project evidence.
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
    tags: ["Website concept", "Menu & location"],
    summary:
      "A fictional café website concept exploring menu discovery, opening hours, location, and a mobile-friendly booking journey.",
    monogram: "B",
    hue: ["#C9A06B", "#2C1D12"],
    thumbnail: "/demo/brew-and-co/hero.png",
    demoUrl: "/demo/brew-and-co/index.html",
    services: ["Visual design", "Responsive page structure", "Booking journey concept", "Local SEO structure"],
    overview: [
      "This fictional café concept starts with a familiar customer need: finding the menu, checking opening hours, getting directions, and understanding how to enquire about a table.",
      "The design direction uses a warm editorial style and a clear page structure for the café story, menu, and practical visit information. The booking journey is presented as a design concept, not a claim that a real café uses an automated reservation system.",
      "The build is a portfolio demonstration of how FOR1S could approach a café website. Search visibility, performance, owner-editable content, and business outcomes would need to be tested and agreed as part of a real client engagement.",
    ],
    highlights: [
      { label: "Illustrative scope", value: "4-page concept" },
      { label: "Primary goal", value: "Menu & visit info" },
      { label: "Layout", value: "Mobile-first" },
      { label: "Project status", value: "Concept demo" },
    ],
  },
  {
    slug: "studio-arun",
    name: "Studio Arun",
    industry: "Photographer",
    year: "2026",
    tags: ["Portfolio concept", "Gallery"],
    summary:
      "A fictional photographer portfolio concept with an editorial gallery and a focused enquiry experience.",
    monogram: "A",
    hue: ["#C9A06B", "#0E0D0B"],
    thumbnail: "/demo/studio-arun/hero.png",
    demoUrl: "/demo/studio-arun/index.html",
    services: ["Visual design", "Gallery direction", "Portfolio information architecture", "Enquiry journey concept"],
    overview: [
      "This fictional photographer concept explores how a portfolio can make work easy to browse without relying on a social feed as the only showcase.",
      "The proposed structure separates different photography categories, gives imagery room to lead, and makes the next enquiry step easy to find. It demonstrates a possible direction rather than documenting a real photographer's business or customer journey.",
      "A production portfolio would be tailored to the photographer's actual work, image rights, preferred enquiry process, accessibility needs, and performance requirements.",
    ],
    highlights: [
      { label: "Illustrative scope", value: "3 gallery categories" },
      { label: "Visual direction", value: "Editorial" },
      { label: "Enquiry path", value: "Concept" },
      { label: "Project status", value: "Concept demo" },
    ],
  },
  {
    slug: "glow-and-co",
    name: "Glow & Co.",
    industry: "Salon & Spa",
    year: "2026",
    tags: ["Website concept", "Brand direction"],
    summary:
      "A fictional salon website concept exploring service presentation, brand consistency, and a proposed booking journey.",
    monogram: "G",
    hue: ["#C2879B", "#5A2A3D"],
    thumbnail: "/demo/glow-and-co/hero.png",
    demoUrl: "/demo/glow-and-co/index.html",
    services: ["Visual design", "Service information architecture", "Brand direction", "Booking journey concept"],
    overview: [
      "This fictional salon concept explores a polished online presence where visitors can understand the service offering and find a clear next step.",
      "The proposed direction pairs editorial styling with a structured service and pricing presentation. Any booking integration, confirmation messages, or reminders would require a real provider, implementation, and end-to-end testing; they are not represented as live business functionality here.",
      "The concept shows how typography, color, page structure, and a considered booking journey could work together. A real engagement would be based on the salon's actual brand, services, booking process, and requirements.",
    ],
    highlights: [
      { label: "Illustrative scope", value: "5-page concept" },
      { label: "Service presentation", value: "Structured" },
      { label: "Brand direction", value: "Included in concept" },
      { label: "Project status", value: "Concept demo" },
    ],
  },
];

/**
 * Real client testimonials. Empty until the first real quotes exist — the
 * section only renders when there are entries. Never invent testimonials.
 *
 * shape: { name, business, quote }
 */
export const TESTIMONIALS: { name: string; business: string; quote: string }[] = [];

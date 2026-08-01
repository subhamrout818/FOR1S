// ──────────────────────────────────────────────
// Contact & Social credentials
// ──── UPDATE THESE WITH YOUR REAL INFO ─────────

/** Canonical production domain — used by sitemap, robots, and Open Graph. */
export const SITE_URL = "https://for1s.digital";

export const CONTACT = {
  /** Primary business email */
  email: "hello@for1s.digital",
  /** Contact / CC email (shown in footer) */
  contactEmail: "for1s.contact@gmail.com",
  /** WhatsApp number (international digits only, no +) */
  whatsapp: "919237302537",
  /** WhatsApp deep-link URL */
  whatsappUrl: "https://wa.me/919237302537",
  /** Booking / calendar link */
  calendar: "https://cal.com/for1s/consultation",
} as const;

export const SOCIAL = {
  instagramPersonal: {
    label: "Instagram",
    handle: "@btwitssubu",
    url: "https://instagram.com/btwitssubu",
  },
  x: {
    label: "X",
    handle: "@for1s",
    url: "https://x.com/for1s",
  },
  youtube: {
    label: "YouTube",
    handle: "FOR1S",
    url: "https://youtube.com/@for1s",
  },
} as const;

/** All contact / social entries as a flat list (useful for footers, headers, etc.) */
export const CONTACT_LINKS = [
  { label: "Email", href: `mailto:${CONTACT.email}` },
  { label: "Book a call", href: CONTACT.calendar },
] as const;

/** Social links as a flat list */
export const SOCIAL_LINKS = Object.values(SOCIAL) as readonly {
  label: string;
  handle: string;
  url: string;
}[];

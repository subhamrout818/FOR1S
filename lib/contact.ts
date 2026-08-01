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
  /** Primary phone number */
  phone: "+1 (555) 000-0000",
  /** WhatsApp number (international digits only, no +) */
  whatsapp: "919237302537",
  /** WhatsApp deep-link URL */
  whatsappUrl: "https://wa.me/919237302537",
  /** Physical / mailing address */
  address: {
    line1: "123 Business Avenue",
    line2: "Suite 100",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "US",
  },
  /** Booking / calendar link */
  calendar: "https://cal.com/for1s/consultation",
} as const;

export const SOCIAL = {
  instagramOfficial: {
    label: "Instagram - Official",
    handle: "",
    url: "#",
  },
  instagramPersonal: {
    label: "Instagram - Personal",
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
  { label: "Phone", href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { label: "Book a call", href: CONTACT.calendar },
] as const;

/** Social links as a flat list */
export const SOCIAL_LINKS = Object.values(SOCIAL) as readonly {
  label: string;
  handle: string;
  url: string;
}[];

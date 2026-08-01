import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import ContactForm from "@/components/contact/ContactForm";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — FOR1S",
  description:
    "Tell FOR1S where you want to go. We reply within 24 hours — no pitch decks, no pressure.",
  alternates: { canonical: "/contact" },
};

/* ------------------------------------------------------------------ */
/*  Contact channels                                                   */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  {
    label: "WhatsApp",
    value: "Chat with us",
    sub: CONTACT.whatsappUrl.replace("https://wa.me/", "+"),
    href: CONTACT.whatsappUrl,
    icon: "wa" as const,
  },
  {
    label: "Email",
    value: CONTACT.contactEmail,
    sub: "Replies within 24 hours",
    href: `mailto:${CONTACT.contactEmail}`,
    icon: "mail" as const,
  },
  {
    label: "Phone",
    value: CONTACT.phone,
    sub: "Mon–Fri, 9am–6pm",
    href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
    icon: "phone" as const,
  },
  {
    label: "Book a call",
    value: "Free discovery call",
    sub: "Pick a time that suits you",
    href: CONTACT.calendar,
    icon: "calendar" as const,
  },
];

function ChannelIcon({ icon }: { icon: (typeof CHANNELS)[number]["icon"] }) {
  if (icon === "mail") return <Mail size={18} strokeWidth={1.5} />;
  if (icon === "phone") return <Phone size={18} strokeWidth={1.5} />;
  if (icon === "calendar") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  // WhatsApp
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.507 14.307l-3.81-1.62a.72.72 0 00-.937.202l-.76.958a.465.465 0 01-.534.174 6.843 6.843 0 01-3.9-3.9.468.468 0 01.174-.534l.957-.76a.72.72 0 00.202-.938l-1.62-3.81a.72.72 0 00-.958-.396l-.79.316a1.5 1.5 0 00-.92 1.25A11.52 11.52 0 0016.593 16.7a1.5 1.5 0 001.25-.92l.316-.79a.72.72 0 00-.652-.683z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  return (
    <div className="relative mx-auto min-h-screen max-w-[1400px] px-6 pb-24 pt-32 lg:px-12">
      {/* Header */}
      <div className="mb-16">
        <SectionLabel scene="09" title="Contact" className="mb-6" />
        <SplitReveal
          as="h1"
          type="words"
          className="font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          Let&apos;s build something great.
        </SplitReveal>
        <RevealMask delay={0.15} y={12}>
          <p className="mt-6 max-w-xl text-base text-muted">
            Tell us where you want to go. We&apos;ll reply within 24 hours with
            next steps — no pitch decks, no pressure.
          </p>
        </RevealMask>
      </div>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Channels + address */}
        <RevealMask delay={0.15} y={24}>
          <div className="flex flex-col">
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
              Reach us directly
            </p>
            <div className="flex flex-col divide-y divide-hairline border-y border-hairline">
              {CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-cursor="hover"
                  className="group flex items-center gap-5 py-5 transition-colors duration-300"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-foreground/70 transition-colors duration-300 group-hover:text-accent">
                    <ChannelIcon icon={channel.icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted">
                      {channel.label}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {channel.value}
                    </p>
                    <p className="text-xs text-muted/70">{channel.sub}</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="ml-auto shrink-0 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  />
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-foreground/70">
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Studio
                </p>
                <p className="text-sm text-foreground/85">
                  {CONTACT.address.line1}
                  <br />
                  {CONTACT.address.city}, {CONTACT.address.state}{" "}
                  {CONTACT.address.zip}
                  <br />
                  {CONTACT.address.country}
                </p>
              </div>
            </div>
          </div>
        </RevealMask>

        {/* Form (client) */}
        <ContactForm />
      </div>
    </div>
  );
}

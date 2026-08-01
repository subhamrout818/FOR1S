import type { Metadata } from "next";
import { CONTACT } from "@/lib/contact";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy — FOR1S",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: [Date]</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            1. Introduction
          </h2>
          <p>
            {BRAND.name} Digital (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
            respects your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website or use our services.
          </p>
          <p className="mt-3">
            By accessing our website or engaging our services, you agree to the practices
            described in this policy. If you do not agree, please do not use our site or services.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            2. Information We Collect
          </h2>
          <h3 className="mb-1.5 font-medium text-foreground">Personal Data</h3>
          <p>
            We may collect personal identification information such as your name, email address,
            phone number, and company name when you fill out a contact form, book a call, or
            engage our services.
          </p>
          <h3 className="mb-1.5 mt-4 font-medium text-foreground">Usage Data</h3>
          <p>
            We automatically collect certain information when you visit our site, including your
            IP address, browser type, operating system, referring URLs, and pages viewed. This
            data helps us improve our website and services.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Provide, operate, and maintain our services</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Send project updates, invoices, and service-related communications</li>
            <li>Improve our website, offerings, and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            4. Data Sharing &amp; Disclosure
          </h2>
          <p>
            We do not sell your personal information. We may share data with trusted
            third-party service providers who assist us in operating our website and
            delivering our services (e.g., hosting, email, analytics), provided they
            agree to keep your information confidential.
          </p>
          <p className="mt-3">
            We may disclose information if required by law or to protect our rights,
            property, or safety.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            5. Cookies
          </h2>
          <p>
            Our website may use cookies and similar tracking technologies to enhance your
            experience. You can control cookie preferences through your browser settings.
            Disabling cookies may affect certain features of our site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            6. Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction. However, no
            method of transmission over the internet is completely secure.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            7. Your Rights
          </h2>
          <p>
            Depending on your jurisdiction, you may have the right to access, correct,
            update, or delete your personal information. To exercise these rights, please
            contact us at{" "}
            <a
              href={`mailto:${CONTACT.contactEmail}`}
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              {CONTACT.contactEmail}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted
            on this page with an updated revision date. We encourage you to review this
            policy periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            9. Contact
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please reach out to us
            at{" "}
            <a
              href={`mailto:${CONTACT.contactEmail}`}
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              {CONTACT.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}

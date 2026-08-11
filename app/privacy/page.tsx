import type { Metadata } from "next";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy — FOR1S",
  alternates: { canonical: "/privacy" },
};

function EmailLink() {
  return (
    <a
      href={`mailto:${CONTACT.contactEmail}`}
      className="text-accent underline underline-offset-2 hover:no-underline"
    >
      {CONTACT.contactEmail}
    </a>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1.5 mt-4 font-medium text-foreground">{children}</h3>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: August 11, 2026</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <p>
          FOR1S (&ldquo;FOR1S&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) respects your privacy and is committed to protecting the personal
          information you provide to us. This Privacy Policy explains what information we
          collect, how we use it, how we protect it, and your choices when using the FOR1S
          website, client portal, and services.
        </p>
        <p>
          By using FOR1S, you acknowledge that you have read and understood this Privacy
          Policy.
        </p>

        <section>
          <H2>1. Information We Collect</H2>
          <p>Depending on how you interact with FOR1S, we may collect:</p>

          <H3>Account Information</H3>
          <List
            items={[
              "Name",
              "Email address",
              "Password",
              "Profile information",
              "Company or business information",
              "Profile image, where applicable",
            ]}
          />

          <H3>Project and Service Information</H3>
          <List
            items={[
              "Business information",
              "Project requirements",
              "Website requirements",
              "Brand information",
              "Content and assets",
              "Contact details",
              "Other information necessary to provide our services",
            ]}
          />

          <H3>Communications</H3>
          <p>
            If you contact us through our contact form, email, support system, or ticket
            system, we may collect the information contained in those communications and the
            details necessary to respond to your request.
          </p>

          <H3>Authentication Information</H3>
          <p>
            If you use third-party authentication such as Google Sign-In, we may receive
            information provided by that authentication provider, such as your name, email
            address, and profile information, subject to the provider&rsquo;s policies and
            your settings.
          </p>

          <H3>Technical Information</H3>
          <p>When you use our website, certain technical information may be automatically collected, including:</p>
          <List
            items={[
              "IP address",
              "Browser type",
              "Device type",
              "Operating system",
              "Pages visited",
              "Basic website usage information",
              "Error and security information",
            ]}
          />
        </section>

        <section>
          <H2>2. How We Use Your Information</H2>
          <p>We may use your information to:</p>
          <List
            items={[
              "Create and manage your FOR1S account.",
              "Authenticate and secure your account.",
              "Provide website development and related services.",
              "Communicate with you about projects and inquiries.",
              "Respond to support requests and tickets.",
              "Manage client projects through the client portal.",
              "Improve our website, services, and user experience.",
              "Detect, prevent, and investigate fraud, abuse, and unauthorized access.",
              "Maintain the security and reliability of our systems.",
              "Comply with applicable laws and legal obligations.",
            ]}
          />
          <p className="mt-3">We do not sell your personal information.</p>
        </section>

        <section>
          <H2>3. Cookies</H2>
          <p>
            FOR1S may use cookies and similar technologies necessary for website
            functionality and security.
          </p>
          <p>These may include cookies used to:</p>
          <List
            items={[
              "Maintain secure login sessions.",
              "Authenticate users.",
              "Protect authentication and account functionality.",
              "Maintain necessary preferences.",
              "Protect the website against abuse and unauthorized activity.",
            ]}
          />
          <p className="mt-3">
            Some cookies are essential to the operation of the website and may not be
            disabled without affecting certain functionality.
          </p>
        </section>

        <section>
          <H2>4. How We Share Information</H2>
          <p>
            We may share information with trusted service providers when necessary to operate
            FOR1S and provide our services.
          </p>
          <p>These providers may include services for:</p>
          <List
            items={[
              "Website hosting",
              "Authentication",
              "Infrastructure",
              "Email delivery",
              "Security",
              "Analytics",
              "Database and storage services",
              "Other technical services required to operate FOR1S",
            ]}
          />
          <p className="mt-3">
            We only provide information to third parties where reasonably necessary for the
            relevant service or purpose.
          </p>
          <p className="mt-3">
            We may also disclose information where required by law, legal process, court
            order, or to protect the rights, security, and property of FOR1S, our users, or
            others.
          </p>
        </section>

        <section>
          <H2>5. Third-Party Services</H2>
          <p>
            FOR1S may integrate with or rely on third-party services, including authentication
            providers and infrastructure providers.
          </p>
          <p className="mt-3">
            These third parties may have their own privacy policies and terms. FOR1S is not
            responsible for the independent privacy practices of third-party services.
          </p>
        </section>

        <section>
          <H2>6. Data Security</H2>
          <p>
            We use reasonable technical and organizational security measures designed to
            protect personal information against unauthorized access, alteration, disclosure,
            loss, or destruction.
          </p>
          <p className="mt-3">
            These measures may include secure authentication mechanisms, encrypted
            connections, secure cookies, password hashing, access controls, rate limiting,
            input validation, and other reasonable security controls.
          </p>
          <p className="mt-3">
            However, no internet service or electronic storage system can be guaranteed to be
            completely secure.
          </p>
        </section>

        <section>
          <H2>7. Data Retention</H2>
          <p>We retain personal information only for as long as reasonably necessary to:</p>
          <List
            items={[
              "Provide our services.",
              "Maintain user accounts.",
              "Manage projects.",
              "Respond to support requests.",
              "Prevent fraud and abuse.",
              "Resolve disputes.",
              "Comply with legal obligations.",
            ]}
          />
          <p className="mt-3">
            When information is no longer reasonably required, we may delete or anonymize it,
            subject to applicable legal and operational requirements.
          </p>
        </section>

        <section>
          <H2>8. Your Rights</H2>
          <p>
            Depending on applicable law, you may have rights regarding your personal
            information, including the right to:
          </p>
          <List
            items={[
              "Request access to personal information we hold about you.",
              "Request correction of inaccurate information.",
              "Request deletion of information where legally applicable.",
              "Withdraw consent where processing is based on consent.",
              "Raise concerns regarding the handling of your personal information.",
            ]}
          />
          <p className="mt-3">
            To make a privacy request, contact us using the details below.
          </p>
          <p className="mt-3">
            We may need to verify your identity before fulfilling certain requests.
          </p>
        </section>

        <section>
          <H2>9. Children&rsquo;s Privacy</H2>
          <p>
            FOR1S does not knowingly intend to collect personal information from children in
            circumstances where such collection is prohibited by applicable law.
          </p>
          <p className="mt-3">
            If you believe that a child has provided personal information to us in
            circumstances where it should not have been collected, please contact us.
          </p>
        </section>

        <section>
          <H2>10. International Data Processing</H2>
          <p>
            Depending on the third-party services and infrastructure used by FOR1S, your
            information may be processed or stored in countries other than your country of
            residence.
          </p>
          <p className="mt-3">
            Where applicable, we will take reasonable steps to ensure such processing is
            carried out in accordance with applicable data protection requirements.
          </p>
        </section>

        <section>
          <H2>11. Changes to This Privacy Policy</H2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes to our
            services, technology, legal requirements, or business practices.
          </p>
          <p className="mt-3">
            When changes are made, we will update the &ldquo;Last Updated&rdquo; date at the
            top of this page.
          </p>
        </section>

        <section>
          <H2>12. Contact and Support</H2>
          <p>For privacy questions, concerns, or requests:</p>
          <p className="mt-3">
            FOR1S
            <br />
            Email: <EmailLink />
          </p>
          <p className="mt-3">
            For account, project, or service-related issues, you may also raise a support
            ticket through the FOR1S client portal, where available.
          </p>
          <p className="mt-3">
            We will review support and privacy requests and respond within a reasonable
            period.
          </p>
        </section>
      </div>
    </main>
  );
}

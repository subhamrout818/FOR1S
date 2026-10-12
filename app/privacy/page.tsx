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
    <div className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: October 12, 2026</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <p>
          FOR1S is a trade name used by Subham Rout, an individual operating from India
          (“FOR1S,” “we,” “us,” or “our”). This Privacy Policy explains how the individual
          operating FOR1S collects, uses, stores, shares, and protects personal information
          through the FOR1S website, client portal, and services.
        </p>
        <p>
          This policy describes our general practices; the information actually processed
          depends on the features you use and the third-party services enabled at the time.
          Where applicable law requires a specific legal basis, notice, or consent, we will
          rely on the applicable basis and provide any required notice or choice.
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
          <p className="mt-3">
            We do not sell personal information. We use information only for the purposes
            described here or purposes otherwise disclosed to you and permitted by applicable
            law. Where applicable, processing may be necessary to provide a requested
            service, meet a legal obligation, protect security, or pursue a legitimate
            operational purpose; where consent is required, we will request it.
          </p>
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
            Essential cookies may be required for login, security, and core site functions.
            Browser settings may let you block some cookies, but doing so can break features.
            If non-essential analytics, advertising, or embedded third-party technologies are
            enabled, this policy should be updated to identify them and explain the available
            consent or preference controls. We will obtain consent where applicable law
            requires it. We do not intend this section to imply that any optional tracking
            technology is active unless it is actually enabled.
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
            Depending on the features in use, service providers may process information on
            our behalf for hosting and deployment, database and storage, authentication,
            email delivery, security, error monitoring, or analytics. These providers are
            permitted to use information as needed to deliver their services and subject to
            applicable contractual and legal restrictions. The specific providers and their
            data locations can change; you may contact us to ask which providers are used for
            a particular feature.
          </p>
          <p className="mt-3">
            We do not knowingly enable a provider to use personal information for its own
            unrelated advertising purposes. We may disclose information where required by law
            or where reasonably necessary to protect rights, safety, and security.
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
            Third-party services may process information in countries other than your own and
            are governed by their own terms and privacy notices. We remain responsible for
            describing our own collection and use accurately and will take steps required by
            applicable law when engaging service providers or arranging international
            transfers. Links or details for a provider may be supplied on request where
            appropriate.
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
            Security controls are reviewed and applied according to the systems and features
            actually in use; no internet service or electronic storage system can be
            guaranteed to be completely secure. If a personal-data incident occurs, we will
            assess it and notify affected people or authorities where and when required by
            applicable law.
          </p>
        </section>

        <section>
          <H2>7. Data Retention</H2>
          <p>
            We retain personal information only for as long as reasonably necessary for the
            purpose for which it was collected, taking account of legal requirements,
            security, dispute resolution, and legitimate business records. Our retention
            criteria are:
          </p>
          <List
            items={[
              "Account and profile data: while the account remains active and for a reasonable period after closure to handle security, recovery, disputes, or legal obligations.",
              "Project records, briefs, approvals, invoices, and business correspondence: for the period needed to perform the engagement and maintain appropriate tax, accounting, contractual, and dispute records.",
              "Support tickets and communications: while needed to resolve the request and maintain a reasonable support and security history.",
              "Security, access, and error logs: for the period needed to investigate abuse, maintain service security, and diagnose reliability issues.",
              "Backups: until overwritten or deleted through the normal backup lifecycle, subject to security and recovery requirements.",
            ]}
          />
          <p className="mt-3">
            These are retention criteria, not a promise that every record is deleted on the
            same day. Where practicable, we will delete or anonymize information when it is
            no longer needed, and restrict access to records retained for legal, security, or
            backup purposes.
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
            To submit a request, email us from the address associated with your account where
            possible and describe the information or action you are requesting. We may ask
            for reasonable information to verify your identity and clarify the scope of the
            request. We aim to respond within the period required by applicable law; if no
            specific period applies, we will respond within a reasonable time.
          </p>
          <p className="mt-3">
            You may also request account closure or deletion. We will delete or de-identify
            eligible personal information, subject to information we must retain for legal,
            accounting, security, dispute-resolution, or backup purposes. Closing an account
            does not automatically remove records we are legally required or otherwise
            permitted to retain. If you believe your request has not been handled properly,
            you may raise a complaint with the competent data-protection or other authority
            available under the law that applies to you.
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
            Where a transfer is subject to legal safeguards, we will take the steps required
            by applicable law. You may contact us for information about relevant processing
            locations or transfer safeguards, to the extent that information is available
            and may lawfully be disclosed.
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
          <p>For privacy questions, concerns, access, correction, or deletion requests:</p>
          <p className="mt-3">
            Operated by Subham Rout, an individual based in India, under the trade name FOR1S.
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
    </div>
  );
}

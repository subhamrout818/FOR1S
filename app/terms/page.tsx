import type { Metadata } from "next";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Service — FOR1S",
  alternates: { canonical: "/terms" },
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

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: October 12, 2026</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
          FOR1S website, client portal, and services.
        </p>
        <p>
          By accessing or using FOR1S, you agree to these Terms. If you do not agree with
          these Terms, please do not use our website or services.
        </p>

        <section>
          <H2>1. About FOR1S</H2>
          <p>
            FOR1S is a trade name used by Subham Rout, an individual operating from India
            (referred to in these Terms as “FOR1S,” “we,” “us,” or “our”). FOR1S is not a
            separate incorporated company. FOR1S provides website design, website development,
            digital experiences, and related digital services.
          </p>
          <p className="mt-3">
            Project-specific requirements, deliverables, timelines, pricing, revisions,
            ownership, support, and other commercial terms will be set out in a written
            proposal, quotation, statement of work, or project agreement accepted by both
            parties. Contact details for FOR1S appear at the end of these Terms.
          </p>
        </section>

        <section>
          <H2>2. Accounts</H2>
          <p>Certain FOR1S features may require you to create an account.</p>
          <p className="mt-3">You are responsible for:</p>
          <List
            items={[
              "Providing accurate information.",
              "Keeping your account information up to date.",
              "Maintaining the confidentiality of your account credentials.",
              "Keeping access to your email account secure.",
              "Not sharing your account credentials with unauthorized individuals.",
              "Informing us if you suspect unauthorized access to your account.",
            ]}
          />
          <p className="mt-3">
            You are responsible for activity carried out through your account unless the
            activity resulted from circumstances outside your reasonable control.
          </p>
        </section>

        <section>
          <H2>3. Our Services</H2>
          <p>FOR1S may provide services including:</p>
          <List
            items={[
              "Website design",
              "Website development",
              "Front-end development",
              "Back-end development",
              "UI/UX development",
              "Website maintenance",
              "Digital experiences",
              "Other services agreed upon with a client",
            ]}
          />
          <p className="mt-3">
            The exact services provided will depend on the individual project agreement or
            proposal.
          </p>
        </section>

        <section>
          <H2>4. Project Requirements</H2>
          <p>
            Clients are responsible for providing accurate and timely information required
            for their projects.
          </p>
          <p className="mt-3">This may include:</p>
          <List
            items={[
              "Business information",
              "Branding materials",
              "Images",
              "Text",
              "Logos",
              "Website content",
              "Technical requirements",
              "Access credentials where necessary",
            ]}
          />
          <p className="mt-3">
            Clients represent that they have the necessary rights and permissions to provide
            materials to FOR1S.
          </p>
          <p className="mt-3">
            Delays caused by missing information, approvals, content, or access may affect
            project timelines.
          </p>
        </section>

        <section>
          <H2>5. Project Scope and Changes</H2>
          <p>
            The scope of each project may be established through a proposal, quotation,
            agreement, or other written communication.
          </p>
          <p className="mt-3">Requests outside the agreed scope may require:</p>
          <List
            items={[
              "Additional fees",
              "Additional development time",
              "A revised project scope",
              "A separate agreement",
            ]}
          />
          <p className="mt-3">
            A change that affects price, deliverables, or timeline should be approved in
            writing by both parties before the additional work begins. If the parties do not
            agree on a proposed change, the existing agreed scope will continue to apply.
          </p>
        </section>

        <section>
          <H2>6. Revisions and Approvals</H2>
          <p>
            The number of revisions or changes included in a project may depend on the
            individual project agreement.
          </p>
          <p className="mt-3">
            Clients are responsible for reviewing and approving deliverables within a
            reasonable period.
          </p>
          <p className="mt-3">
            The project agreement should state the included revision rounds, what counts as a
            revision, the approval method, and any review deadlines. Unless the agreement says
            otherwise, approval of a deliverable confirms that stage is accepted; later
            requests that change an approved direction or add functionality may be treated as
            additional paid work. Client delays in providing feedback, content, or approvals
            may move the delivery date.
          </p>
        </section>

        <section>
          <H2>7. Payments</H2>
          <p>
            Project pricing and payment terms will be established separately between FOR1S
            and the client.
          </p>
          <p className="mt-3">
            FOR1S does not currently process project payments directly through this website.
          </p>
          <p className="mt-3">
            Payment arrangements may therefore be handled separately between FOR1S and the
            client through an agreed method.
          </p>
          <p className="mt-3">
            Before work begins, the written project agreement should identify the project
            price and currency, deposit and milestone amounts, invoice due dates, applicable
            taxes, what happens if a payment is late, and any third-party or recurring charges.
            Work may be paused after reasonable notice if an undisputed payment remains
            overdue.
          </p>
          <p className="mt-3">
            Cancellation, refunds, and payment for work completed or committed costs will be
            governed by the written project agreement and applicable law. Do not assume that
            a deposit is refundable or non-refundable unless the agreement clearly says so.
            Any mandatory consumer rights remain unaffected.
          </p>
          <p className="mt-3">
            Unless the project agreement expressly provides otherwise, delivery or transfer
            of rights in bespoke final deliverables may be withheld until all amounts due for
            that project have been paid. The agreement should also identify responsibility
            for domain registration, hosting, third-party subscriptions, renewals, handover,
            and any post-launch maintenance.
          </p>
        </section>

        <section>
          <H2>8. Intellectual Property</H2>
          <p>Unless otherwise agreed in writing:</p>
          <List
            items={[
              "Client-provided materials remain the property of the client or their respective owners.",
              "FOR1S retains ownership of its pre-existing code, frameworks, templates, reusable components, tools, methods, and other proprietary materials.",
              "Third-party software, libraries, fonts, images, icons, and other assets remain subject to their respective licenses.",
              "Unless the project agreement expressly provides otherwise, rights in bespoke final deliverables transfer or are licensed to the client only after full payment, as specified in that agreement.",
            ]}
          />
          <p className="mt-3">
            Nothing in these Terms automatically transfers ownership of FOR1S&rsquo;s
            pre-existing intellectual property.
          </p>
        </section>

        <section>
          <H2>9. Portfolio and Showcase Rights</H2>
          <p>
            FOR1S will seek the client&apos;s written permission before displaying client work,
            project screenshots, designs, name, logo, or project details in a portfolio,
            case study, website, social media, presentation, or other promotional material.
            Permission may specify what may be shown and when it may be published.
          </p>
          <p className="mt-3">
            FOR1S will not intentionally publish confidential information, unreleased work,
            credentials, private business data, or non-public project materials without
            written authorization. A client may request confidentiality or a delayed
            showcase in the project agreement.
          </p>
        </section>

        <section>
          <H2>10. Third-Party Services and Software</H2>
          <p>
            FOR1S may use third-party services, APIs, hosting providers, authentication
            systems, libraries, frameworks, or other external technologies.
          </p>
          <p className="mt-3">
            Third-party services may be subject to their own terms, licenses, privacy
            policies, and availability.
          </p>
          <p className="mt-3">
            FOR1S cannot guarantee the continuous availability or performance of independent
            third-party services.
          </p>
        </section>

        <section>
          <H2>11. Acceptable Use</H2>
          <p>You agree not to:</p>
          <List
            items={[
              "Attempt to gain unauthorized access to FOR1S accounts, systems, APIs, or infrastructure.",
              "Attempt to bypass security mechanisms.",
              "Interfere with or disrupt FOR1S services.",
              "Upload or transmit malicious software, code, or files.",
              "Abuse authentication, forms, APIs, support systems, or other functionality.",
              "Attempt to access another user's account.",
              "Use FOR1S for unlawful purposes.",
              "Use FOR1S to distribute harmful, fraudulent, or malicious content.",
              "Conduct security testing or penetration testing against FOR1S without prior written authorization.",
            ]}
          />
          <p className="mt-3">
            We may restrict or suspend access where necessary to protect FOR1S, our users, or
            our infrastructure.
          </p>
        </section>

        <section>
          <H2>12. Security</H2>
          <p>
            You must not intentionally attempt to compromise the security of FOR1S or its
            users.
          </p>
          <p className="mt-3">
            If you discover a potential security vulnerability, please report it responsibly
            to: <EmailLink />
          </p>
          <p className="mt-3">
            Please do not exploit, publicly disclose, or use a vulnerability to access
            information belonging to other users.
          </p>
        </section>

        <section>
          <H2>13. Support Tickets</H2>
          <p>
            Clients may raise support tickets through the FOR1S client portal where the
            feature is available.
          </p>
          <p className="mt-3">Support tickets may be used for:</p>
          <List
            items={[
              "Project-related issues",
              "Website issues",
              "Account issues",
              "Service-related questions",
              "Other legitimate support requests",
            ]}
          />
          <p className="mt-3">
            FOR1S will make reasonable efforts to review and respond to support requests.
          </p>
          <p className="mt-3">
            Response times may vary depending on the nature and complexity of the request.
          </p>
        </section>

        <section>
          <H2>14. Service Availability</H2>
          <p>We aim to keep FOR1S and its services available and functional.</p>
          <p className="mt-3">However, we do not guarantee that:</p>
          <List
            items={[
              "The website will always be available.",
              "The website will always be error-free.",
              "Services will never experience downtime.",
              "Third-party services will always be available.",
              "All defects will be immediately corrected.",
            ]}
          />
          <p className="mt-3">
            We may temporarily suspend or modify services for maintenance, security updates,
            infrastructure changes, or other operational reasons.
          </p>
        </section>

        <section>
          <H2>15. Disclaimer</H2>
          <p>
            To the maximum extent permitted by applicable law, FOR1S provides its website and
            services on an &ldquo;as available&rdquo; basis.
          </p>
          <p className="mt-3">
            We do not guarantee that the website or services will always be uninterrupted,
            completely secure, or free from errors.
          </p>
        </section>

        <section>
          <H2>16. Limitation of Liability</H2>
          <p>
            To the maximum extent permitted by applicable law, FOR1S will not be liable for
            indirect, incidental, consequential, special, or punitive losses arising from or
            related to the use of our website or services.
          </p>
          <p className="mt-3">
            To the maximum extent permitted by applicable law, the aggregate liability of
            FOR1S arising out of a particular project or service will not exceed the fees
            paid or payable to FOR1S for that project or service under the applicable written
            agreement. This proposed limit does not apply to liability that cannot legally
            be excluded or limited, and does not override any non-waivable statutory rights.
            The project agreement may set out a different lawful allocation of risk.
          </p>
          <p className="mt-3">
            Clients remain responsible for maintaining their own copies of materials and
            credentials they control, and for third-party charges or services contracted in
            their own name. Nothing here guarantees a particular business result, search
            ranking, revenue outcome, or uninterrupted third-party service.
          </p>
          <p className="mt-3">
            These limitations should be read subject to applicable law and do not exclude
            liability for fraud, wilful misconduct, or other liability that cannot lawfully
            be limited.
          </p>
        </section>

        <section>
          <H2>17. Account Suspension or Termination</H2>
          <p>FOR1S may suspend or terminate an account where reasonably necessary, including where:</p>
          <List
            items={[
              "These Terms are violated.",
              "The account is used for unlawful activity.",
              "The account creates a security risk.",
              "The service is being abused.",
              "Unauthorized access or fraudulent activity is suspected.",
            ]}
          />
          <p className="mt-3">
            Where appropriate, we may provide notice before suspension or termination.
          </p>
        </section>

        <section>
          <H2>18. Client Project Termination</H2>
          <p>
            Termination of an individual client project will generally be governed by the
            applicable project agreement or written arrangement between FOR1S and the client.
          </p>
          <p className="mt-3">
            Any outstanding obligations, payments, intellectual-property provisions,
            confidentiality requirements, or other provisions intended to survive termination
            will continue to apply where applicable.
          </p>
        </section>

        <section>
          <H2>19. Confidentiality</H2>
          <p>
            FOR1S will make reasonable efforts to protect confidential information provided
            by clients for the purpose of performing agreed services.
          </p>
          <p className="mt-3">
            Clients should clearly identify information that is confidential where
            appropriate.
          </p>
          <p className="mt-3">
            Confidentiality obligations may also be established through a separate agreement
            between FOR1S and the client.
          </p>
        </section>

        <section>
          <H2>20. Changes to These Terms</H2>
          <p>We may update these Terms from time to time.</p>
          <p className="mt-3">
            When changes are made, we will update the &ldquo;Last Updated&rdquo; date at the
            top of this page.
          </p>
          <p className="mt-3">
            Changes to these website Terms apply prospectively from the stated effective
            date, subject to applicable law. Where a change materially affects users, we will
            take reasonable steps to provide notice. If a change requires consent, we will
            seek that consent where required by law.
          </p>
          <p className="mt-3">
            An existing signed project agreement or accepted proposal will continue to govern
            that project if it conflicts with these general website Terms, unless the parties
            expressly agree in writing to change it. Publishing an updated version of these
            Terms alone does not amend an existing project agreement.
          </p>
        </section>

        <section>
          <H2>21. Governing Law</H2>
          <p>
            These Terms are governed by the laws of India, subject to any mandatory
            protections or rules that apply to a client under the law of their place of
            residence.
          </p>
          <p className="mt-3">
            Subject to applicable law, disputes may be brought before courts of competent
            jurisdiction in India. Nothing in this section removes a mandatory right to bring
            a claim in another forum where the law requires that right to be available.
            Project agreements should address dispute escalation and any lawful dispute
            resolution process for the specific engagement.
          </p>
        </section>

        <section>
          <H2>22. Contact and Support</H2>
          <p>For questions regarding these Terms, projects, accounts, or services:</p>
          <p className="mt-3">
            Operated by Subham Rout, an individual based in India, under the trade name FOR1S.
            <br />
            Email: <EmailLink />
          </p>
          <p className="mt-3">
            For account, project, or service-related issues, you may also raise a support
            ticket through your FOR1S dashboard, where available.
          </p>
        </section>
      </div>
    </div>
  );
}

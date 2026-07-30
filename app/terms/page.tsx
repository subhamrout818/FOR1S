import type { Metadata } from "next";
import { CONTACT } from "@/lib/contact";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions — FOR1S",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: [Date]</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the {BRAND.name} website and services, you agree to be
            bound by these Terms &amp; Conditions. If you do not agree, please do not use
            our website or services.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            2. Services
          </h2>
          <p>
            {BRAND.name} Digital provides full-stack SaaS development, web design, brand
            content, and video production services. The specific scope, deliverables,
            timeline, and fees for each engagement will be outlined in a separate
            project proposal or contract signed by both parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            3. Intellectual Property
          </h2>
          <h3 className="mb-1.5 font-medium text-foreground">Client Ownership</h3>
          <p>
            Upon full payment, the client retains ownership of all custom code, designs,
            and deliverables created specifically for their project, unless otherwise
            agreed in writing.
          </p>
          <h3 className="mb-1.5 mt-4 font-medium text-foreground">Our Rights</h3>
          <p>
            We reserve the right to display completed work in our portfolio unless a
            non-disclosure agreement is in place. We also retain the right to reuse
            general-purpose code, libraries, and frameworks developed during the project.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            4. Payments &amp; Fees
          </h2>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Payment terms are outlined in the project proposal or contract.</li>
            <li>A deposit or milestone payment may be required before work begins.</li>
            <li>
              Late payments may result in work stoppage until the outstanding balance
              is settled.
            </li>
            <li>
              All fees are non-refundable unless otherwise stated in the contract.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            5. Project Timeline &amp; Delays
          </h2>
          <p>
            We commit to the timeline outlined in the project proposal. Delays caused by
            client feedback cycles, late dependencies, or force majeure events may extend
            the timeline. We will communicate any expected delays promptly.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            {BRAND.name} Digital shall not be liable for any indirect, incidental,
            special, or consequential damages arising from the use of our services or
            website. Our total liability is limited to the amount paid by the client
            for the specific service giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            7. Confidentiality
          </h2>
          <p>
            Both parties agree to keep confidential any proprietary information shared
            during the course of the project. This includes business strategies,
            technical architectures, user data, and any other non-public information.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            8. Termination
          </h2>
          <p>
            Either party may terminate a project engagement with written notice per the
            terms in the contract. Upon termination, the client shall pay for all work
            completed up to the termination date. Deliverables produced up to that point
            will be provided to the client.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            9. Governing Law
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of
            [Your Jurisdiction]. Any disputes shall be resolved in the courts of
            [Your Jurisdiction].
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold uppercase tracking-wide text-foreground">
            10. Contact
          </h2>
          <p>
            For questions about these Terms &amp; Conditions, please contact us at{" "}
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

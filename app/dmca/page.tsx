import type { Metadata } from "next";
import { DMCA_AGENT } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Copyright & DMCA Policy — FOR1S",
  alternates: { canonical: "/dmca" },
};

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

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <h1 className="font-display text-fluid-lg font-bold uppercase tracking-tightest text-foreground">
        Copyright &amp; DMCA Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: November 3, 2026</p>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-foreground/80">
        <p>
          FOR1S respects intellectual property rights and expects its users to do the same.
          Clients can upload images and files to their project workspace. If you believe
          something on FOR1S infringes your copyright, you can ask us to remove it using the
          process below, which follows the U.S. Digital Millennium Copyright Act (17 U.S.C. §
          512).
        </p>

        <section>
          <H2>Designated copyright agent</H2>
          <p>Send copyright notices and counter-notices to:</p>
          <address className="mt-2 not-italic">
            <p>{DMCA_AGENT.name}, FOR1S</p>
            {DMCA_AGENT.postalAddress && <p>{DMCA_AGENT.postalAddress}</p>}
            <p>
              Email:{" "}
              <a
                href={`mailto:${DMCA_AGENT.email}`}
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                {DMCA_AGENT.email}
              </a>
            </p>
          </address>
        </section>

        <section>
          <H2>How to file a takedown notice</H2>
          <p>Your written notice must include all of the following:</p>
          <List
            items={[
              "Your physical or electronic signature, as the copyright owner or a person authorized to act for them.",
              "A description of the copyrighted work you say has been infringed.",
              "The location of the material you want removed (a link or enough detail for us to find it).",
              "Your name, address, telephone number and email address.",
              "A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent or the law.",
              "A statement, under penalty of perjury, that the information in your notice is accurate and that you are authorized to act for the copyright owner.",
            ]}
          />
          <p className="mt-3">
            Knowingly misrepresenting that material is infringing can make you liable for
            damages.
          </p>
        </section>

        <section>
          <H2>What we do</H2>
          <p>
            When we receive a complete notice we will promptly remove or disable access to the
            material and tell the person who uploaded it. Incomplete notices may not be
            actioned.
          </p>
        </section>

        <section>
          <H2>Counter-notice</H2>
          <p>
            If your material was removed and you believe that was a mistake or that you have
            permission to use it, send our agent a counter-notice that includes:
          </p>
          <List
            items={[
              "Your physical or electronic signature.",
              "Identification of the material that was removed and where it appeared before removal.",
              "A statement, under penalty of perjury, that you have a good-faith belief it was removed by mistake or misidentification.",
              "Your name, address and telephone number, and a statement that you consent to the jurisdiction of the federal court for your address (or, if outside the U.S., any judicial district in which FOR1S may be found) and will accept service of process from the person who filed the original notice.",
            ]}
          />
          <p className="mt-3">
            We will forward the counter-notice to the original complainant. Unless they tell us
            within 10 business days that they have filed a court action, we may restore the
            material within 10 to 14 business days of receiving your counter-notice.
          </p>
        </section>

        <section>
          <H2>Repeat infringers</H2>
          <p>
            We will suspend or terminate the accounts of users who are repeat infringers, in
            appropriate circumstances.
          </p>
        </section>
      </div>
    </div>
  );
}

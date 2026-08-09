"use client";

/* ------------------------------------------------------------------ */
/*  Audience ticker                                                    */
/*                                                                     */
/*  Decorative, truthful element — the kinds of businesses FOR1S       */
/*  designs and builds websites for. No fabricated metrics.            */
/* ------------------------------------------------------------------ */

const TICKER = [
  "Cafés & Restaurants",
  "Salons & Spas",
  "Gyms & Studios",
  "Clinics & Dentists",
  "Shops & Retail",
  "Real Estate",
  "Restaurants",
  "Photographers",
  "Freelancers",
  "Coaches & Consultants",
  "Personal Brands",
  "Local Services",
];

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-surface/40">
      <div className="border-b border-hairline py-5">
        {/* The duplicated half is aria-hidden so screen readers don't
            announce each technology twice. */}
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              aria-hidden={i >= TICKER.length}
              className="flex items-center gap-8 px-6 text-sm uppercase tracking-widest text-muted lg:px-8"
            >
              {item}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

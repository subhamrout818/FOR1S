import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { TESTIMONIALS } from "@/lib/work";

/* Testimonials section — intentionally renders nothing until real client
   quotes exist in lib/work.ts (TESTIMONIALS). Never ship invented quotes. */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="testimonials" className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionLabel scene="08" title="Clients" className="mb-6" />
        <SplitReveal
          as="h2"
          type="words"
          className="mb-14 max-w-2xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          What clients say.
        </SplitReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealMask key={t.name} delay={i * 0.08} y={24}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-surface/60 p-7">
                <blockquote className="text-base leading-relaxed text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-semibold text-accent">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">{t.business}</p>
                  </div>
                </figcaption>
              </figure>
            </RevealMask>
          ))}
        </div>
      </div>
    </section>
  );
}

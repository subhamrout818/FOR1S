"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  console.log("Testimonials rendered");
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP( 
    () => {
      console.log("useGSAP started");
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (prefersReducedMotion()) return;
        const track = trackRef.current;
        if (!track) return;

        const distance = track.scrollWidth - window.innerWidth;
        if (distance <= 0) return;
        console.log("GSAP is running");
console.log(track.scrollWidth);
console.log(window.innerWidth);
console.log(distance);

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top center",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          animation: gsap.to(track, { x: -distance, ease: "none" }),
          invalidateOnRefresh: true,
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden bg-surface"
    >
      <div className="flex min-h-screen flex-col justify-center py-24 lg:h-screen lg:py-0">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 lg:px-12">
          <SectionLabel scene="06" title="Testimonials" className="mb-4" />
          <SplitReveal
            as="h2"
            type="words"
            className="max-w-xl font-display text-fluid-lg font-semibold uppercase leading-[1] tracking-tightest text-foreground"
          >
            Early access, honest words.
          </SplitReveal>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:w-max lg:snap-none lg:gap-8 lg:overflow-visible lg:px-12 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex w-[82vw] max-w-[420px] shrink-0 snap-center flex-col justify-between rounded-2xl border border-hairline bg-background p-8 lg:w-[420px] lg:p-10"
            >
              <p className="font-serif text-xl italic leading-snug text-foreground lg:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-10 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full border border-hairline bg-surface" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="w-[6vw] shrink-0 lg:w-[10vw]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

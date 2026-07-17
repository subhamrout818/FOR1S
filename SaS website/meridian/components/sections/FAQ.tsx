"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitReveal from "@/components/ui/SplitReveal";
import RevealMask from "@/components/ui/RevealMask";
import { FAQ_ITEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-hairline">
      <button
        onClick={onToggle}
        data-cursor="hover"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-7 text-left"
      >
        <span className="font-display text-lg font-medium text-foreground lg:text-xl">
          {question}
        </span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-accent transition-transform duration-500",
            isOpen && "rotate-45"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-sm leading-relaxed text-muted lg:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <section id="faq" className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
        <SectionLabel scene="08" title="FAQ" className="mb-6" />
        <SplitReveal
          as="h2"
          type="words"
          className="mb-14 max-w-xl font-display text-fluid-xl font-semibold uppercase leading-[0.98] tracking-tightest text-foreground"
        >
          Questions, answered plainly.
        </SplitReveal>

        <RevealMask blur={false} y={20}>
          <div className="border-t border-hairline">
            {FAQ_ITEMS.map((item) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </div>
        </RevealMask>
      </div>
    </section>
  );
}

"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type FAQProps = {
  isDark: boolean;
  faqs: {
    q: string;
    a: string;
  }[];
};

export function FAQSection({ isDark, faqs }: FAQProps) {
  const textTitle = isDark ? "text-zinc-200" : "text-zinc-800";
  const cardBg = isDark
    ? "bg-zinc-900/20 border-zinc-900/60"
    : "bg-white border-zinc-200 shadow-sm";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <section
      id="faq-section"
      className={cn("mt-16 pt-10 border-t max-w-3xl mx-auto", isDark ? "border-zinc-900" : "border-zinc-200")}
    >
      <div className="text-center mb-10">
        <h2
          className={cn(
            "text-xs font-mono uppercase tracking-widest",
            textMuted
          )}
        >
          In-Depth Details
        </h2>
        <h3 className={cn("text-xl font-bold mt-1", textTitle)}>
          Frequently Answered Framework Inquiries
        </h3>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={cn("p-4 sm:p-5 rounded-xl border", cardBg)}
          >
            <h4
              className={cn(
                "text-xs sm:text-sm font-semibold mb-2 flex items-start gap-2",
                textTitle
              )}
            >
              <span className="text-zinc-500 font-mono">Q.</span>
              {faq.q}
            </h4>
            <p className={cn("text-[11px] sm:text-xs pl-5 leading-relaxed", textMuted)}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
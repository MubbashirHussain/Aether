"use client";

import { cn } from "@/lib/utils";

export type HowToUseStepProps = {
  step: number;
  title: string;
  description: string;
  isDark: boolean;
};

export function HowToUseStep({ step, title, description, isDark }: HowToUseStepProps) {
  const cardBg = isDark
    ? "bg-zinc-900/20 border-zinc-900/60"
    : "bg-white border-zinc-200 shadow-sm";
  const badgeBg = isDark
    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
    : "bg-zinc-50 border-zinc-200 text-zinc-650";

  return (
    <div className={cn("p-5 rounded-xl border", cardBg)}>
      <div
        className={cn(
          "w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center border shadow-sm",
          badgeBg
        )}
      >
        {String(step).padStart(2, "0")}
      </div>
      <h4 className={cn("text-sm font-semibold mt-3 mb-1.5", isDark ? "text-zinc-200" : "text-zinc-800")}>
        {title}
      </h4>
      <p className="text-xs text-zinc-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export type HowToUseSectionProps = {
  isDark: boolean;
};

export function HowToUseSection({ isDark }: HowToUseSectionProps) {
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <section
      id="how-to-use"
      className={cn("mt-16 pt-10 border-t", isDark ? "border-zinc-900" : "border-zinc-200")}
    >
      <div className="text-center mb-10">
        <h2
          className={cn(
            "text-xs font-mono uppercase tracking-widest",
            textMuted
          )}
        >
          Decent Mechanics
        </h2>
        <h3 className={cn("text-xl font-bold mt-1", isDark ? "text-zinc-200" : "text-zinc-800")}>
          Get your media files in three basic steps
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HowToUseStep
          step={1}
          title="Extract Target URL"
          description="Visit the platform app, browse the chosen reel or short video, and select Copy Stream URL to your device."
          isDark={isDark}
        />
        <HowToUseStep
          step={2}
          title="Trigger Analyze Query"
          description="Input your saved stream address into our minimal search bar and let our servers isolate direct CDN download nodes."
          isDark={isDark}
        />
        <HowToUseStep
          step={3}
          title="Save Local Media"
          description="Select your preferred size configuration and trigger our secure download mechanism to download straight to your drive."
          isDark={isDark}
        />
      </div>
    </section>
  );
}
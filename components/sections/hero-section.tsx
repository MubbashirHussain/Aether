"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/AppContext";

export default function HeroSection() {
  const { isDark } = useTheme();
  const textTitle = isDark ? "text-neutral-100" : "text-neutral-900";
  const textSub = isDark ? "text-neutral-450" : "text-neutral-500";
  const badgeStyle = isDark
    ? "bg-neutral-950/80 border-neutral-900 text-neutral-400"
    : "bg-zinc-50 border-zinc-200 text-zinc-650 shadow-sm";

  return (
    <section className="text-center py-10 sm:py-16 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border",
            badgeStyle,
          )}
        >
          {/* Crisp Inline SVG badge icon */}
          <svg
            className="w-3.5 h-3.5 animate-pulse text-neutral-450"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          High-Speed CDN Interface
        </div>

        <h1
          className={cn(
            "text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight mt-6 mb-4 leading-tight sm:leading-none",
            textTitle,
          )}
        >
          Decentralized Media Stream Extraction
        </h1>

        <p
          className={cn(
            "text-xs sm:text-base leading-relaxed max-w-xl mx-auto font-light",
            textSub,
          )}
        >
          Retrieve uncompressed source media files directly from social platform
          delivery nodes. Bypass compression pipelines on Instagram, TikTok,
          YouTube, and Facebook instantly.
        </p>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/AppContext";

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();
  const headerBg = isDark
    ? "bg-black/80 border-neutral-900"
    : "bg-white/80 border-neutral-200";
  const headerText = isDark ? "text-neutral-100" : "text-neutral-900";
  const headerLinks = isDark
    ? "text-neutral-400 hover:text-neutral-100"
    : "text-neutral-600 hover:text-neutral-900";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300",
        headerBg,
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Branding Logo & Status */}
        <div className="flex items-center gap-3">
          {/* Crisp Inline SVG Logo */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300",
              isDark
                ? "bg-zinc-950 border-neutral-900 text-white"
                : "bg-zinc-50 border-zinc-200 text-zinc-900",
            )}
          >
            <svg
              className="w-4.5 h-4.5 stroke-[2] stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                "text-sm font-light tracking-tight leading-none truncate",
                headerText,
              )}
            >
              Aether Downloader
            </span>
            <span className="text-[9px] font-mono text-emerald-500 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              Extraction Nodes Active
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider">
          <a
            href="#downloader-section"
            className={cn("transition-colors duration-200", headerLinks)}
          >
            PARSER
          </a>
          <a
            href="#platform-grid"
            className={cn("transition-colors duration-200", headerLinks)}
          >
            COMPATIBILITY
          </a>
          <a
            href="#step-guide"
            className={cn("transition-colors duration-200", headerLinks)}
          >
            WORKFLOW
          </a>
          <a
            href="#faq-accordion"
            className={cn("transition-colors duration-200", headerLinks)}
          >
            FAQS
          </a>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

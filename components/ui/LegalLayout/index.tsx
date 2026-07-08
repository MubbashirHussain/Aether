"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const LegalLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const { isDark } = useTheme();

  const rootBg = isDark
    ? "bg-black text-neutral-400 selection:bg-neutral-800 selection:text-white"
    : "bg-zinc-50 text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900";

  const titleColor = isDark ? "text-neutral-100" : "text-neutral-900";
  
  const cardBg = isDark
    ? "bg-zinc-950/40 border-neutral-900"
    : "bg-white border-zinc-200 shadow-md";
    
  const linkColor = isDark
    ? "text-neutral-500 hover:text-neutral-200"
    : "text-zinc-500 hover:text-zinc-850";

  return (
    <div className={cn("min-h-screen font-light antialiased transition-all duration-300", rootBg)}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a
          href="/"
          className={cn("inline-flex items-center gap-2 text-xs font-mono mb-12 transition-colors duration-200", linkColor)}
        >
          <ArrowLeft size={14} /> BACK TO ENGINE
        </a>
        <div className={cn("border p-8 sm:p-12 rounded-3xl backdrop-blur-sm transition-all duration-300", cardBg)}>
          <h1 className={cn("text-3xl sm:text-4xl font-light tracking-tight mb-8 border-b pb-6 transition-all duration-300", titleColor, isDark ? "border-neutral-900" : "border-zinc-200")}>
            {title}
          </h1>
          <div className={cn("prose max-w-none text-sm space-y-6 leading-relaxed transition-all duration-300", isDark ? "prose-invert text-neutral-400" : "text-zinc-650")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
import React from "react";
import { ArrowLeft } from "lucide-react";

const LegalLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="min-h-screen font-light antialiased transition-all duration-300 bg-zinc-50 text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900 dark:bg-black dark:text-neutral-400 dark:selection:bg-neutral-800 dark:selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono mb-12 transition-colors duration-200 text-zinc-500 hover:text-zinc-850 dark:text-neutral-500 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={14} /> BACK TO ENGINE
        </a>
        <div className="border p-8 sm:p-12 rounded-3xl backdrop-blur-sm transition-all duration-300 bg-white border-zinc-200 shadow-md dark:bg-zinc-950/40 dark:border-neutral-900">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-8 border-b pb-6 transition-all duration-300 text-neutral-900 dark:text-neutral-100 border-zinc-200 dark:border-neutral-900">
            {title}
          </h1>
          <div className="prose max-w-none text-sm space-y-6 leading-relaxed transition-all duration-300 text-zinc-650 dark:prose-invert dark:text-neutral-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
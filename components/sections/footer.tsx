"use client";

import { useBottomAd } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { showStickyBottomAd } = useBottomAd();

  return (
    <footer
      className={cn(
        "py-12 sm:py-16 relative transition-all duration-300 bg-white border-t border-zinc-200 shadow-sm dark:bg-black dark:border-neutral-900",
        showStickyBottomAd && "mb-20",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-zinc-200 dark:border-neutral-900"
        >
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center shrink-0 border bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-neutral-900 dark:text-white"
            >
              <svg
                className="w-3.5 h-3.5 stroke-[2] stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span
              className="text-xs font-light tracking-tight text-zinc-900 dark:text-neutral-300"
            >
              Aether Downloader Studio
            </span>
          </div>

          {/* Disclaimer */}
          <p
            className="text-[10px] max-w-sm text-center sm:text-right leading-relaxed font-mono font-light text-zinc-450 dark:text-neutral-500"
          >
            Independent extraction client interface. Not associated with
            Instagram, TikTok, YouTube, or Facebook. No media streams are
            archived on local storage nodes.
          </p>
        </div>

        {/* Crawlable Navigation Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] font-mono tracking-wider">
          <a
            href="/terms"
            className="transition-colors duration-200 text-zinc-650 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            TERMS & SERVICE
          </a>
          <a
            href="/privacy"
            className="transition-colors duration-200 text-zinc-650 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            PRIVACY SETTINGS
          </a>
          <a
            href="/cookies"
            className="transition-colors duration-200 text-zinc-650 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            COOKIE MATRIX
          </a>
          <a
            href="/contact"
            className="transition-colors duration-200 text-zinc-650 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            CONTACT WEBMASTER
          </a>
        </div>

        {/* Copyright */}
        <div
          className="text-[9px] font-mono tracking-widest uppercase font-light text-zinc-450 dark:text-neutral-500"
        >
          <p>
            © {new Date().getFullYear()} Aether Downloader. Engineered for high
            performance & compliant monetization.
          </p>
        </div>
      </div>
    </footer>
  );
}


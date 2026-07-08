"use client";

import { useTheme } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { isDark, showStickyBottomAd } = useTheme();

  const footerBg = isDark
    ? "bg-black border-t border-neutral-900"
    : "bg-white border-t border-zinc-200 shadow-sm";
  const textColor = isDark ? "text-neutral-500" : "text-zinc-450";
  const titleColor = isDark ? "text-neutral-300" : "text-zinc-900";
  const linkColor = isDark
    ? "text-neutral-400 hover:text-neutral-200"
    : "text-zinc-650 hover:text-zinc-900";
  const subBorder = isDark ? "border-neutral-900" : "border-zinc-200";

  return (
    <footer
      className={cn(
        "py-12 sm:py-16 relative transition-all duration-300",
        showStickyBottomAd && "mb-20",
        footerBg,
      )}
    >
      <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-6 border-b",
            subBorder,
          )}
        >
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center shrink-0 border",
                isDark
                  ? "bg-zinc-950 border-neutral-900 text-white"
                  : "bg-zinc-50 border-zinc-200 text-zinc-900",
              )}
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
              className={cn("text-xs font-light tracking-tight", titleColor)}
            >
              Aether Downloader Studio
            </span>
          </div>

          {/* Disclaimer */}
          <p
            className={cn(
              "text-[10px] max-w-sm text-center sm:text-right leading-relaxed font-mono font-light",
              textColor,
            )}
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
            className={cn("transition-colors duration-200", linkColor)}
          >
            TERMS & SERVICE
          </a>
          <a
            href="/privacy"
            className={cn("transition-colors duration-200", linkColor)}
          >
            PRIVACY SETTINGS
          </a>
          <a
            href="/cookies"
            className={cn("transition-colors duration-200", linkColor)}
          >
            COOKIE MATRIX
          </a>
          <a
            href="/contact"
            className={cn("transition-colors duration-200", linkColor)}
          >
            CONTACT WEBMASTER
          </a>
        </div>

        {/* Copyright */}
        <div
          className={cn(
            "text-[9px] font-mono tracking-widest uppercase font-light",
            textColor,
          )}
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

"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationProps = {
  message: string;
  type: "success" | "info";
  onClose: () => void;
};

export function Notification({
  message,
  type,
  onClose,
}: NotificationProps) {
  return (
    <div
      className="fixed top-4 right-4 !z-50 animate-fade-in shadow-2xl rounded-xl p-3.5 border backdrop-blur-md flex items-center gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm bg-white border-zinc-200 text-zinc-800 dark:bg-zinc-900/98 dark:border-zinc-800/80 dark:text-zinc-300"
    >
      <div
        className="p-1 rounded-lg shrink-0 bg-zinc-100 text-emerald-600 dark:bg-zinc-800 dark:text-emerald-400"
      >
        <Check className="w-4 h-4" />
      </div>
      <span className="text-xs font-semibold line-clamp-2">{message}</span>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-600 ml-auto pl-2 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


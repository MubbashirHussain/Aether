"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-lg border"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
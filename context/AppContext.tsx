"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";

type Theme = "light" | "dark";

interface AppContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  showStickyBottomAd: boolean;
  setShowStickyBottomAd: (visible: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [showStickyBottomAd, setShowStickyBottomAd] = useState<boolean>(true);

  // Load theme from localStorage on mount
  useLayoutEffect(() => {
    const up = localStorage.getItem("up"); // user preference 1 for true, 0 for false
    if (!up) {
      const deviceTheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(deviceTheme ? "dark" : "light");
    } else {
      const saved = localStorage.getItem("vdl_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("up", "1");
    localStorage.setItem("vdl_theme", nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <AppContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        showStickyBottomAd,
        setShowStickyBottomAd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within an AppProvider");
  }
  return {
    theme: context.theme,
    isDark: context.isDark,
    toggleTheme: context.toggleTheme,
    setShowStickyBottomAd: context.setShowStickyBottomAd,
    showStickyBottomAd: context.showStickyBottomAd,
  };
}

export function useBottomAd() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useBottomAd must be used within an AppProvider");
  }
  return {
    showStickyBottomAd: context.showStickyBottomAd,
    setShowStickyBottomAd: context.setShowStickyBottomAd,
  };
}

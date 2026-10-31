"use client";

import React, { createContext, useContext, useEffect } from "react";

export type Theme = "light";

interface ThemeContextType {
  theme: "light";
  resolvedTheme: "light";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
});

const STORAGE_KEY = "project_x_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
      try {
        localStorage.setItem(STORAGE_KEY, "light");
      } catch {}
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", resolvedTheme: "light", setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

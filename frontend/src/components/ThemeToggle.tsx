"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

const emptySubscribe = () => () => {};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabels = false,
}) => {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
  ];

  if (!isClient) {
    return (
      <div className={`flex items-center p-0.5 rounded-lg border border-subtle bg-surface-subtle shrink-0 ${className}`}>
        <div className="h-6 w-7 rounded-md"></div>
        <div className="h-6 w-7 rounded-md"></div>
        <div className="h-6 w-7 rounded-md"></div>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme selector"
      className={`flex items-center p-0.5 rounded-lg border border-subtle bg-surface-subtle transition-colors shrink-0 ${className}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            title={`Switch to ${opt.label} mode`}
            aria-pressed={isActive}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
              isActive
                ? "bg-active-pill text-active-pill-text shadow-sm"
                : "text-muted-pill hover:text-active-pill-text hover:bg-white/[0.04]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {showLabels && <span className="text-[11px] font-medium">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

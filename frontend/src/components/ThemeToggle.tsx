"use client";

import React from "react";
import { Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabels = false,
}) => {
  return (
    <div
      role="status"
      aria-label="Light mode active"
      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-slate-200/80 bg-white/80 shadow-xs text-slate-700 text-xs font-sans shrink-0 ${className}`}
      title="Light mode active"
    >
      <Sun className="h-3.5 w-3.5 text-amber-500" />
      {showLabels && <span className="text-[11px] font-medium text-slate-600">Light</span>}
    </div>
  );
};

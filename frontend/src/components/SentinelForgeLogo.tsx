"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export interface SentinelForgeLogoProps {
  /**
   * Display mode:
   * - "horizontal": Emblem + SENTINEL FORGE + AUTONOMOUS SOC side-by-side (ideal for navbars/headers)
   * - "symbol": Emblem only (ideal for compact/mobile/favicons/modals)
   * - "stacked": Emblem on top, wordmark below (ideal for hero/splash/auth cards)
   */
  variant?: "horizontal" | "symbol" | "stacked";
  /**
   * Preset sizes:
   * - "xs": 22px emblem
   * - "sm": 28px emblem (navbar default)
   * - "md": 36px emblem
   * - "lg": 48px emblem
   * - "xl": 64px emblem
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Override theme resolution: "light" | "dark" | "auto" */
  theme?: "light" | "dark" | "auto";
  /** Whether to show the "AUTONOMOUS SOC" subline descriptor */
  showDescriptor?: boolean;
  /** Custom extra CSS classes */
  className?: string;
  /** Custom alt text */
  alt?: string;
  /** Priority image loading */
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { symbol: 22, text: "text-xs", sub: "text-[8px]" },
  sm: { symbol: 28, text: "text-xs sm:text-sm", sub: "text-[9px]" },
  md: { symbol: 38, text: "text-sm sm:text-base", sub: "text-[10px]" },
  lg: { symbol: 48, text: "text-base sm:text-lg", sub: "text-[11px]" },
  xl: { symbol: 64, text: "text-lg sm:text-xl", sub: "text-xs" },
};

export const SentinelForgeLogo: React.FC<SentinelForgeLogoProps> = ({
  variant = "horizontal",
  size = "sm",
  theme: themeOverride = "auto",
  showDescriptor = true,
  className = "",
  alt = "SENTINEL FORGE — Autonomous SOC",
  priority = true,
}) => {
  const { resolvedTheme } = useTheme();
  const activeTheme = themeOverride === "auto" ? resolvedTheme : themeOverride;
  const isDark = activeTheme === "dark";

  const { symbol: symSize, text: textSize, sub: subSize } = SIZE_MAP[size] || SIZE_MAP.sm;

  // Use the transparent symbol PNG
  const symbolSrc = isDark
    ? "/sentinel-forge-symbol-dark.png"
    : "/sentinel-forge-symbol-light.png";

  if (variant === "symbol") {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <Image
          src={symbolSrc}
          alt={alt}
          width={symSize}
          height={symSize}
          priority={priority}
          className="object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.35)]"
        />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center space-y-3 select-none ${className}`}>
        <div className="relative inline-flex items-center justify-center shrink-0">
          <Image
            src={symbolSrc}
            alt={alt}
            width={symSize * 1.6}
            height={symSize * 1.6}
            priority={priority}
            className="object-contain drop-shadow-[0_0_18px_rgba(0,229,255,0.4)]"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2 font-mono font-black uppercase">
            <span className={`${textSize} tracking-[0.2em] text-[var(--text-primary)]`}>
              SENTINEL
            </span>
            <span className={`${textSize} tracking-[0.24em] text-cyan-600 dark:text-cyan-400 font-bold`}>
              FORGE
            </span>
          </div>
          {showDescriptor && (
            <div className={`${subSize} font-mono tracking-[0.28em] text-[var(--text-muted)] uppercase font-semibold`}>
              AUTONOMOUS SOC
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default "horizontal" layout (Emblem on left, wordmark on right)
  return (
    <div className={`inline-flex items-center space-x-2.5 sm:space-x-3 select-none shrink-0 ${className}`}>
      <div className="relative inline-flex items-center justify-center shrink-0">
        <Image
          src={symbolSrc}
          alt={alt}
          width={symSize}
          height={symSize}
          priority={priority}
          className="object-contain drop-shadow-[0_0_10px_rgba(0,229,255,0.35)] transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center leading-tight shrink-0">
        <div className="flex items-center space-x-1.5 font-mono font-black uppercase">
          <span className={`${textSize} tracking-[0.16em] text-[var(--text-primary)] font-black`}>
            SENTINEL
          </span>
          <span className={`${textSize} tracking-[0.22em] text-cyan-600 dark:text-cyan-400 font-bold`}>
            FORGE
          </span>
        </div>
        {showDescriptor && (
          <span className={`${subSize} font-mono tracking-[0.26em] text-[var(--text-muted)] uppercase font-semibold mt-0.5 hidden xs:inline sm:inline`}>
            AUTONOMOUS SOC
          </span>
        )}
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Lock, User, LogOut, ArrowRight, UserCheck } from "lucide-react";
import { Role } from "@/types/soc";
import { ThemeToggle } from "./ThemeToggle";
import { Glass } from "./Glass";

interface RoleNavbarProps {
  currentRole: Role | null;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isBackendConnected: boolean;
  onRequestAdminLogin?: () => void;
}

export const RoleNavbar: React.FC<RoleNavbarProps> = ({
  currentRole,
  onLogout,
  activeTab,
  onTabChange,
  isBackendConnected,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full pt-3 pb-2.5 px-3 sm:px-6 transition-all duration-200 ${
        isScrolled
          ? "bg-[var(--bg-base)]/85 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <Glass
        radius={9999}
        bezel={16}
        strength={36}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2 rounded-full border border-white/10 shadow-xl bg-[var(--bg-surface)]/95 backdrop-blur-xl"
      >
        {/* Brand */}
        <Link 
          href="/"
          className="flex items-center space-x-2.5 sm:space-x-3 group select-none shrink-0"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] shrink-0">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">
              PROJECT <span className="text-cyan-400 font-light">X</span>
            </span>
            <span className="text-zinc-500 text-xs font-mono hidden xl:inline">/</span>
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase hidden xl:inline">
              Autonomous SOC
            </span>
          </div>
        </Link>

        {/* Floating Capsule Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-full bg-black/25 dark:bg-white/[0.03] border border-white/5 text-xs font-medium text-[var(--text-secondary)] shrink-0">
          <Link
            href="/"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeTab === "overview"
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-[var(--text-primary)] hover:bg-white/5"
            }`}
          >
            Overview
          </Link>
          <Link
            href="/#topology"
            className="px-2.5 py-1 rounded-full hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            Topology
          </Link>
          <Link
            href="/#pipeline"
            className="px-2.5 py-1 rounded-full hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            Pipeline
          </Link>
          <Link
            href="/attacks"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeTab === "attacks"
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-[var(--text-primary)] hover:bg-white/5"
            }`}
          >
            Attack Lab
          </Link>
          <Link
            href="/audit"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeTab === "audit"
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-[var(--text-primary)] hover:bg-white/5"
            }`}
          >
            Audit Ledger
          </Link>
        </nav>

        {/* Right Status & Role Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Telemetry Status Pill - ultra wide only */}
          <div className="hidden 2xl:flex items-center space-x-1.5 text-[10px] font-mono text-[var(--text-muted)] px-2.5 py-1 rounded-full bg-black/30 border border-white/5 shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full ${isBackendConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}></span>
            <span>{isBackendConnected ? "DAEMON LIVE" : "DEMO READY"}</span>
          </div>

          {/* Theme Selector (Dark / Light / System) */}
          <ThemeToggle className="shrink-0" />

          {currentRole === "admin" ? (
            /* Logged in as Admin */
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {activeTab === "admin" ? (
                <div
                  className="flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 shadow-inner shrink-0"
                  title="Administrator clearance active"
                >
                  <Lock className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="hidden sm:inline">Admin Active</span>
                  <span className="sm:hidden">Admin</span>
                </div>
              ) : (
                <Link
                  href="/admin"
                  className="btn-metallic-primary flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                >
                  <Lock className="h-3 w-3 shrink-0" />
                  <span className="hidden sm:inline">Command Center</span>
                  <span className="sm:hidden">Admin</span>
                  <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                </Link>
              )}
              <button
                onClick={onLogout}
                title="Log out of Administrator Session"
                className="btn-metallic-secondary flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300 transition-all shrink-0 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400/90 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          ) : currentRole === "employee" ? (
            /* Logged in as Staff */
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {activeTab === "staff" ? (
                <div
                  className="flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 shadow-inner shrink-0"
                  title="Staff Advisory clearance active"
                >
                  <UserCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Staff Active</span>
                  <span className="sm:hidden">Staff</span>
                </div>
              ) : (
                <Link
                  href="/staff"
                  className="btn-metallic-primary flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                >
                  <UserCheck className="h-3 w-3 shrink-0" />
                  <span>Staff Portal</span>
                </Link>
              )}
              <button
                onClick={onLogout}
                title="Log out of Staff Session"
                className="btn-metallic-secondary flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300 transition-all shrink-0 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400/90 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated Guest */
            <div className="flex items-center space-x-1.5 shrink-0">
              <Link
                href="/staff/login?redirect=/staff"
                className="btn-metallic-secondary flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap"
              >
                <User className="h-3 w-3 opacity-70 shrink-0" />
                <span>Staff</span>
              </Link>
              <Link
                href="/login?redirect=/admin"
                className="btn-metallic-primary flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
              >
                <Lock className="h-3 w-3 shrink-0" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </Glass>
    </header>
  );
};

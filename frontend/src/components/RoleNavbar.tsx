"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, User, LogOut, ArrowRight, UserCheck } from "lucide-react";
import { Role } from "@/types/soc";
import { ThemeToggle } from "./ThemeToggle";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

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
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b border-slate-200/80 backdrop-blur-xl ${
        isScrolled
          ? "bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-white/80"
      }`}
    >
      <div className="mx-auto flex max-w-7xl w-full items-center justify-between px-6 sm:px-10 py-5">
        {/* Brand */}
        <Link 
          href="/"
          className="group flex items-center shrink-0 cursor-pointer"
          title="SENTINEL FORGE — Autonomous SOC"
        >
          <SentinelForgeLogo variant="horizontal" size="sm" />
        </Link>

        {/* Floating Segmented Navigation Links - hidden on home page per user design */}
        {activeTab !== "overview" && (
          <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-lg bg-slate-100/80 border border-slate-200/70 text-xs font-medium text-slate-600 shrink-0">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                  : "hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Overview
            </Link>
            <Link
              href="/#topology"
              className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              Topology
            </Link>
            <Link
              href="/#pipeline"
              className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              Pipeline
            </Link>
            <Link
              href="/attacks"
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "attacks"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                  : "hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Attack Lab
            </Link>
            <Link
              href="/audit"
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "audit"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                  : "hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Audit Ledger
            </Link>
          </nav>
        )}

        {/* Right Status & Role Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          {/* Telemetry Status Pill */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-600 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
            <span className={`h-2 w-2 rounded-full ${isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
            <span className="font-medium">{isBackendConnected ? "DAEMON LIVE" : "DEMO READY"}</span>
          </div>

          {/* Theme Selector Badge */}
          <ThemeToggle className="shrink-0" />

          {currentRole === "admin" ? (
            /* Logged in as Admin */
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              {activeTab === "admin" ? (
                <div
                  className="h-8 flex items-center space-x-1.5 rounded-lg px-3 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0"
                  title="Administrator clearance active"
                >
                  <Lock className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline font-semibold">Admin Active</span>
                  <span className="sm:hidden font-semibold">Admin</span>
                </div>
              ) : (
                <Link
                  href="/admin"
                  className="h-8 btn-metallic-primary px-3.5 text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Command Center</span>
                  <span className="sm:hidden">Admin</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
                </Link>
              )}
              <button
                onClick={onLogout}
                title="Log out of Administrator Session"
                className="h-8 btn-metallic-secondary px-3 text-xs font-medium cursor-pointer text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all shrink-0 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          ) : currentRole === "employee" ? (
            /* Logged in as Staff */
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              {activeTab === "staff" ? (
                <div
                  className="h-8 flex items-center space-x-1.5 rounded-lg px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0"
                  title="Staff Advisory clearance active"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline font-semibold">Staff Active</span>
                  <span className="sm:hidden font-semibold">Staff</span>
                </div>
              ) : (
                <Link
                  href="/staff"
                  className="h-8 btn-metallic-primary px-3.5 text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <UserCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Staff Portal</span>
                </Link>
              )}
              <button
                onClick={onLogout}
                title="Log out of Staff Session"
                className="h-8 btn-metallic-secondary px-3 text-xs font-medium cursor-pointer text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all shrink-0 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated Guest */
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              <Link
                href="/staff/login?redirect=/staff"
                className="h-8 btn-metallic-secondary px-3.5 text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap"
              >
                <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Staff</span>
              </Link>
              <Link
                href="/login?redirect=/admin"
                className="h-8 btn-metallic-primary px-3.5 text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

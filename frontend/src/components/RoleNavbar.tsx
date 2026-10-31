"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, LogOut, ArrowRight, Server } from "lucide-react";
import { Role } from "@/types/soc";

interface RoleNavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isBackendConnected: boolean;
  onRequestAdminLogin?: () => void;
}

export const RoleNavbar: React.FC<RoleNavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  isBackendConnected,
  onRequestAdminLogin,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full hairline-b bg-[#08090d]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Brand */}
        <Link 
          href="/"
          className="flex items-center space-x-3.5 group select-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 group-hover:border-white/20 transition-all">
            <Shield className="h-4 w-4 text-slate-200" />
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              PROJECT <span className="text-slate-400 font-light">X</span>
            </span>
            <span className="text-slate-600 text-xs font-mono">/</span>
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              SecOps Console
            </span>
          </div>
        </Link>

        {/* Minimal Navigation Links (No clutter) */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-400">
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/#architecture"
            className="hover:text-white transition-colors"
          >
            System Architecture
          </Link>
          <Link
            href="/#loop"
            className="hover:text-white transition-colors"
          >
            Autonomous Loop
          </Link>
        </nav>

        {/* Right Status & Role Actions */}
        <div className="flex items-center space-x-4">
          {/* Telemetry Status */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-400 px-3 py-1 rounded-md bg-white/[0.02] border border-white/5">
            <span className={`h-1.5 w-1.5 rounded-full ${isBackendConnected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span>{isBackendConnected ? "DAEMON 8000 LIVE" : "STANDALONE"}</span>
          </div>

          {currentRole === "admin" ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/admin"
                className="btn-metallic-primary flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold"
              >
                <Lock className="h-3 w-3" />
                <span>Command Center</span>
                <ArrowRight className="h-3 w-3 opacity-60" />
              </Link>
              <button
                onClick={() => onRoleChange("employee")}
                title="Lock admin session and return to staff view"
                className="btn-metallic-secondary flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Exit Admin</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                href="/staff"
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 transition-colors"
              >
                Staff Feed
              </Link>
              <Link
                href="/login?redirect=/admin"
                className="btn-metallic-primary flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
              >
                <Lock className="h-3 w-3" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

"use client";

import React from "react";
import { Shield, Lock, ShieldAlert, User, Terminal } from "lucide-react";
import { Role } from "@/types/soc";

interface RoleNavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isBackendConnected: boolean;
}

export const RoleNavbar: React.FC<RoleNavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  isBackendConnected,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full hairline-b bg-[#08090d]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Brand */}
        <div 
          onClick={() => onTabChange("overview")}
          className="flex cursor-pointer items-center space-x-3.5 group select-none"
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
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onTabChange("overview")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "overview"
                ? "bg-white/[0.06] text-white border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange("portal")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "portal"
                ? "bg-white/[0.06] text-white border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
            }`}
          >
            {currentRole === "admin" ? "Incident Command Center" : "Staff Security Feed"}
          </button>
          <button
            onClick={() => onTabChange("audit")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "audit"
                ? "bg-white/[0.06] text-white border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => onTabChange("architecture")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "architecture"
                ? "bg-white/[0.06] text-white border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
            }`}
          >
            System Architecture
          </button>
        </nav>

        {/* Right Status & Role Switcher */}
        <div className="flex items-center space-x-4">
          {/* Telemetry Status */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-400 px-3 py-1 rounded-md bg-white/[0.02] border border-white/5">
            <span className={`h-1.5 w-1.5 rounded-full ${isBackendConnected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span>{isBackendConnected ? "DAEMON 8000 LIVE" : "STANDALONE"}</span>
          </div>

          {/* Formal Metallic Role Switcher */}
          <div className="flex items-center rounded-lg bg-[#0e1118] p-1 border border-white/[0.08]">
            <button
              onClick={() => onRoleChange("employee")}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                currentRole === "employee"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="h-3 w-3" />
              <span>Staff</span>
            </button>
            <button
              onClick={() => onRoleChange("admin")}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                currentRole === "admin"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lock className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

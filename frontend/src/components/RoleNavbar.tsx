"use client";

import React from "react";
import { Shield, ShieldAlert, Lock, UserCheck, Terminal, Radio } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05070a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div 
          onClick={() => onTabChange("overview")}
          className="flex cursor-pointer items-center space-x-3 group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-wider text-white">PROJECT <span className="text-cyan-400">X</span></span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-mono tracking-widest text-cyan-300 border border-cyan-800">
                SOC v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Autonomous Enterprise Defense</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/60 p-1 border border-white/5">
          <button
            onClick={() => onTabChange("overview")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange("portal")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === "portal"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{currentRole === "admin" ? "Admin Command Center" : "Employee Security Center"}</span>
          </button>
          <button
            onClick={() => onTabChange("audit")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "audit"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Audit Ledger
          </button>
          <button
            onClick={() => onTabChange("architecture")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "architecture"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            MITRE Architecture
          </button>
        </nav>

        {/* Status & Role Toggle */}
        <div className="flex items-center space-x-3">
          {/* Backend link indicator */}
          <div 
            title={isBackendConnected ? "FastAPI Backend Online (127.0.0.1:8000)" : "Standalone Simulation Active"}
            className="hidden sm:flex items-center space-x-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 border border-white/5 text-[11px] font-mono text-slate-300"
          >
            <span className={`h-2 w-2 rounded-full ${isBackendConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            <span>{isBackendConnected ? "LIVE API" : "STANDALONE"}</span>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-white/10">
            <button
              onClick={() => onRoleChange("employee")}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                currentRole === "employee"
                  ? "bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Employee</span>
            </button>
            <button
              onClick={() => onRoleChange("admin")}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                currentRole === "admin"
                  ? "bg-gradient-to-r from-red-950/80 to-rose-900/60 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin (Elevated)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

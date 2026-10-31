"use client";

import React from "react";
import { Terminal, ArrowRight, Shield, Play, Lock, ChevronDown, CheckCircle2 } from "lucide-react";
import { Role } from "@/types/soc";

interface HeroSectionProps {
  onEnterPortal: (role: Role) => void;
  onTriggerReplay: () => void;
  isReplaying: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterPortal,
  onTriggerReplay,
  isReplaying,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative pt-16 pb-20 overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[900px] bg-gradient-to-b from-white/[0.035] to-transparent rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Formal Institutional Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span className="tracking-widest uppercase text-slate-300">
            SINGLE-BOX SOC FOR LINUX SERVERS
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">MITRE Caldera Verification</span>
        </div>

        {/* Spacious Title & Visual Loop Hook */}
        <div className="mt-8 max-w-4xl space-y-6">
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-[1.15]">
            Autonomous Server Defense with Mathematical Proof.
          </h1>

          {/* Visual Hook Pipeline Strip */}
          <div className="rounded-xl bg-white/[0.02] p-4 border border-white/[0.06] flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500">THE LOOP:</span>
            <span className="text-slate-200">Detect Attack</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-slate-200">Plain English LLM</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-slate-200">Human Approval</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-slate-200">SSH Firewall Block</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-emerald-400 font-bold">Caldera Re-Run Proof</span>
          </div>

          <p className="text-base text-slate-400 leading-relaxed max-w-3xl font-normal">
            Project X watches your Linux server, intercepts brute-force and backdoor intrusions from raw kernel logs, 
            explains the threat in plain English for non-technical leadership, gates responses behind dual-custody human authorization, 
            and uniquely re-executes MITRE ATT&CK adversary profiles to prove the block held.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo("login-portal")}
              className="btn-metallic-primary flex items-center space-x-2.5 rounded-lg px-6 py-3.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Sign In to Portal</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => scrollTo("topology")}
              className="btn-metallic-secondary flex items-center space-x-2 rounded-lg px-5 py-3.5 text-xs font-medium tracking-wide transition-all cursor-pointer"
            >
              <span>Explore Visual Architecture</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              className="btn-metallic-secondary flex items-center space-x-2 rounded-lg px-5 py-3.5 text-xs font-mono text-slate-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`h-3 w-3 text-slate-400 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Simulating Attack..." : "Simulate Inbound Threat"}</span>
            </button>
          </div>
        </div>

        {/* 3 Core Value Metric Pills */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="metallic-card rounded-xl p-5 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">COST STRUCTURE</div>
            <div className="text-xl font-mono font-medium text-white">$0 Software Cost</div>
            <p className="text-xs text-slate-400">Uses permissively licensed MITRE Caldera (Apache 2.0) and lightweight team-authored Python.</p>
          </div>

          <div className="metallic-card rounded-xl p-5 space-y-1 border-t-white/30">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">OPERATIONAL VELOCITY</div>
            <div className="text-xl font-mono font-medium text-white">&lt; 45s Mean Containment</div>
            <p className="text-xs text-slate-400">From raw log hit to verified firewall quarantine, gated by a 1-click human response gate.</p>
          </div>

          <div className="metallic-card rounded-xl p-5 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">NON-REPUDIATION</div>
            <div className="text-xl font-mono font-medium text-white">Mathematical Proof</div>
            <p className="text-xs text-slate-400">Does not guess whether firewall rules succeeded; actively re-emulates the attack to prove isolation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

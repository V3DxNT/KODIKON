"use client";

import React from "react";
import { Play } from "lucide-react";
import { Glass } from "./Glass";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

interface HeroSectionProps {
  onTriggerReplay: () => void;
  isReplaying: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTriggerReplay,
  isReplaying,
}) => {

  return (
    <div className="relative pt-16 sm:pt-24 pb-4 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 text-center">
        {/* Institutional Telemetry Pill */}
        <div className="flex justify-center text-xs font-mono text-[var(--text-muted)] mb-8">
          <Glass radius={9999} bezel={12} strength={24} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs">
            <SentinelForgeLogo variant="symbol" size="xs" />
            <span className="tracking-widest uppercase font-semibold text-emerald-400">
              SENTINEL FORGE &bull; AUTONOMOUS LINUX SOC
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[var(--text-secondary)]">MITRE Caldera Verification</span>
          </Glass>
        </div>

        {/* Centered Main Title (Balanced & Proportional) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.12]">
            Autonomous Server Defense with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Mathematical Proof</span>.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-normal">
            SENTINEL FORGE intercepts brute-force and backdoor intrusions from Linux kernel logs, explains threats in plain English for operational clarity, gates responses behind human authorization, and actively re-executes attacks via Caldera to mathematically prove the block held.
          </p>

          {/* Liquid Glass Autonomous Loop Strip (Centered, Single Continuous Line) */}
          <div className="flex justify-center pt-1">
            <Glass
              radius={9999}
              bezel={14}
              strength={28}
              className="rounded-full px-5 sm:px-7 py-2.5 sm:py-3 border border-white/10 inline-flex items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs md:text-[12.5px] font-mono shadow-xl whitespace-nowrap overflow-x-auto"
            >
              <span className="text-cyan-400 font-bold shrink-0">THE LOOP:</span>
              <span className="text-[var(--text-primary)] shrink-0">Detect Attack</span>
              <span className="text-zinc-500 shrink-0">&rarr;</span>
              <span className="text-[var(--text-primary)] shrink-0">Plain English LLM</span>
              <span className="text-zinc-500 shrink-0">&rarr;</span>
              <span className="text-[var(--text-primary)] shrink-0">Human Approval</span>
              <span className="text-zinc-500 shrink-0">&rarr;</span>
              <span className="text-[var(--text-primary)] shrink-0">SSH Firewall Block</span>
              <span className="text-zinc-500 shrink-0">&rarr;</span>
              <span className="text-emerald-400 font-bold shrink-0">Caldera Re-Run Proof</span>
            </Glass>
          </div>

          {/* Action CTA (Centered) */}
          <div className="pt-3 flex justify-center">
            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              className="btn-metallic-secondary flex items-center space-x-2 rounded-full px-6 py-3.5 text-xs font-mono text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50 hover:border-cyan-400/40 shadow-lg"
            >
              <Play className={`h-3.5 w-3.5 text-cyan-400 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Simulating Attack..." : "Simulate Inbound Threat"}</span>
            </button>
          </div>
        </div>

        {/* 3 Core Value Metric Cards */}
        <div className="mt-24 sm:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="metallic-card rounded-2xl p-7 space-y-2.5 border border-white/10 hover:border-cyan-400/30 transition-all">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">COST STRUCTURE</div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">$0 Software Cost</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Uses permissively licensed MITRE Caldera (Apache 2.0) and lightweight autonomous Python orchestration.</p>
          </div>

          <div className="metallic-card rounded-2xl p-7 space-y-2.5 border border-white/10 hover:border-cyan-400/30 transition-all border-t-cyan-400/40">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">OPERATIONAL VELOCITY</div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">&lt; 45s Mean Quarantine</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">From raw log hit to verified firewall quarantine, gated by a 1-click dual-custody human response gate.</p>
          </div>

          <div className="metallic-card rounded-2xl p-7 space-y-2.5 border border-white/10 hover:border-cyan-400/30 transition-all">
            <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">NON-REPUDIATION</div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">Mathematical Proof</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Does not guess whether firewall rules succeeded; actively re-emulates the attack to prove isolation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

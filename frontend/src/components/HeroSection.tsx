"use client";

import React from "react";
import { Play } from "lucide-react";
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
        {/* Institutional Telemetry Badge */}
        <div className="flex justify-center text-xs font-mono mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs text-slate-600">
            <SentinelForgeLogo variant="symbol" size="xs" />
            <span className="tracking-wide uppercase font-semibold text-emerald-700 text-[11px]">
              SENTINEL FORGE • AUTONOMOUS LINUX SOC
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px]">MITRE Caldera Verification</span>
          </div>
        </div>

        {/* Centered Main Title (Balanced & Proportional) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.12]">
            Autonomous Server Defense with{" "}
            <span className="redaction-35-regular-italic font-normal italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">
              Mathematical Proof
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            SENTINEL FORGE intercepts brute-force and backdoor intrusions from Linux kernel logs, explains threats in plain English for operational clarity, gates responses behind human authorization, and actively re-executes attacks via Caldera to mathematically prove the block held.
          </p>

          {/* Autonomous Loop Strip (Centered, Clean Rounded-lg Container) */}
          <div className="flex justify-center pt-1">
            <div
              className="rounded-xl px-5 sm:px-6 py-2.5 bg-white border border-slate-200/90 inline-flex items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-mono shadow-[0_1px_3px_rgba(0,0,0,0.04)] whitespace-nowrap overflow-x-auto"
            >
              <span className="text-blue-600 font-bold shrink-0">THE LOOP:</span>
              <span className="text-slate-800 font-medium shrink-0">Detect Attack</span>
              <span className="text-slate-400 shrink-0">→</span>
              <span className="text-slate-800 font-medium shrink-0">Plain English LLM</span>
              <span className="text-slate-400 shrink-0">→</span>
              <span className="text-slate-800 font-medium shrink-0">Human Approval</span>
              <span className="text-slate-400 shrink-0">→</span>
              <span className="text-slate-800 font-medium shrink-0">SSH Firewall Block</span>
              <span className="text-slate-400 shrink-0">→</span>
              <span className="text-emerald-700 font-bold shrink-0">Caldera Re-Run Proof</span>
            </div>
          </div>

          {/* Action CTA (Centered) */}
          <div className="pt-3 flex justify-center">
            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              className="btn-metallic-primary h-10 px-5 text-xs font-medium rounded-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50 transition-all shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.16)]"
            >
              <Play className={`h-3.5 w-3.5 text-blue-400 fill-blue-400 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Simulating Attack..." : "Simulate Inbound Threat"}</span>
            </button>
          </div>
        </div>

        {/* 3 Core Value Metric Cards */}
        <div className="mt-20 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-2xl p-7 space-y-2.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="text-[10px] font-mono text-blue-600 uppercase font-bold tracking-wider">COST STRUCTURE</div>
            <div className="text-2xl font-mono font-medium text-slate-900">$0 Software Cost</div>
            <p className="text-xs text-slate-600 leading-relaxed">Uses permissively licensed MITRE Caldera (Apache 2.0) and lightweight autonomous Python orchestration.</p>
          </div>

          <div className="bg-white rounded-2xl p-7 space-y-2.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider">OPERATIONAL VELOCITY</div>
            <div className="text-2xl font-mono font-medium text-slate-900">&lt; 45s Mean Quarantine</div>
            <p className="text-xs text-slate-600 leading-relaxed">From raw log hit to verified firewall quarantine, gated by a 1-click dual-custody human response gate.</p>
          </div>

          <div className="bg-white rounded-2xl p-7 space-y-2.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="text-[10px] font-mono text-indigo-600 uppercase font-bold tracking-wider">NON-REPUDIATION</div>
            <div className="text-2xl font-mono font-medium text-slate-900">Mathematical Proof</div>
            <p className="text-xs text-slate-600 leading-relaxed">Does not guess whether firewall rules succeeded; actively re-emulates the attack to prove isolation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

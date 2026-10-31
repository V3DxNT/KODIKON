"use client";

import React from "react";
import { 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Play, 
  Server,
  Lock,
  Workflow,
  Cpu
} from "lucide-react";
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
  return (
    <div className="relative pt-20 pb-28 overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-[1000px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Formal Institutional Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="tracking-widest uppercase text-slate-300">
            Defense Specification V2.0
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">MITRE Caldera Automated Verification</span>
        </div>

        {/* Spacious Title & Editorial Headline */}
        <div className="mt-8 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-[1.12]">
            Autonomous Security Operations with Provable Containment.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl font-normal">
            Project X delivers an autonomous single-box SOC engineered for small enterprise Linux environments. 
            It correlates raw OS-level logs into plain-English intelligence, enforces human-gated response orchestration, 
            and re-executes MITRE ATT&CK adversary profiles to mathematically prove the threat is neutralized.
          </p>

          {/* Action Button Row */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onEnterPortal("admin")}
              className="btn-metallic-primary flex items-center space-x-2.5 rounded-lg px-6 py-3.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer"
            >
              <Terminal className="h-4 w-4" />
              <span>Access Command Center</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => onEnterPortal("employee")}
              className="btn-metallic-secondary flex items-center space-x-2 rounded-lg px-5 py-3.5 text-xs font-medium tracking-wide transition-all cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Staff Advisory View</span>
            </button>

            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              className="btn-metallic-secondary flex items-center space-x-2 rounded-lg px-5 py-3.5 text-xs font-mono text-slate-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`h-3 w-3 text-slate-400 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Simulating Inbound Attack..." : "Simulate Inbound Threat"}</span>
            </button>
          </div>
        </div>

        {/* Metallic Architecture Matrix (Spacious 4-Column Grid) */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metallic-card metallic-card-hover rounded-xl p-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>HOST INTERFACE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            </div>
            <div className="mt-4 text-2xl font-mono font-medium text-slate-100 tracking-tight">
              192.168.56.1
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              Local workstation orchestrator running FastAPI daemon, correlation engine & SQLite.
            </p>
          </div>

          <div className="metallic-card metallic-card-hover rounded-xl p-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>MONITORED TARGET</span>
              <span className="text-slate-400 font-mono">PORT 22</span>
            </div>
            <div className="mt-4 text-2xl font-mono font-medium text-slate-100 tracking-tight">
              192.168.56.10
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              Sealed Ubuntu server producing real-time auth.log, auditd, and ufw kernel events.
            </p>
          </div>

          <div className="metallic-card metallic-card-hover rounded-xl p-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>VERIFIER ENGINE</span>
              <span className="text-slate-400 font-mono">APACHE 2.0</span>
            </div>
            <div className="mt-4 text-2xl font-mono font-medium text-slate-100 tracking-tight">
              MITRE Caldera
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              Re-executes adversary profiles post-block via REST to prove packet rejection.
            </p>
          </div>

          <div className="metallic-card metallic-card-hover rounded-xl p-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>ACCESS CONTROL</span>
              <span className="text-slate-400 font-mono">DUAL ROLE</span>
            </div>
            <div className="mt-4 text-2xl font-mono font-medium text-slate-100 tracking-tight">
              Human-in-Loop
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              Strict RBAC separation: non-technical staff advisory vs authenticated admin firewall actions.
            </p>
          </div>
        </div>

        {/* 10-Step Operational Sequence (Spacious Formal Flow) */}
        <div className="mt-16 metallic-surface rounded-2xl p-8 border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 hairline-b gap-3">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                AUTOMATED RESPONSE LIFECYCLE
              </div>
              <h3 className="text-lg font-medium text-white mt-1">
                The 10-Step Autonomous Sequence
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              9 Custom Steps + 1 MITRE Caldera Verification Re-Run
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="metallic-card rounded-lg p-4">
              <span className="text-[11px] font-mono text-slate-500 font-bold">STAGE 01</span>
              <div className="text-xs font-semibold text-slate-200 mt-2">Log Ingestion</div>
              <div className="text-[11px] text-slate-400 mt-1">sshd, auditd, ufw</div>
            </div>

            <div className="metallic-card rounded-lg p-4">
              <span className="text-[11px] font-mono text-slate-500 font-bold">STAGE 02</span>
              <div className="text-xs font-semibold text-slate-200 mt-2">Graph Correlation</div>
              <div className="text-[11px] text-slate-400 mt-1">NetworkX IP graph</div>
            </div>

            <div className="metallic-card rounded-lg p-4">
              <span className="text-[11px] font-mono text-slate-500 font-bold">STAGE 03</span>
              <div className="text-xs font-semibold text-slate-200 mt-2">Plain English LLM</div>
              <div className="text-[11px] text-slate-400 mt-1">3-sentence synthesis</div>
            </div>

            <div className="metallic-card rounded-lg p-4">
              <span className="text-[11px] font-mono text-slate-500 font-bold">STAGE 04</span>
              <div className="text-xs font-semibold text-slate-200 mt-2">SSH Paramiko Block</div>
              <div className="text-[11px] text-slate-400 mt-1">sudo ufw deny &lt;ip&gt;</div>
            </div>

            <div className="metallic-card rounded-lg p-4 border-t-white/30">
              <span className="text-[11px] font-mono text-slate-300 font-bold">STAGE 05 (PROOF)</span>
              <div className="text-xs font-semibold text-white mt-2">Caldera Re-Run</div>
              <div className="text-[11px] text-slate-400 mt-1">Proves block held</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

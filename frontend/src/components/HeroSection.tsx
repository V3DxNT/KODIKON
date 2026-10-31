"use client";

import React from "react";
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Sparkles,
  Lock,
  Workflow
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
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-cyan-600/10 via-cyan-900/5 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Tagline */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono tracking-wide">Autonomous Single-Box Security Operations Center</span>
            <span className="h-1 w-1 rounded-full bg-cyan-400"></span>
            <span className="text-slate-400 font-sans">MITRE Caldera Verified</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Stop attacks in seconds.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Prove the block worked.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Project X is an autonomous SOC tailored for small enterprises without a dedicated security staff. 
            It correlates server telemetry into plain English, gates response behind human approval, 
            and automatically re-emulates the adversary via MITRE Caldera to mathematically verify containment.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterPortal("admin")}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-[1.02]"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Admin Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onEnterPortal("employee")}
              className="flex items-center space-x-2 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-cyan-500/30 transition-all"
            >
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>Employee Security Portal</span>
            </button>

            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              className="flex items-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-5 py-3.5 text-sm font-medium text-rose-300 hover:bg-rose-950/40 transition-all disabled:opacity-50"
            >
              <Flame className={`h-4 w-4 text-rose-400 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Simulating Attack Telemetry..." : "Trigger Live Attack Replay"}</span>
            </button>
          </div>
        </div>

        {/* Live Network & Telemetry Grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>HOST ARCHITECTURE</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white tracking-tight">192.168.56.1</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Single-box controller hosting FastAPI brain, SQLite, and Next.js portal.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>VICTIM VM (TARGET)</span>
              <span className="text-cyan-400">sshd | auditd | ufw</span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white tracking-tight">192.168.56.10</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Isolated Ubuntu server producing real-time auth.log & kernel event telemetry.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>VERIFIER ENGINE</span>
              <span className="text-rose-400">Apache 2.0</span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white tracking-tight">MITRE Caldera</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Re-executes ATT&CK T1110/T1136/T1041 post-block to prove containment.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>STAFF ACCESS GATE</span>
              <span className="text-emerald-400 font-semibold">Strict 403 Gate</span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white tracking-tight">Dual-Role SOC</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Receptionist sees read-only bulletins; only authenticated Admin can trigger ufw block.
            </p>
          </div>
        </div>

        {/* 10-Step Interactive End-to-End Loop Preview */}
        <div className="mt-12 glass-panel rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
                <Workflow className="h-4 w-4" />
                <span>The End-to-End Autonomous Loop</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                9 custom-engineered steps + 1 MITRE Caldera verification re-run.
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
              <span>Zero external licensing fees</span>
            </div>
          </div>

          {/* Flow Stepper */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5">
              <div className="text-[10px] font-mono text-cyan-400">STEP 1-3</div>
              <div className="mt-1 text-xs font-semibold text-white">Attack & Ingest</div>
              <div className="text-[11px] text-slate-400 mt-1">Hydra brute force &rarr; auth.log &rarr; Contract #1</div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5">
              <div className="text-[10px] font-mono text-cyan-400">STEP 4-5</div>
              <div className="mt-1 text-xs font-semibold text-white">Graph Correlate</div>
              <div className="text-[11px] text-slate-400 mt-1">NetworkX IP graph &rarr; R1, R2, R3 rules</div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5">
              <div className="text-[10px] font-mono text-cyan-400">STEP 6-7</div>
              <div className="mt-1 text-xs font-semibold text-white">Explain & Gate</div>
              <div className="text-[11px] text-slate-400 mt-1">Plain-English LLM &rarr; Human Approval</div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5">
              <div className="text-[10px] font-mono text-cyan-400">STEP 8-9</div>
              <div className="mt-1 text-xs font-semibold text-white">SSH Firewall Block</div>
              <div className="text-[11px] text-slate-400 mt-1">Paramiko execute &rarr; sudo ufw deny</div>
            </div>

            <div className="rounded-xl bg-cyan-950/40 p-3 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <div className="text-[10px] font-mono text-cyan-300 font-bold">STEP 10 (PAYOFF)</div>
              <div className="mt-1 text-xs font-semibold text-cyan-200">Caldera Re-Run</div>
              <div className="text-[11px] text-cyan-300/80 mt-1">Re-attacks victim &rarr; Proves block held!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Server, Lock, ArrowRight, ShieldCheck, Terminal, Cpu, Flame, CheckCircle2, XCircle } from "lucide-react";

export const NetworkTopologyDiagram: React.FC = () => {
  const [viewState, setViewState] = useState<"before" | "after">("after");

  return (
    <div className="metallic-surface rounded-2xl p-6 sm:p-10 space-y-8 border border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 hairline-b gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            NETWORK ARCHITECTURE & GEOMETRY
          </div>
          <h3 className="text-xl sm:text-2xl font-medium text-white mt-1">
            Sealed Host-Only Testbed & 4 Contracts
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete structural view of how the 3 machines communicate across frozen interfaces.
          </p>
        </div>

        {/* Before / After Verification Toggle */}
        <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/10 shrink-0">
          <button
            onClick={() => setViewState("before")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              viewState === "before"
                ? "bg-white/10 text-white border border-white/10 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pre-Block State
          </button>
          <button
            onClick={() => setViewState("after")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center space-x-1 ${
              viewState === "after"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Verified Post-Block</span>
          </button>
        </div>
      </div>

      {/* Visual Network Geometry (3 Machine Canvas) */}
      <div className="relative rounded-xl bg-black/60 p-6 sm:p-8 border border-white/5 overflow-hidden">
        {/* State Banner */}
        <div className="pb-4 border-b border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">ISOLATED HOST-ONLY NETWORK: <strong className="text-slate-200">192.168.56.0/24</strong></span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            viewState === "after"
              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
              : "bg-rose-950 text-rose-300 border border-rose-800"
          }`}>
            {viewState === "after" ? "PORT 22 DENIED (PROOF VERIFIED)" : "PORT 22 EXPOSED (ATTACK SUCCESSFUL)"}
          </span>
        </div>

        {/* 3 Nodes Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 1: Attacker & Caldera */}
          <div className="metallic-card rounded-xl p-5 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">ATTACKER HOST</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                WSL / KALI
              </span>
            </div>
            <div className="text-xl font-mono font-medium text-white">192.168.56.20</div>
            <div className="space-y-1 text-xs text-slate-400 font-mono">
              <div>&bull; Hydra brute force agent</div>
              <div>&bull; MITRE Caldera Server (:8888)</div>
              <div>&bull; Sandcat adversary daemon</div>
            </div>

            {/* Direct Attack Vector Status */}
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-500">Adversary Reach:</span>
              <span className={viewState === "after" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {viewState === "after" ? "PACKETS REJECTED (RC=1)" : "INBOUND ACTIVE (RC=0)"}
              </span>
            </div>
          </div>

          {/* Center Connection Indicator */}
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
              Contract #4: SSH Firewall Block
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-0.5 w-12 bg-white/20"></div>
              {viewState === "after" ? (
                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold">
                  UFW DENY APPLIED
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono text-[10px] font-bold">
                  INBOUND TRAFFIC OPEN
                </span>
              )}
              <div className="h-0.5 w-12 bg-white/20"></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Contract #3: Caldera Re-Run Verify API
            </div>
          </div>

          {/* Node 2: Victim Target */}
          <div className="metallic-card rounded-xl p-5 space-y-3 relative border-t-white/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">MONITORED VICTIM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                UBUNTU SERVER
              </span>
            </div>
            <div className="text-xl font-mono font-medium text-white">192.168.56.10</div>
            <div className="space-y-1 text-xs text-slate-400 font-mono">
              <div>&bull; sshd (Port 22 Target)</div>
              <div>&bull; Linux Kernel auditd (useradd)</div>
              <div>&bull; ufw firewall (Egress Logging)</div>
            </div>

            {/* Ingestion status */}
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-500">Telemetry Ship:</span>
              <span className="text-cyan-400">Contract #1 JSON &rarr;</span>
            </div>
          </div>
        </div>

        {/* Node 3: Host Controller (FastAPI SOC Brain) */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="max-w-md mx-auto metallic-surface rounded-xl p-5 space-y-2 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              CONTROLLER NODE &bull; WINDOWS WORKSTATION (192.168.56.1)
            </div>
            <div className="text-sm font-semibold text-white">
              FastAPI SOC Daemon (:8000) + SQLite + Next.js UI (:3000)
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Consumes Contract #1 logs, evaluates pure rules R1/R2/R3 via NetworkX, generates plain-English summary, and provides Contract #2 JSON to frontend.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Frozen Contracts Reference Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metallic-card rounded-lg p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold">CONTRACT 01</span>
          <div className="text-xs font-semibold text-slate-200">Event JSON Schema</div>
          <p className="text-[11px] text-slate-400">ts, source_ip, user, host, event_type, raw_line</p>
        </div>

        <div className="metallic-card rounded-lg p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold">CONTRACT 02</span>
          <div className="text-xs font-semibold text-slate-200">Incident Dossier API</div>
          <p className="text-[11px] text-slate-400">status, severity, summary, rule_hits, events[]</p>
        </div>

        <div className="metallic-card rounded-lg p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold">CONTRACT 03</span>
          <div className="text-xs font-semibold text-slate-200">Caldera Verify REST</div>
          <p className="text-[11px] text-slate-400">Triggers re-attack: confirmed vs still_reachable</p>
        </div>

        <div className="metallic-card rounded-lg p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold">CONTRACT 04</span>
          <div className="text-xs font-semibold text-slate-200">Victim Access SSH</div>
          <p className="text-[11px] text-slate-400">admin@192.168.56.10 &bull; sudo ufw deny permission</p>
        </div>
      </div>
    </div>
  );
};

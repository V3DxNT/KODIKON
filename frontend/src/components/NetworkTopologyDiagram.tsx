"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const NetworkTopologyDiagram: React.FC = () => {
  const [viewState, setViewState] = useState<"before" | "after">("after");

  return (
    <div className="metallic-surface rounded-3xl p-6 sm:p-10 space-y-8 border-2 border-slate-300 dark:border-white/[0.08] shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-300 dark:border-white/10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-800 dark:text-cyan-400 font-black">
            NETWORK ARCHITECTURE & GEOMETRY
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black dark:text-white mt-1.5 tracking-tight">
            Sealed Host-Only Testbed & 4 Contracts
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-300 font-semibold mt-1">
            Complete structural view of how the 3 machines communicate across frozen interfaces.
          </p>
        </div>

        {/* Before / After Verification Toggle */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-black/40 p-1.5 border-2 border-slate-300 dark:border-white/10 shrink-0 shadow-sm">
          <button
            onClick={() => setViewState("before")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewState === "before"
                ? "bg-white dark:bg-white/10 text-black dark:text-white border border-slate-400 dark:border-white/15 shadow-sm"
                : "text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Pre-Block State
          </button>
          <button
            onClick={() => setViewState("after")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              viewState === "after"
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-800/40 shadow-sm"
                : "text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verified Post-Block</span>
          </button>
        </div>
      </div>

      {/* Visual Network Geometry (3 Machine Canvas) */}
      <div className="relative rounded-2xl bg-slate-50 dark:bg-black/60 p-6 sm:p-8 border-2 border-slate-300 dark:border-white/5 overflow-hidden shadow-inner">
        {/* State Banner */}
        <div className="pb-4 border-b border-slate-300 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
          <span className="text-slate-800 dark:text-slate-400 font-bold">
            ISOLATED HOST-ONLY NETWORK: <strong className="text-black dark:text-slate-200 font-black">192.168.56.0/24</strong>
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            viewState === "after"
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-800"
              : "bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 border-2 border-rose-400 dark:border-rose-800"
          }`}>
            {viewState === "after" ? "PORT 22 DENIED (PROOF VERIFIED)" : "PORT 22 EXPOSED (ATTACK ACTIVE)"}
          </span>
        </div>

        {/* 3 Nodes Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 1: Attacker & Caldera */}
          <div className="rounded-2xl p-5 space-y-3 relative bg-white dark:bg-[#0f121a] border-2 border-slate-300 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-400 uppercase">ATTACKER HOST</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-900 dark:text-slate-300 border border-slate-300 dark:border-white/5">
                WSL / KALI
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-black dark:text-white">192.168.56.20</div>
            <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300 font-mono font-semibold">
              <div>&bull; Hydra brute force agent</div>
              <div>&bull; MITRE Caldera Server (:8888)</div>
              <div>&bull; Sandcat adversary daemon</div>
            </div>

            {/* Direct Attack Vector Status */}
            <div className="pt-2.5 border-t border-slate-200 dark:border-white/5 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-400 font-bold">Adversary Reach:</span>
              <span className={viewState === "after" ? "text-emerald-800 dark:text-emerald-400 font-black" : "text-rose-800 dark:text-rose-400 font-black"}>
                {viewState === "after" ? "PACKETS REJECTED (RC=1)" : "INBOUND ACTIVE (RC=0)"}
              </span>
            </div>
          </div>

          {/* Center Connection Indicator */}
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="text-xs font-mono text-slate-800 dark:text-slate-400 font-bold uppercase tracking-wider text-center">
              Contract #4: SSH Firewall Block
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-0.5 w-12 bg-slate-400 dark:bg-white/20"></div>
              {viewState === "after" ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-800 font-mono text-xs font-black">
                  UFW DENY APPLIED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 border-2 border-rose-400 dark:border-rose-800 font-mono text-xs font-black">
                  INBOUND TRAFFIC OPEN
                </span>
              )}
              <div className="h-0.5 w-12 bg-slate-400 dark:bg-white/20"></div>
            </div>
            <div className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">
              Contract #3: Caldera Re-Run Verify API
            </div>
          </div>

          {/* Node 2: Victim Target */}
          <div className="rounded-2xl p-5 space-y-3 relative bg-white dark:bg-[#0f121a] border-2 border-slate-300 dark:border-white/10 shadow-sm border-t-cyan-600 dark:border-t-cyan-500">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-400 uppercase">MONITORED VICTIM</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/20">
                UBUNTU SERVER
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-black dark:text-white">192.168.56.10</div>
            <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300 font-mono font-semibold">
              <div>&bull; sshd (Port 22 Target)</div>
              <div>&bull; Linux Kernel auditd (useradd)</div>
              <div>&bull; ufw firewall (Egress Logging)</div>
            </div>

            {/* Ingestion status */}
            <div className="pt-2.5 border-t border-slate-200 dark:border-white/5 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-400 font-bold">Telemetry Ship:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-black">Contract #1 JSON &rarr;</span>
            </div>
          </div>
        </div>

        {/* Node 3: Host Controller (FastAPI SOC Brain) */}
        <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/5">
          <div className="max-w-md mx-auto rounded-2xl p-5 space-y-2 text-center bg-white dark:bg-[#0f121a] border-2 border-slate-300 dark:border-white/10 shadow-sm">
            <div className="text-xs font-mono text-cyan-800 dark:text-cyan-400 uppercase font-black">
              CONTROLLER NODE &bull; WINDOWS WORKSTATION (192.168.56.1)
            </div>
            <div className="text-base font-bold text-black dark:text-white">
              FastAPI SOC Daemon (:8000) + SQLite + Next.js UI (:3000)
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-300 font-medium max-w-sm mx-auto leading-relaxed">
              Consumes Contract #1 logs, evaluates pure rules R1/R2/R3 via NetworkX, generates plain-English summary, and provides Contract #2 JSON to frontend.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Frozen Contracts Reference Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 space-y-1 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 font-black">CONTRACT 01</span>
          <div className="text-xs font-bold text-black dark:text-white">Event JSON Schema</div>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">ts, source_ip, user, host, event_type, raw_line</p>
        </div>

        <div className="rounded-xl p-4 space-y-1 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 font-black">CONTRACT 02</span>
          <div className="text-xs font-bold text-black dark:text-white">Incident Dossier API</div>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">status, severity, summary, rule_hits, events[]</p>
        </div>

        <div className="rounded-xl p-4 space-y-1 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 font-black">CONTRACT 03</span>
          <div className="text-xs font-bold text-black dark:text-white">Caldera Verify REST</div>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">Triggers re-attack: confirmed vs still_reachable</p>
        </div>

        <div className="rounded-xl p-4 space-y-1 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 font-black">CONTRACT 04</span>
          <div className="text-xs font-bold text-black dark:text-white">Victim Access SSH</div>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">admin@192.168.56.10 &bull; sudo ufw deny permission</p>
        </div>
      </div>
    </div>
  );
};

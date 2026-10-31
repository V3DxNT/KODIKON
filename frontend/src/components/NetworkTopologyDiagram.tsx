"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const NetworkTopologyDiagram: React.FC = () => {
  const [viewState, setViewState] = useState<"before" | "after">("after");

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 space-y-8 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">
            NETWORK ARCHITECTURE & GEOMETRY
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            Sealed Host-Only Testbed & 4 Contracts
          </h3>
          <p className="text-sm text-slate-500 font-normal mt-1">
            Complete structural view of how the 3 machines communicate across frozen interfaces.
          </p>
        </div>

        {/* Before / After Verification Toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200/80 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setViewState("before")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
              viewState === "before"
                ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Pre-Block State
          </button>
          <button
            onClick={() => setViewState("after")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewState === "after"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verified Post-Block</span>
          </button>
        </div>
      </div>

      {/* Visual Network Geometry (3 Machine Canvas) */}
      <div className="relative rounded-2xl bg-slate-50/70 p-6 sm:p-8 border border-slate-200/90 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* State Banner */}
        <div className="pb-4 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
          <span className="text-slate-600 font-medium">
            ISOLATED HOST-ONLY NETWORK: <strong className="text-slate-900 font-bold">192.168.56.0/24</strong>
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              viewState === "after"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {viewState === "after" ? "PORT 22 DENIED (PROOF VERIFIED)" : "PORT 22 EXPOSED (ATTACK ACTIVE)"}
          </span>
        </div>

        {/* 3 Nodes Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 1: Attacker & Caldera */}
          <div className="rounded-2xl p-5 space-y-3 relative bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">ATTACKER HOST</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                WSL / KALI
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">192.168.56.20</div>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <div>• Hydra brute force agent</div>
              <div>• MITRE Caldera Server (:8888)</div>
              <div>• Sandcat adversary daemon</div>
            </div>

            {/* Direct Attack Vector Status */}
            <div className="pt-2.5 border-t border-slate-100 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-500 font-medium">Adversary Reach:</span>
              <span
                className={
                  viewState === "after" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"
                }
              >
                {viewState === "after" ? "PACKETS REJECTED (RC=1)" : "INBOUND ACTIVE (RC=0)"}
              </span>
            </div>
          </div>

          {/* Center Connection Indicator */}
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider text-center">
              Contract #4: SSH Firewall Block
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-0.5 w-12 bg-slate-300"></div>
              {viewState === "after" ? (
                <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold shadow-2xs">
                  UFW DENY APPLIED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-bold shadow-2xs">
                  INBOUND TRAFFIC OPEN
                </span>
              )}
              <div className="h-0.5 w-12 bg-slate-300"></div>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Contract #3: Caldera Re-Run Verify API
            </div>
          </div>

          {/* Node 2: Victim Target */}
          <div className="rounded-2xl p-5 space-y-3 relative bg-white border border-slate-200/90 shadow-sm border-t-2 border-t-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">MONITORED VICTIM</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                UBUNTU SERVER
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">192.168.56.10</div>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <div>• sshd (Port 22 Target)</div>
              <div>• Linux Kernel auditd (useradd)</div>
              <div>• ufw firewall (Egress Logging)</div>
            </div>

            {/* Ingestion status */}
            <div className="pt-2.5 border-t border-slate-100 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-500 font-medium">Telemetry Ship:</span>
              <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                Contract #1 JSON →
              </span>
            </div>
          </div>
        </div>

        {/* Node 3: Host Controller (FastAPI SOC Brain) */}
        <div className="mt-8 pt-6 border-t border-slate-200/70">
          <div className="max-w-md mx-auto rounded-2xl p-5 space-y-2 text-center bg-white border border-slate-200/90 shadow-sm">
            <div className="text-xs font-mono text-blue-600 uppercase font-bold">
              CONTROLLER NODE • WINDOWS WORKSTATION (192.168.56.1)
            </div>
            <div className="text-base font-bold text-slate-900">
              FastAPI SOC Daemon (:8000) + SQLite + Next.js UI (:3000)
            </div>
            <p className="text-xs text-slate-600 font-normal max-w-sm mx-auto leading-relaxed">
              Consumes Contract #1 logs, evaluates pure rules R1/R2/R3 via NetworkX, generates plain-English summary, and provides Contract #2 JSON to frontend.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Frozen Contracts Reference Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 space-y-1.5 bg-white border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono text-blue-600 font-bold tracking-wider">CONTRACT 01</span>
          <div className="text-xs font-bold text-slate-900">Event JSON Schema</div>
          <p className="text-xs text-slate-600 font-mono">ts, source_ip, user, host, event_type, raw_line</p>
        </div>

        <div className="rounded-xl p-4 space-y-1.5 bg-white border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono text-blue-600 font-bold tracking-wider">CONTRACT 02</span>
          <div className="text-xs font-bold text-slate-900">Incident Dossier API</div>
          <p className="text-xs text-slate-600 font-mono">status, severity, summary, rule_hits, events[]</p>
        </div>

        <div className="rounded-xl p-4 space-y-1.5 bg-white border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono text-blue-600 font-bold tracking-wider">CONTRACT 03</span>
          <div className="text-xs font-bold text-slate-900">Caldera Verify REST</div>
          <p className="text-xs text-slate-600 font-mono">Triggers re-attack: confirmed vs still_reachable</p>
        </div>

        <div className="rounded-xl p-4 space-y-1.5 bg-white border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono text-blue-600 font-bold tracking-wider">CONTRACT 04</span>
          <div className="text-xs font-bold text-slate-900">Victim Access SSH</div>
          <p className="text-xs text-slate-600 font-mono">admin@192.168.56.10 • sudo ufw deny permission</p>
        </div>
      </div>
    </div>
  );
};

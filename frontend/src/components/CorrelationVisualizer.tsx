"use client";

import React from "react";
import { Network, Terminal, ShieldAlert, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export const CorrelationVisualizer: React.FC = () => {
  return (
    <div className="metallic-surface rounded-2xl p-6 sm:p-10 space-y-8 border border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 hairline-b gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            INTELLIGENCE SYNTHESIS ENGINE
          </div>
          <h3 className="text-xl sm:text-2xl font-medium text-white mt-1">
            How 8 Scattered Log Alerts Become 1 Plain-English Incident
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Transforms overwhelming Linux noise into clear, actionable intelligence for non-technical leadership.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 shrink-0">
          NetworkX Graph Correlation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Box: 8 Raw Event Telemetry (4 cols) */}
        <div className="lg:col-span-4 metallic-card rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">RAW KERNEL & DAEMON LOGS</span>
            <span className="text-[10px] font-mono text-rose-400">8 Alerts</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-rose-300">
              sshd: Failed password for root from 192.168.56.20
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-rose-300">
              sshd: Failed password for admin from 192.168.56.20
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-rose-300">
              sshd: Failed password (3 more failures...)
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-amber-300">
              sshd: Accepted password for admin from .20
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-purple-300">
              auditd: useradd backdoor (UID=1002)
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate text-red-300">
              ufw: [EGRESS] SRC=.10 DST=.20 PROTO=TCP:4444
            </div>
          </div>
        </div>

        {/* Center: Graph Correlation Bridge (3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-3 py-4 text-center">
          <div className="h-10 w-10 rounded-full metallic-surface border border-white/20 flex items-center justify-center shadow-lg">
            <Network className="h-5 w-5 text-slate-200" />
          </div>
          <div className="text-xs font-mono font-medium text-white">
            NetworkX Graph Linkage
          </div>
          <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
            Events sharing IP <span className="font-mono text-slate-300">192.168.56.20</span> within 10 minutes form 1 connected component.
          </p>
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-slate-300">R1</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-slate-300">R2</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-slate-300">R3</span>
          </div>
        </div>

        {/* Right Box: Plain English Incident Dossier (5 cols) */}
        <div className="lg:col-span-5 metallic-card rounded-xl p-6 space-y-4 border-t-white/30">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-300 flex items-center space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>INCIDENT #101 &bull; HIGH SEVERITY</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              CONTAINMENT READY
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              PLAIN-ENGLISH SYNTHESIS
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic bg-black/40 p-3.5 rounded-lg border border-white/5">
              &ldquo;An external actor conducted an automated brute-force attack to breach server credentials, spawned an unauthorized backdoor administrative user (&apos;backdoor&apos;), and opened an unauthorized external command channel. Recommended action: Authorize immediate firewall block.&rdquo;
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-1 flex items-center justify-between">
            <span>Human Approval: <strong className="text-slate-200">1-Click</strong></span>
            <span>Proof: <strong className="text-emerald-400">Caldera Verified</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

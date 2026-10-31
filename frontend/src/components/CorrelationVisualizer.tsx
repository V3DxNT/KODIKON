"use client";

import React from "react";
import { Network, ShieldAlert } from "lucide-react";

export const CorrelationVisualizer: React.FC = () => {
  return (
    <div className="metallic-surface rounded-3xl p-6 sm:p-10 space-y-8 border-2 border-slate-300 dark:border-white/10 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-300 dark:border-white/10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-800 dark:text-cyan-400 font-black">
            INTELLIGENCE SYNTHESIS ENGINE
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black dark:text-white mt-1.5 tracking-tight">
            How 8 Scattered Log Alerts Become 1 Plain-English Incident
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-300 font-semibold mt-1 leading-relaxed">
            Transforms overwhelming Linux noise into clear, actionable intelligence for non-technical leadership.
          </p>
        </div>
        <span className="text-xs font-mono font-black text-black dark:text-white px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-slate-300 dark:border-white/15 shrink-0 shadow-sm">
          NetworkX Graph Correlation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Box: 8 Raw Event Telemetry (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl p-5 space-y-3.5 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-300 dark:border-white/10">
            <span className="text-xs font-mono uppercase font-black text-black dark:text-white">
              RAW KERNEL & DAEMON LOGS
            </span>
            <span className="text-xs font-mono font-black text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
              8 Alerts
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800/50 text-rose-950 dark:text-rose-200 font-bold truncate">
              sshd: Failed password for root from 192.168.56.20
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800/50 text-rose-950 dark:text-rose-200 font-bold truncate">
              sshd: Failed password for admin from 192.168.56.20
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800/50 text-rose-950 dark:text-rose-200 font-bold truncate">
              sshd: Failed password (3 more failures...)
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/50 text-amber-950 dark:text-amber-200 font-bold truncate">
              sshd: Accepted password for admin from .20
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800/50 text-purple-950 dark:text-purple-200 font-bold truncate">
              auditd: useradd backdoor (UID=1002)
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800/50 text-red-950 dark:text-red-200 font-bold truncate">
              ufw: [EGRESS] SRC=.10 DST=.20 PROTO=TCP:4444
            </div>
          </div>
        </div>

        {/* Center: Graph Correlation Bridge (3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-4 py-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border-2 border-cyan-400 dark:border-cyan-700/60 flex items-center justify-center shadow-md">
            <Network className="h-7 w-7 text-cyan-800 dark:text-cyan-300" />
          </div>
          <div className="text-base font-mono font-black text-black dark:text-white">
            NetworkX Graph Linkage
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold max-w-[220px] leading-relaxed">
            Events sharing IP <span className="font-mono font-black text-black dark:text-cyan-300">192.168.56.20</span> within 10 minutes form 1 connected component.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-slate-200 dark:bg-white/10 border border-slate-400 dark:border-white/20 text-black dark:text-white shadow-sm">
              R1
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-slate-200 dark:bg-white/10 border border-slate-400 dark:border-white/20 text-black dark:text-white shadow-sm">
              R2
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-slate-200 dark:bg-white/10 border border-slate-400 dark:border-white/20 text-black dark:text-white shadow-sm">
              R3
            </span>
          </div>
        </div>

        {/* Right Box: Plain English Incident Dossier (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 sm:p-7 space-y-4 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 border-t-cyan-600 dark:border-t-cyan-500 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
            <span className="text-xs font-mono uppercase font-black text-rose-700 dark:text-rose-400 flex items-center space-x-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>INCIDENT #101 &bull; HIGH SEVERITY</span>
            </span>
            <span className="text-xs font-mono font-black px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-500/30">
              CONTAINMENT READY
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest font-black text-black dark:text-slate-200">
              PLAIN-ENGLISH SYNTHESIS
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-black/60 border-2 border-slate-300 dark:border-white/10 shadow-sm">
              <p className="text-xs sm:text-sm font-semibold text-black dark:text-slate-100 leading-relaxed italic">
                &ldquo;An external actor conducted an automated brute-force attack to breach server credentials, spawned an unauthorized backdoor administrative user (&apos;backdoor&apos;), and opened an unauthorized external command channel. Recommended action: Authorize immediate firewall block.&rdquo;
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold pt-1 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
            <span className="text-slate-800 dark:text-slate-300 font-bold">
              Human Approval: <strong className="text-black dark:text-white font-black">1-Click</strong>
            </span>
            <span className="text-emerald-800 dark:text-emerald-400 font-black">
              Proof: Caldera Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { ShieldCheck, Clock, FileCheck, CheckCircle2, UserCheck, Lock } from "lucide-react";
import { AuditLog } from "@/types/soc";

interface AuditLedgerViewProps {
  logs: AuditLog[];
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({ logs }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-mono text-cyan-300 border border-cyan-800">
            COMPLIANCE & GOVERNANCE
          </span>
          <span className="text-xs text-slate-400 font-mono">Immutable Audit Record</span>
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cryptographic Response Audit Ledger
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete non-repudiation log recording every human approval, firewall execution, and Caldera adversary re-test.
        </p>
      </div>

      {/* Ledger Table */}
      <div className="mt-8 rounded-2xl glass-panel p-6 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="py-3 px-4">AUDIT ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTOR ROLE</th>
                <th className="py-3 px-4">SOAR ACTION</th>
                <th className="py-3 px-4">TARGET</th>
                <th className="py-3 px-4">EXECUTION RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {logs.map((log) => {
                const isConfirmed = log.result === "confirmed" || log.result === "ok";
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 text-cyan-400 font-bold">#{log.id}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(log.ts).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.actor_role === "admin"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white uppercase">{log.action}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300">{log.target}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isConfirmed
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700"
                          : "bg-amber-950/80 text-amber-300 border border-amber-700"
                      }`}>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{log.result.toUpperCase()}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

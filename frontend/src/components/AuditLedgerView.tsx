"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { AuditLog } from "@/types/soc";

interface AuditLedgerViewProps {
  logs: AuditLog[];
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({ logs }) => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 space-y-8">
      {/* Header */}
      <div className="pb-8 hairline-b">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="uppercase tracking-widest text-slate-300">COMPLIANCE LEDGER</span>
          <span>&bull;</span>
          <span>Immutable System Audit</span>
        </div>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">
          Cryptographic Audit & Governance Trail
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Permanent non-repudiation log recording every administrative approval, firewall rule modification, and Caldera verification re-test.
        </p>
      </div>

      {/* Ledger Table */}
      <div className="metallic-surface rounded-xl p-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="hairline-b text-slate-500 text-[11px]">
                <th className="py-3 px-4">AUDIT REF</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTOR ROLE</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">TARGET</th>
                <th className="py-3 px-4">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {logs.map((log) => {
                const isConfirmed = log.result === "confirmed" || log.result === "ok";
                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-slate-400 font-semibold">#{log.id}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(log.ts).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/[0.04] border border-white/5 text-slate-300">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-white uppercase">{log.action}</td>
                    <td className="py-4 px-4 text-slate-400">{log.target}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        isConfirmed
                          ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                          : "bg-amber-950/40 text-amber-300 border border-amber-800/40"
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

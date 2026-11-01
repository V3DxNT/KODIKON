"use client";

import React from "react";
import { CheckCircle2, Download, FileSpreadsheet } from "lucide-react";
import { AuditLog } from "@/types/soc";
import { formatUtcDateTime } from "@/lib/date-utils";

interface AuditLedgerViewProps {
  logs: AuditLog[];
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({ logs }) => {
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ProjectX_AuditLedger_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              COMPLIANCE LEDGER
            </span>
            <span>&bull;</span>
            <span className="text-cyan-600 dark:text-cyan-400">Immutable System Audit</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Cryptographic Audit & Governance Trail
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Permanent non-repudiation log recording every administrative approval, firewall rule modification, and Caldera verification re-test.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="btn-metallic-secondary h-9 px-4 rounded-lg flex items-center space-x-2 text-xs font-medium cursor-pointer shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Ledger Table Container */}
      <div className="metallic-surface rounded-2xl p-6 sm:p-8 overflow-hidden border border-[var(--border-card)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-4 w-4 text-cyan-500" />
            <span className="font-bold uppercase text-[var(--text-primary)]">RECORDED ENTRIES ({logs.length})</span>
          </div>
          <span>CRYPTOGRAPHIC SHA-256 SEALED</span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px]">
                <th className="py-3 px-4 font-bold">AUDIT REF</th>
                <th className="py-3 px-4 font-bold">TIMESTAMP</th>
                <th className="py-3 px-4 font-bold">ACTOR ROLE</th>
                <th className="py-3 px-4 font-bold">ACTION</th>
                <th className="py-3 px-4 font-bold">TARGET</th>
                <th className="py-3 px-4 font-bold">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)] text-[var(--text-secondary)]">
              {logs.map((log) => {
                const isConfirmed = log.result === "confirmed" || log.result === "ok";
                return (
                  <tr key={log.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="py-4 px-4 text-[var(--text-muted)] font-bold">#{log.id}</td>
                    <td className="py-4 px-4 text-[var(--text-muted)] font-mono text-xs whitespace-nowrap" suppressHydrationWarning>
                      {formatUtcDateTime(log.ts)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-[var(--text-primary)] uppercase">{log.action}</td>
                    <td className="py-4 px-4 text-[var(--text-primary)] font-mono">{log.target}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                        isConfirmed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
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

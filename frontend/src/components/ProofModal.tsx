"use client";

import React from "react";
import { CheckCircle2, Terminal, X, Lock, Flame } from "lucide-react";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: number;
  attackerIp: string;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  isOpen,
  onClose,
  incidentId,
  attackerIp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-lg p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase tracking-widest text-emerald-700 font-bold">VERIFICATION CONFIRMED</span>
              <span>•</span>
              <span>Incident #{incidentId}</span>
            </div>
            <h3 className="mt-0.5 text-xl font-bold text-[var(--text-primary)]">
              Adversary Emulation Proof
            </h3>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          The threat from <span className="font-mono text-[var(--text-primary)] font-bold">{attackerIp}</span> has been 
          actively re-emulated via MITRE Caldera and confirmed denied by Linux firewall policy.
        </p>

        {/* 4-Stage Verification Pipeline */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] p-3 border border-[var(--border-subtle)]">
            <div className="flex items-center space-x-2.5">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[var(--text-primary)] font-medium">1. SSH Firewall Rule Enacted</span>
            </div>
            <span className="text-[var(--text-muted)] text-[11px]">sudo ufw deny from {attackerIp}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] p-3 border border-[var(--border-subtle)]">
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[var(--text-primary)] font-medium">2. Caldera API Operation Launched</span>
            </div>
            <span className="text-[var(--text-muted)] text-[11px]">POST /api/v2/operations (T1110)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] p-3 border border-[var(--border-subtle)]">
            <div className="flex items-center space-x-2.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[var(--text-primary)] font-medium">3. Adversary Re-Attack Executed</span>
            </div>
            <span className="text-[var(--text-muted)] text-[11px]">Port 22 Reachability Probe</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-bold text-emerald-700">4. Re-Attack Verification</span>
            </div>
            <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-emerald-800 font-bold text-[10px] border border-emerald-500/40">
              CONFIRMED BLOCKED (RC=1)
            </span>
          </div>
        </div>

        {/* Pitch Callout */}
        <div className="rounded-xl bg-[var(--bg-elevated)] p-4 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">Formal Verification Guarantee:</strong> Traditional security tools execute firewall commands and assume reachability dropped. SENTINEL FORGE runs automated adversary re-testing to provide provable non-repudiation.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="btn-metallic-primary h-9 px-4 text-xs"
            data-preserve-color
            style={{ color: "#ffffff", backgroundColor: "#0f172a" }}
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

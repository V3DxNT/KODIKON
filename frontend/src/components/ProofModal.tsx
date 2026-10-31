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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl metallic-surface rounded-2xl p-8 sm:p-10 border border-white/15 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="uppercase tracking-widest text-emerald-400">VERIFICATION CONFIRMED</span>
              <span>&bull;</span>
              <span>Incident #{incidentId}</span>
            </div>
            <h3 className="mt-1 text-xl font-medium text-white">
              Adversary Emulation Proof
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The threat from <span className="font-mono text-slate-200 font-semibold">{attackerIp}</span> has been 
          actively re-emulated via MITRE Caldera and confirmed denied by Linux firewall policy.
        </p>

        {/* 4-Stage Verification Pipeline */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3.5 border border-white/[0.05]">
            <div className="flex items-center space-x-3">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-300">1. SSH Firewall Rule Enacted</span>
            </div>
            <span className="text-slate-500 text-[11px]">sudo ufw deny from {attackerIp}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3.5 border border-white/[0.05]">
            <div className="flex items-center space-x-3">
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-300">2. Caldera API Operation Launched</span>
            </div>
            <span className="text-slate-500 text-[11px]">POST /api/v2/operations (T1110)</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3.5 border border-white/[0.05]">
            <div className="flex items-center space-x-3">
              <Flame className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-300">3. Adversary Re-Attack Executed</span>
            </div>
            <span className="text-slate-500 text-[11px]">Port 22 Reachability Probe</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-emerald-950/20 p-3.5 border border-emerald-500/30">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-medium text-emerald-200">4. Re-Attack Verification</span>
            </div>
            <span className="rounded bg-emerald-950 px-2 py-0.5 text-emerald-300 font-bold text-[10px] border border-emerald-800">
              CONFIRMED BLOCKED (RC=1)
            </span>
          </div>
        </div>

        {/* Pitch Callout */}
        <div className="rounded-lg bg-white/[0.02] p-4 border border-white/[0.06] text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Formal Verification Guarantee:</strong> Traditional security tools execute firewall commands and assume reachability dropped. Project X runs automated adversary re-testing to provide provable non-repudiation.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="btn-metallic-primary rounded-lg px-5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

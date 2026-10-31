"use client";

import React from "react";
import Link from "next/link";
import { User, Lock, Flame, FileText, ArrowRight, ShieldCheck } from "lucide-react";

export const PortalDirectorySection: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between pb-2 hairline-b">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            SYSTEM DIRECTORY
          </div>
          <h3 className="text-lg font-medium text-white mt-1">
            Access Dedicated Functional Consoles
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">4 Operational Modules</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Staff */}
        <Link
          href="/staff"
          className="metallic-card metallic-card-hover rounded-xl p-6 flex flex-col justify-between group space-y-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">MODULE 01</span>
              <User className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-white mt-3">Staff Security Feed</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Non-technical, plain-English executive briefings on active threats and business impact.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 pt-2 border-t border-white/5 group-hover:text-white transition-colors">
            <span>Enter Staff Feed</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        {/* Module 2: Admin */}
        <Link
          href="/admin"
          className="metallic-card metallic-card-hover rounded-xl p-6 flex flex-col justify-between group space-y-4 border-t-white/30"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">MODULE 02</span>
              <Lock className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-white mt-3">Admin Command Center</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Correlated incident dossiers, two-step SOAR response gate, and Caldera verification proof.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-300 flex items-center space-x-1.5 pt-2 border-t border-white/5 group-hover:text-white transition-colors">
            <span>Launch Command Center</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        {/* Module 3: Attacks */}
        <Link
          href="/attacks"
          className="metallic-card metallic-card-hover rounded-xl p-6 flex flex-col justify-between group space-y-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">MODULE 03</span>
              <Flame className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-white mt-3">Attack Emulation Lab</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Execute the 3-act adversary chain (Hydra T1110, useradd T1136, egress T1041) into the live pipeline.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 pt-2 border-t border-white/5 group-hover:text-white transition-colors">
            <span>Open Attack Lab</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        {/* Module 4: Audit */}
        <Link
          href="/audit"
          className="metallic-card metallic-card-hover rounded-xl p-6 flex flex-col justify-between group space-y-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">MODULE 04</span>
              <FileText className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-white mt-3">Cryptographic Audit Trail</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Immutable chronological record of administrative approvals, firewall executions, and re-test results.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 pt-2 border-t border-white/5 group-hover:text-white transition-colors">
            <span>View Audit Ledger</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>
    </section>
  );
};

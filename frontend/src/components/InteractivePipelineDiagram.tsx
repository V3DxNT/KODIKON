"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export const InteractivePipelineDiagram: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      badge: "STEP 1 &bull; ATTACK",
      title: "Adversary Inbound Attack",
      actor: "Attacker (192.168.56.20)",
      description: "Hydra brute-forces SSH port 22, spawns backdoor user 'backdoor', and makes outbound connection.",
      technique: "MITRE ATT&CK T1110, T1136, T1041",
      codePreview: "$ hydra -l admin -P pass.txt ssh://192.168.56.10:22",
    },
    {
      id: 1,
      badge: "STEP 2-3 &bull; INGEST",
      title: "Log Normalization",
      actor: "Victim (192.168.56.10) &rarr; Controller",
      description: "Raw auth.log & auditd kernel streams are converted into typed Contract #1 JSON schema.",
      technique: "Contract #1 JSON Ingestion",
      codePreview: 'POST /events {"ts":"2026-10-31T11:40Z","source_ip":"192.168.56.20","event_type":"ssh_fail"}',
    },
    {
      id: 2,
      badge: "STEP 4-5 &bull; CORRELATE",
      title: "NetworkX Graph Correlation",
      actor: "FastAPI Engine (192.168.56.1)",
      description: "Aggregates events sharing IP in a 10m window into 1 Incident. Triggers pure rules R1, R2, R3.",
      technique: "Rule Engine: R1 + R2 + R3 &rarr; HIGH Severity",
      codePreview: 'G.add_edge(event_1, event_2) # Connected component -> Incident #101',
    },
    {
      id: 3,
      badge: "STEP 6-7 &bull; EXPLAIN & GATE",
      title: "Plain-English LLM & Approval",
      actor: "LLM + Office Administrator",
      description: "Explains attack in 3 sentences for non-technical staff. Requires authenticated admin 1-click approval.",
      technique: "Dual-Role RBAC (Staff 403 vs Admin 200)",
      codePreview: 'Prompt: "Explain this incident in 3 plain-English sentences for office staff."',
    },
    {
      id: 4,
      badge: "STEP 8-9 &bull; BLOCK",
      title: "SSH Firewall Isolation",
      actor: "Paramiko SSH &rarr; Victim Host",
      description: "Admin approval executes sudo ufw deny over SSH to immediately drop attacker packets at kernel level.",
      technique: "Contract #4 &bull; Paramiko Execution",
      codePreview: "$ ssh admin@192.168.56.10 'sudo ufw deny from 192.168.56.20'",
    },
    {
      id: 5,
      badge: "STEP 10 &bull; VERIFY (PAYOFF)",
      title: "MITRE Caldera Verification",
      actor: "Caldera Server (192.168.56.20)",
      description: "Re-executes the exact adversary profile against port 22. Connection is denied, mathematically proving the block.",
      technique: "Contract #3 &bull; Non-Repudiation Proof",
      codePreview: 'POST /api/v2/operations -> Result: CONFIRMED BLOCKED (RC=1)',
    },
  ];

  const current = stages[selectedStage];

  return (
    <div className="metallic-surface rounded-2xl p-6 sm:p-10 space-y-8 border-2 border-slate-300 dark:border-white/[0.08] shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-300 dark:border-white/10 gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-800 dark:text-cyan-400 font-black">
            VISUAL WORKFLOW PIPELINE
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black dark:text-white mt-1.5 tracking-tight">
            The Autonomous 10-Step Execution Loop
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-300 font-semibold mt-1">
            Click any stage below to inspect the data payload and technical execution.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-black dark:text-slate-300 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.02] border-2 border-slate-300 dark:border-white/10 shrink-0">
          9 Custom Steps + 1 Caldera Re-Run
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stg) => {
          const isSelected = selectedStage === stg.id;
          const isProof = stg.id === 5;

          return (
            <button
              key={stg.id}
              onClick={() => setSelectedStage(stg.id)}
              className={`p-4 rounded-xl text-left transition-all border-2 cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? isProof
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md"
                    : "bg-white dark:bg-white/[0.08] border-slate-900 dark:border-white/40 shadow-md"
                  : "bg-slate-50 dark:bg-[#0c0e14] border-slate-300 dark:border-white/[0.06] hover:border-slate-400 dark:hover:border-white/20"
              }`}
            >
              <div>
                <span className={`text-[9px] font-mono uppercase font-black tracking-wider ${
                  isProof ? "text-emerald-800 dark:text-emerald-400" : isSelected ? "text-black dark:text-white" : "text-slate-700 dark:text-slate-400"
                }`}>
                  {stg.badge}
                </span>
                <div className="text-xs font-bold text-black dark:text-white mt-1.5 leading-snug">
                  {stg.title}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold flex items-center space-x-1">
                <span>Inspect</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Technical Payload Viewer */}
      <div className="rounded-2xl p-6 sm:p-8 space-y-4 bg-slate-50 dark:bg-[#0c0e14] border-2 border-slate-300 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wider">
              {current.title}
            </span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300">{current.actor}</span>
          </div>
          <span className="text-xs font-mono font-black text-black dark:text-slate-200 px-2.5 py-1 rounded bg-slate-200 dark:bg-white/[0.06] border border-slate-400 dark:border-white/10">
            {current.technique}
          </span>
        </div>

        <p className="text-sm text-slate-950 dark:text-slate-200 font-medium leading-relaxed max-w-3xl">
          {current.description}
        </p>

        {/* Code Snippet Box (Terminal keeps authentic dark background) */}
        <div className="preserve-dark rounded-xl bg-[#08090d] p-4 font-mono text-xs text-emerald-400 border border-slate-700 dark:border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest pb-1 border-b border-white/10 font-bold">
            EXECUTION PAYLOAD / TELEMETRY INTERFACE
          </div>
          <div className="pt-2 text-emerald-300 font-semibold">{current.codePreview}</div>
        </div>
      </div>
    </div>
  );
};

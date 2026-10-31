"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export const InteractivePipelineDiagram: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      badge: "STEP 1 • ATTACK",
      title: "Adversary Inbound Attack",
      actor: "Attacker (192.168.56.20)",
      description: "Hydra brute-forces SSH port 22, spawns backdoor user 'backdoor', and makes outbound connection.",
      technique: "MITRE ATT&CK T1110, T1136, T1041",
      codePreview: "$ hydra -l admin -P pass.txt ssh://192.168.56.10:22",
    },
    {
      id: 1,
      badge: "STEP 2-3 • INGEST",
      title: "Log Normalization",
      actor: "Victim (192.168.56.10) → Controller",
      description: "Raw auth.log & auditd kernel streams are converted into typed Contract #1 JSON schema.",
      technique: "Contract #1 JSON Ingestion",
      codePreview: 'POST /events {"ts":"2026-10-31T11:40Z","source_ip":"192.168.56.20","event_type":"ssh_fail"}',
    },
    {
      id: 2,
      badge: "STEP 4-5 • CORRELATE",
      title: "NetworkX Graph Correlation",
      actor: "FastAPI Engine (192.168.56.1)",
      description: "Aggregates events sharing IP in a 10m window into 1 Incident. Triggers pure rules R1, R2, R3.",
      technique: "Rule Engine: R1 + R2 + R3 → HIGH Severity",
      codePreview: "G.add_edge(event_1, event_2) # Connected component -> Incident #101",
    },
    {
      id: 3,
      badge: "STEP 6-7 • EXPLAIN & GATE",
      title: "Plain-English LLM & Approval",
      actor: "LLM + Office Administrator",
      description: "Explains attack in 3 sentences for non-technical staff. Requires authenticated admin 1-click approval.",
      technique: "Dual-Role RBAC (Staff 403 vs Admin 200)",
      codePreview: 'Prompt: "Explain this incident in 3 plain-English sentences for office staff."',
    },
    {
      id: 4,
      badge: "STEP 8-9 • BLOCK",
      title: "SSH Firewall Isolation",
      actor: "Paramiko SSH → Victim Host",
      description: "Admin approval executes sudo ufw deny over SSH to immediately drop attacker packets at kernel level.",
      technique: "Contract #4 • Paramiko Execution",
      codePreview: "$ ssh admin@192.168.56.10 'sudo ufw deny from 192.168.56.20'",
    },
    {
      id: 5,
      badge: "STEP 10 • VERIFY (PAYOFF)",
      title: "MITRE Caldera Verification",
      actor: "Caldera Server (192.168.56.20)",
      description: "Re-executes the exact adversary profile against port 22. Connection is denied, mathematically proving the block.",
      technique: "Contract #3 • Non-Repudiation Proof",
      codePreview: "POST /api/v2/operations -> Result: CONFIRMED BLOCKED (RC=1)",
    },
  ];

  const current = stages[selectedStage];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 space-y-8 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">
            VISUAL WORKFLOW PIPELINE
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            The Autonomous 10-Step Execution Loop
          </h3>
          <p className="text-sm text-slate-500 font-normal mt-1">
            Click any stage below to inspect the data payload and technical execution.
          </p>
        </div>
        <div className="text-xs font-mono font-medium text-slate-600 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? isProof
                    ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                    : "bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                  : isProof
                  ? "bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  : "bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isProof
                      ? "text-emerald-700"
                      : isSelected
                      ? "text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  {stg.badge}
                </span>
                <div className="text-xs font-semibold text-slate-900 mt-1.5 leading-snug">
                  {stg.title}
                </div>
              </div>

              <div
                className={`text-[11px] font-mono font-medium flex items-center space-x-1 ${
                  isProof
                    ? "text-emerald-700"
                    : isSelected
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              >
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Technical Payload Viewer */}
      <div className="rounded-2xl p-6 sm:p-7 space-y-4 bg-slate-50/80 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200/70 gap-2">
          <div className="flex flex-wrap items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              {current.title}
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-xs font-mono text-slate-600 font-medium">{current.actor}</span>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-700 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
            {current.technique}
          </span>
        </div>

        <p className="text-sm text-slate-700 font-normal leading-relaxed max-w-3xl">
          {current.description}
        </p>

        {/* Code Snippet Box (Sleek macOS Terminal Window matching Apple aesthetics) */}
        <div className="rounded-xl bg-[#0f172a] text-slate-100 overflow-hidden border border-slate-800 shadow-md">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b]/80 border-b border-slate-800 text-[10px] font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-slate-400 uppercase tracking-wider font-semibold">
                EXECUTION PAYLOAD / TELEMETRY INTERFACE
              </span>
            </div>
            <span className="text-slate-500">zsh</span>
          </div>
          <div className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {current.codePreview}
          </div>
        </div>
      </div>
    </div>
  );
};

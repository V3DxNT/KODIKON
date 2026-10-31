"use client";

import React, { useState } from "react";
import { Server, ShieldCheck, Terminal, Cpu, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export const ArchitectureDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: "Attack & Log Generation",
      desc: "Hydra brute force & backdoor creation target port 22 on the victim VM, producing kernel auditd, auth.log, and ufw telemetry.",
      contract: "Contract #4 (SSH Access) & Contract #1 (Event Normalization)",
    },
    {
      num: 2,
      title: "Graph Correlation & Rules",
      desc: "FastAPI ingest engine correlates incoming events using NetworkX by IP & 10m window, evaluating pure rules R1, R2, and R3.",
      contract: "Contract #1 (Event JSON Schema)",
    },
    {
      num: 3,
      title: "Plain-English LLM Intelligence",
      desc: "Converts correlated technical alerts into a 3-sentence non-technical synthesis with automatic offline Jinja2 template fallback.",
      contract: "Contract #2 (IncidentOut Schema)",
    },
    {
      num: 4,
      title: "Dual-Role Human Response Gate",
      desc: "Enforces RBAC: non-technical staff review read-only bulletins while an authenticated administrator authorizes firewall containment.",
      contract: "FastAPI X-Role Dependency Gate (HTTP 403 on non-admin)",
    },
    {
      num: 5,
      title: "Firewall Block & Caldera Verification",
      desc: "Paramiko applies 'sudo ufw deny', then triggers MITRE Caldera REST API to re-run the attack against port 22 to mathematically prove isolation.",
      contract: "Contract #3 (Caldera REST Verify API)",
    },
  ];

  return (
    <div className="metallic-surface rounded-2xl p-8 sm:p-12 space-y-10 border border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 hairline-b gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            SYSTEM SPECIFICATION & TOPOLOGY
          </div>
          <h3 className="text-xl sm:text-2xl font-medium text-white mt-1">
            The 3-Machine Sealed Testbed & 4 Contracts
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400 px-3 py-1 rounded-md bg-white/[0.02] border border-white/5">
          Host-Only Network: 192.168.56.0/24
        </div>
      </div>

      {/* 3 Machines Visual Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Machine 1 */}
        <div className="metallic-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">NODE 01 &bull; ATTACKER</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-rose-300 bg-rose-500/10 border border-rose-500/20">
              WSL / KALI
            </span>
          </div>
          <div className="text-lg font-mono font-medium text-white">192.168.56.20</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hosts attack scripts (Hydra) + MITRE Caldera server and Sandcat agent. Re-runs attack to verify block.
          </p>
          <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-white/5">
            Role A & D &bull; Contract #3
          </div>
        </div>

        {/* Machine 2 */}
        <div className="metallic-card rounded-xl p-6 space-y-4 border-t-white/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">NODE 02 &bull; VICTIM TARGET</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
              UBUNTU 24.04
            </span>
          </div>
          <div className="text-lg font-mono font-medium text-white">192.168.56.10</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            sshd (port 22), nginx, auditd, and ufw firewall. Runs local log collector shipping normalized events.
          </p>
          <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-white/5">
            Role A &bull; Contract #1 & #4
          </div>
        </div>

        {/* Machine 3 */}
        <div className="metallic-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">NODE 03 &bull; CONTROLLER</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
              WINDOWS HOST
            </span>
          </div>
          <div className="text-lg font-mono font-medium text-white">192.168.56.1</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            FastAPI SOC brain, SQLite, and Next.js frontend. Reaches the internet exclusively for the LLM API call.
          </p>
          <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-white/5">
            Role B & C &bull; Contract #2
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Flow */}
      <div className="space-y-4 pt-4">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 pb-2">
          EXPLORE THE VERIFIED END-TO-END FLOW (STEPS 1 &ndash; 5)
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 rounded-lg text-left text-xs font-mono transition-all border cursor-pointer ${
                activeStep === s.num
                  ? "bg-white/10 text-white border-white/30 shadow-sm"
                  : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              <div className="font-bold text-[10px] text-slate-500">STAGE 0{s.num}</div>
              <div className="text-slate-200 mt-1 truncate">{s.title.split("&")[0]}</div>
            </button>
          ))}
        </div>

        {/* Active Step Explainer Card */}
        <div className="metallic-card rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {steps[activeStep - 1].title}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {steps[activeStep - 1].contract}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {steps[activeStep - 1].desc}
          </p>
        </div>
      </div>
    </div>
  );
};

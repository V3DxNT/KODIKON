"use client";

import React, { useState } from "react";
import { Radio, Terminal } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  ip: string;
  role: string;
  status: "secure" | "compromised" | "quarantined" | "verifying";
  details: string;
  badge: string;
  metrics: { label: string; value: string }[];
}

const NODES: NodeData[] = [
  {
    id: "attacker",
    name: "Adversary Machine",
    ip: "192.168.56.20",
    role: "Caldera Server & Sandcat",
    status: "quarantined",
    details: "Automated adversary emulator testing SSH brute-force (T1110) & backdoor accounts (T1136).",
    badge: "ISOLATED VIA UFW",
    metrics: [
      { label: "ATTACK VECTOR", value: "MITRE T1110" },
      { label: "PORT QUARANTINED", value: "22/TCP (SSH)" },
      { label: "VERIFICATION", value: "EXIT CODE 1" },
    ],
  },
  {
    id: "gateway",
    name: "SOC Host Controller",
    ip: "192.168.56.1",
    role: "FastAPI Daemon & Engine",
    status: "secure",
    details: "Ingests raw auth.log via Log Shipper, runs R1-R3 correlation, and prompts human authorization.",
    badge: "SOC CORE ACTIVE",
    metrics: [
      { label: "CORRELATION", value: "R1 · R2 · R3" },
      { label: "GATEWAY LATENCY", value: "< 1.2ms" },
      { label: "HUMAN GATE", value: "DUAL CUSTODY" },
    ],
  },
  {
    id: "victim",
    name: "Victim Ubuntu Server",
    ip: "192.168.56.10",
    role: "Production Target",
    status: "secure",
    details: "Linux kernel target with auditd, sshd, and UFW firewall policy managed by SENTINEL FORGE.",
    badge: "CONTAINED & PROTECTED",
    metrics: [
      { label: "UFW STATUS", value: "ACTIVE (DROP)" },
      { label: "LOG SHIPPER", value: "AUDITD RUNNING" },
      { label: "DATA LOSS", value: "0 BYTES" },
    ],
  },
];

const LOG_FEED = [
  { time: "17:42:01", msg: "sshd[4109]: Failed password for root from 192.168.56.20 port 48212", tag: "T1110" },
  { time: "17:42:04", msg: "rule_engine: R-01 Brute Force threshold tripped (8 attempts / 30s)", tag: "CORRELATION" },
  { time: "17:42:09", msg: "human_gate: Admin authorized containment block on IP 192.168.56.20", tag: "GATE-OK" },
  { time: "17:42:12", msg: "caldera_verifier: Re-ran adversary profile -> Connection Refused (Proof SEALED)", tag: "PROOF-VERIFIED" },
];

export function CyberRadarLens() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("attacker");
  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden select-none border border-[var(--border-card)] shadow-2xl bg-[var(--bg-card)] transition-colors">
      {/* Subtle Ambient Grid Background (Clean 2D Vector) */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-indigo-500/[0.04] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 p-5 sm:p-7 space-y-6">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)]">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold tracking-wider text-[var(--text-primary)] uppercase">
              PERIMETER TELEMETRY MATRIX
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--text-muted)]">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SAMPLE RATE: 2.5s</span>
            <span className="text-[var(--text-muted)]">&bull;</span>
            <span className="text-emerald-400 font-medium">UFW VERIFIED</span>
          </div>
        </div>

        {/* 2D Network Node Cards (3 Machines) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--bg-elevated)] border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30"
                    : "bg-[var(--bg-surface)] border-[var(--border-card)] hover:border-cyan-400/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {node.role.split(" ")[0]}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      node.status === "quarantined"
                        ? "bg-rose-500 animate-pulse"
                        : "bg-emerald-400"
                    }`}
                  />
                </div>
                <div className="text-xs font-bold font-mono text-[var(--text-primary)] truncate">
                  {node.ip}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-sans truncate mt-0.5">
                  {node.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Deep-Dive Panel (Clean 2D Cybersecurity Telemetry) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                  {selectedNode.name}
                </span>
                <span className="text-xs font-mono text-cyan-400">({selectedNode.ip})</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {selectedNode.details}
              </p>
            </div>

            <span className="shrink-0 self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {selectedNode.badge}
            </span>
          </div>

          {/* 3 Real Technical Metric Tiles */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {selectedNode.metrics.map((m) => (
              <div
                key={m.label}
                className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)]"
              >
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider truncate">
                  {m.label}
                </div>
                <div className="text-xs font-mono font-bold text-[var(--text-primary)] truncate mt-1">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Attack Feed Banner */}
        <div className="p-3 rounded-xl bg-[var(--bg-terminal)] border border-[var(--border-hairline)] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>LIVE JOURNALD / AUTH LOG INGESTION</span>
            </span>
            <span className="text-emerald-400 font-semibold">100% CAPTURED</span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {LOG_FEED.slice(0, 3).map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors truncate gap-2"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-[var(--text-muted)] text-[10px]">{log.time}</span>
                  <span className="truncate">{log.msg}</span>
                </div>
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-cyan-300">
                  {log.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const CyberPerimeterMatrix = CyberRadarLens;

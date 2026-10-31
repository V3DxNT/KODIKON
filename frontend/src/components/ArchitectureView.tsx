"use client";

import React from "react";
import { Shield, Layers, FileCode, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-mono text-cyan-300 border border-cyan-800">
            SYSTEM DESIGN
          </span>
          <span className="text-xs text-slate-400 font-mono">MITRE ATT&CK & Enterprise Twin</span>
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Project X Technical Architecture
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          How Project X right-sizes enterprise SIEM/SOAR patterns for single-box zero-cost operation.
        </p>
      </div>

      {/* Enterprise Twin Comparison Table (Judge-Winning Slide Content) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <Layers className="h-4 w-4" />
          <span>Enterprise Twin Mapping (Why Right-Sizing Matters)</span>
        </h3>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          Small businesses with 1 administrator cannot maintain 10-node Wazuh or Shuffle clusters. 
          Project X re-implements the core patterns cleanly in lightweight Python/FastAPI while reusing the industry-standard MITRE Caldera for verification.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">SOC COMPONENT</th>
                <th className="py-2.5 px-3">ENTERPRISE STANDARD</th>
                <th className="py-2.5 px-3">PROJECT X IMPLEMENTATION</th>
                <th className="py-2.5 px-3">EFFICIENCY BENEFIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr className="hover:bg-white/5">
                <td className="py-3 px-3 font-bold text-white">Detection & Ingest</td>
                <td className="py-3 px-3 text-slate-400">Wazuh / Splunk (GPLv2/Enterprise)</td>
                <td className="py-3 px-3 text-cyan-300">Custom Log Parser + NetworkX</td>
                <td className="py-3 px-3 text-emerald-400">&lt; 30MB RAM overhead</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-3 font-bold text-white">Orchestration & Approval</td>
                <td className="py-3 px-3 text-slate-400">Shuffle SOAR / Tines</td>
                <td className="py-3 px-3 text-cyan-300">Role-Gated FastAPI Dependency</td>
                <td className="py-3 px-3 text-emerald-400">Zero webhook latency</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-3 font-bold text-white">Firewall Execution</td>
                <td className="py-3 px-3 text-slate-400">Palo Alto / Ansible</td>
                <td className="py-3 px-3 text-cyan-300">Paramiko SSH (sudo ufw deny)</td>
                <td className="py-3 px-3 text-emerald-400">No heavy agent required</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-3 font-bold text-white">Adversary Verification</td>
                <td className="py-3 px-3 text-slate-400">Manual Red Team</td>
                <td className="py-3 px-3 text-cyan-300">MITRE Caldera (Apache 2.0)</td>
                <td className="py-3 px-3 text-emerald-400">Automated mathematical proof</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The 4 Frozen Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl glass-card p-6 border border-white/10">
          <div className="text-xs font-mono text-cyan-400">CONTRACT #1 (Role A &rarr; B)</div>
          <h4 className="mt-1 text-base font-bold text-white">Normalized Event JSON Schema</h4>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Victim log collector normalizes raw lines into typed objects: <code>ts</code>, <code>source_ip</code>, <code>user</code>, <code>host</code>, <code>event_type</code>, and <code>raw_line</code>.
          </p>
        </div>

        <div className="rounded-2xl glass-card p-6 border border-white/10">
          <div className="text-xs font-mono text-cyan-400">CONTRACT #2 (Role B &rarr; C)</div>
          <h4 className="mt-1 text-base font-bold text-white">Incident & Graph Output Schema</h4>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            FastAPI serves full incident dossiers with plain-English summary, rule triggers (<code>R1, R2, R3</code>), and related events array consumed by the Next.js UI.
          </p>
        </div>

        <div className="rounded-2xl glass-card p-6 border border-white/10">
          <div className="text-xs font-mono text-cyan-400">CONTRACT #3 (Role D &rarr; B)</div>
          <h4 className="mt-1 text-base font-bold text-white">Caldera Verification Client</h4>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            REST API triggers adversary profile re-run against victim port 22 and checks for connection failure: returns <code>confirmed</code> or <code>still_reachable</code>.
          </p>
        </div>

        <div className="rounded-2xl glass-card p-6 border border-white/10">
          <div className="text-xs font-mono text-cyan-400">CONTRACT #4 (Role A &rarr; B, D)</div>
          <h4 className="mt-1 text-base font-bold text-white">Victim Isolation & Access</h4>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Ubuntu Server on host-only <code>192.168.56.10</code> with dedicated SSH key restricted to executing <code>sudo ufw deny from &lt;ip&gt;</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

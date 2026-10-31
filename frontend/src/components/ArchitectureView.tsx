"use client";

import React from "react";
import { Layers } from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 space-y-12">
      {/* Header */}
      <div className="pb-8 hairline-b">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="uppercase tracking-widest text-slate-300">ARCHITECTURE & POSITIONING</span>
          <span>&bull;</span>
          <span>Direction C: Reuse & Own</span>
        </div>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">
          System Specifications & Contract Model
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          How SENTINEL FORGE right-sizes enterprise SIEM/SOAR patterns into a single-box zero-cost architecture.
        </p>
      </div>

      {/* Enterprise Twin Comparison Table */}
      <div className="metallic-surface rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center justify-between pb-4 hairline-b">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-slate-400" />
            <span>Enterprise Twin Mapping (Honest Engineering Positioning)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Zero Copyleft Obligations</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Enterprise tools (Wazuh, Shuffle, Splunk) require complex multi-node clusters and high memory footprints. 
          SENTINEL FORGE cleanly reimplements the detect/approve/block patterns in lightweight custom code while directly reusing 
          MITRE Caldera (Apache-2.0 permissive license) for automated adversarial verification.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="hairline-b text-slate-500 text-[11px]">
                <th className="py-3 px-3">COMPONENT</th>
                <th className="py-3 px-3">ENTERPRISE TWIN</th>
                <th className="py-3 px-3">SENTINEL FORGE ARCHITECTURE</th>
                <th className="py-3 px-3">EFFICIENCY GAIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold text-white">Detection & Ingestion</td>
                <td className="py-3.5 px-3 text-slate-400">Wazuh / Splunk (GPLv2/Enterprise)</td>
                <td className="py-3.5 px-3 text-slate-200">Custom Log Normalizer + NetworkX</td>
                <td className="py-3.5 px-3 text-slate-400">&lt; 30MB Resident Memory</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold text-white">Response Approval Gate</td>
                <td className="py-3.5 px-3 text-slate-400">Shuffle SOAR / Tines</td>
                <td className="py-3.5 px-3 text-slate-200">FastAPI Role Dependency (Dual-Role)</td>
                <td className="py-3.5 px-3 text-slate-400">Zero Webhook Latency</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold text-white">Firewall Execution</td>
                <td className="py-3.5 px-3 text-slate-400">Palo Alto / Ansible</td>
                <td className="py-3.5 px-3 text-slate-200">Paramiko SSH (sudo ufw deny)</td>
                <td className="py-3.5 px-3 text-slate-400">Agentless Zero Overhead</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold text-white">Adversary Verification</td>
                <td className="py-3.5 px-3 text-slate-400">Manual Red Team Retest</td>
                <td className="py-3.5 px-3 text-slate-200">MITRE Caldera (Apache 2.0)</td>
                <td className="py-3.5 px-3 text-emerald-400">Automated Mathematical Proof</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The 4 Frozen Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metallic-card rounded-xl p-6 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">CONTRACT 01</div>
          <h4 className="text-sm font-semibold text-white">Normalized Event JSON Schema</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingestion contract output by victim VM log collector: <code>ts</code>, <code>source_ip</code>, <code>user</code>, <code>host</code>, <code>event_type</code>, and <code>raw_line</code>.
          </p>
        </div>

        <div className="metallic-card rounded-xl p-6 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">CONTRACT 02</div>
          <h4 className="text-sm font-semibold text-white">Incident & Graph Output Schema</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            FastAPI exposes complete incident dossier: severity, rule hit triggers (<code>R1, R2, R3</code>), plain-English summary, and chronological events array.
          </p>
        </div>

        <div className="metallic-card rounded-xl p-6 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">CONTRACT 03</div>
          <h4 className="text-sm font-semibold text-white">Caldera Verification Client</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            REST API triggers adversary profile re-run against victim port 22 and returns mathematical proof: <code>confirmed</code> or <code>still_reachable</code>.
          </p>
        </div>

        <div className="metallic-card rounded-xl p-6 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">CONTRACT 04</div>
          <h4 className="text-sm font-semibold text-white">Perimeter Access & Permissions</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Victim Ubuntu Server on host-only <code>192.168.56.10</code> with dedicated SSH key restricted strictly to executing <code>sudo ufw deny</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  Lock, 
  Check, 
  Layers, 
  FileText,
  Server,
  Play
} from "lucide-react";
import { IncidentDetail } from "@/types/soc";
import { EventGraphTimeline } from "./EventGraphTimeline";
import { ProofModal } from "./ProofModal";

interface AdminPortalProps {
  incidents: IncidentDetail[];
  onApprove: (id: number) => Promise<void>;
  onBlock: (id: number) => Promise<void>;
  onTriggerReplay: () => Promise<void>;
  isReplaying: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  incidents,
  onApprove,
  onBlock,
  onTriggerReplay,
  isReplaying,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(incidents[0]?.id || 101);
  const [activeSubTab, setActiveSubTab] = useState<"dossier" | "telemetry" | "infrastructure">("dossier");
  const [isApproving, setIsApproving] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleApproveClick = async () => {
    if (!currentIncident) return;
    setIsApproving(true);
    try {
      await onApprove(currentIncident.id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleBlockClick = async () => {
    if (!currentIncident) return;
    setIsBlocking(true);
    try {
      await onBlock(currentIncident.id);
      setProofModalOpen(true);
    } finally {
      setIsBlocking(false);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === "all") return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 space-y-10">
      {/* Top Formal Admin Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 hairline-b gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="uppercase tracking-widest text-slate-300">ADMINISTRATIVE CONSOLE</span>
            <span>&bull;</span>
            <span>Clearance: X-Role: admin</span>
          </div>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">
            Security Operations Command Center
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Correlated perimeter telemetry, human-in-the-loop response authorization, and adversary verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onTriggerReplay}
            disabled={isReplaying}
            className="btn-metallic-secondary flex items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-300 cursor-pointer disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 text-slate-400 ${isReplaying ? "animate-spin" : ""}`} />
            <span>{isReplaying ? "Simulating Attack Telemetry..." : "Replay Inbound Attack"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Incident Register + Right Incident Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Incident Register (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
              INCIDENT REGISTER ({filteredIncidents.length})
            </span>
            {/* Filter pills */}
            <div className="flex items-center space-x-1 text-[11px] font-mono">
              <button
                onClick={() => setFilterSeverity("all")}
                className={`px-2 py-0.5 rounded transition-colors ${filterSeverity === "all" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilterSeverity("high")}
                className={`px-2 py-0.5 rounded transition-colors ${filterSeverity === "high" ? "bg-white/10 text-rose-300" : "text-slate-500 hover:text-slate-300"}`}
              >
                HIGH
              </button>
              <button
                onClick={() => setFilterSeverity("medium")}
                className={`px-2 py-0.5 rounded transition-colors ${filterSeverity === "medium" ? "bg-white/10 text-amber-300" : "text-slate-500 hover:text-slate-300"}`}
              >
                MED
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === currentIncident?.id;
              const isVerified = inc.status === "verified";

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`rounded-xl p-5 transition-all cursor-pointer border ${
                    isSelected
                      ? "metallic-surface border-white/20 shadow-lg"
                      : "metallic-card border-white/[0.06] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        inc.severity === "high"
                          ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                          : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="font-mono text-xs text-white font-medium">
                        Ref #{inc.id}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isVerified
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                        : inc.status === "approved"
                        ? "bg-slate-800 text-slate-200 border border-white/10"
                        : "bg-white/[0.04] text-slate-400"
                    }`}>
                      {inc.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-3 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>IP: {inc.source_ip}</span>
                    <span className="text-slate-500">{inc.events.length} telemetry hits</span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {inc.summary}
                  </p>

                  <div className="mt-4 flex items-center space-x-1.5">
                    {inc.rule_hits.map((rule) => (
                      <span key={rule} className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-white/5">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Incident Dossier (8 cols) */}
        {currentIncident ? (
          <div className="lg:col-span-8 space-y-8">
            {/* Sub-tab Navigation */}
            <div className="flex items-center justify-between hairline-b pb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveSubTab("dossier")}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeSubTab === "dossier"
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Incident Dossier & Response
                </button>
                <button
                  onClick={() => setActiveSubTab("telemetry")}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeSubTab === "telemetry"
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Raw Telemetry ({currentIncident.events.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("infrastructure")}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeSubTab === "infrastructure"
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Host Diagnostics
                </button>
              </div>

              {currentIncident.status === "verified" && (
                <button
                  onClick={() => setProofModalOpen(true)}
                  className="btn-metallic-secondary flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium text-emerald-300 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>View Caldera Proof</span>
                </button>
              )}
            </div>

            {/* TAB: DOSSIER */}
            {activeSubTab === "dossier" && (
              <div className="space-y-8">
                {/* Plain English Threat Synthesis */}
                <div className="metallic-surface rounded-xl p-8 space-y-3">
                  <div className="flex items-center justify-between pb-3 hairline-b">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                      <FileText className="h-3.5 w-3.5 text-slate-300" />
                      <span>Plain-English Threat Assessment</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Synthesis Engine (Contract #2)
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-normal leading-relaxed pt-1">
                    &ldquo;{currentIncident.summary}&rdquo;
                  </p>
                </div>

                {/* Two-Step Human Response Gate */}
                <div className="metallic-surface rounded-xl p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 hairline-b gap-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white flex items-center space-x-2">
                        <Lock className="h-3.5 w-3.5 text-slate-300" />
                        <span>Human-in-the-Loop Response Gate</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Dual-authorization required before committing host firewall changes on <span className="font-mono text-slate-200">192.168.56.10</span>.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="text-slate-500">GATE STATUS:</span>
                      <span className="font-semibold text-slate-200 uppercase">{currentIncident.status}</span>
                    </div>
                  </div>

                  {/* Two Response Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Step 1 */}
                    <div className="metallic-card rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">STEP 01</span>
                          <span className="text-xs font-medium text-white">Approve Containment</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Transitions status to <code>approved</code> and appends a cryptographically sealed audit row.
                        </p>
                      </div>

                      <button
                        onClick={handleApproveClick}
                        disabled={isApproving || currentIncident.status !== "new"}
                        className={`w-full py-2.5 rounded-lg text-xs font-medium transition-all ${
                          currentIncident.status !== "new"
                            ? "bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/5"
                            : "btn-metallic-primary cursor-pointer"
                        }`}
                      >
                        {isApproving ? "Authorizing..." : currentIncident.status !== "new" ? "Approved" : "Authorize Response"}
                      </button>
                    </div>

                    {/* Step 2 */}
                    <div className="metallic-card rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">STEP 02</span>
                          <span className="text-xs font-medium text-white">Commit Block & Caldera Verify</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Executes <code>sudo ufw deny</code> via Paramiko SSH and re-runs adversary profile via Caldera REST API.
                        </p>
                      </div>

                      <button
                        onClick={handleBlockClick}
                        disabled={isBlocking || currentIncident.status === "verified"}
                        className={`w-full py-2.5 rounded-lg text-xs font-medium transition-all ${
                          currentIncident.status === "verified"
                            ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 cursor-default"
                            : "btn-metallic-danger cursor-pointer"
                        }`}
                      >
                        {isBlocking
                          ? "Executing Block & Verify..."
                          : currentIncident.status === "verified"
                          ? "Verified Neutralized"
                          : "Execute Block & Verify (Caldera)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Graph and Chronological Timeline */}
                <EventGraphTimeline incident={currentIncident} />
              </div>
            )}

            {/* TAB: RAW TELEMETRY */}
            {activeSubTab === "telemetry" && (
              <div className="metallic-surface rounded-xl p-8 space-y-4">
                <div className="flex items-center justify-between pb-4 hairline-b">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300">
                    RAW LOG TELEMETRY FOR INCIDENT #{currentIncident.id}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    /var/log/auth.log & auditd
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="hairline-b text-slate-500 text-[11px]">
                        <th className="py-2.5 px-3">EVENT ID</th>
                        <th className="py-2.5 px-3">TYPE</th>
                        <th className="py-2.5 px-3">SOURCE IP</th>
                        <th className="py-2.5 px-3">USER</th>
                        <th className="py-2.5 px-3">RAW LINE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-slate-300">
                      {currentIncident.events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 text-slate-400">#{ev.id}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] border border-white/5">
                              {ev.event_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{ev.source_ip}</td>
                          <td className="py-2.5 px-3 text-slate-400">{ev.user || "—"}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-400 truncate max-w-md">
                            {ev.raw_line}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: HOST DIAGNOSTICS */}
            {activeSubTab === "infrastructure" && (
              <div className="metallic-surface rounded-xl p-8 space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 pb-4 hairline-b">
                  SEALED HOST-ONLY TESTBED TOPOLOGY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="metallic-card rounded-xl p-5 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-500">CONTROLLER INTERFACE</div>
                    <div className="text-base font-mono font-medium text-white">192.168.56.1</div>
                    <div className="text-xs text-slate-400">FastAPI SOC Daemon + Next.js</div>
                  </div>

                  <div className="metallic-card rounded-xl p-5 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-500">VICTIM VM (TARGET)</div>
                    <div className="text-base font-mono font-medium text-slate-200">192.168.56.10</div>
                    <div className="text-xs text-slate-400">sshd | auditd | ufw daemon</div>
                  </div>

                  <div className="metallic-card rounded-xl p-5 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-500">ATTACKER & VERIFIER</div>
                    <div className="text-base font-mono font-medium text-slate-200">192.168.56.20</div>
                    <div className="text-xs text-slate-400">Caldera Server + Sandcat Agent</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-16 text-center metallic-card rounded-2xl space-y-3">
            <CheckCircle2 className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-medium text-white">Zero Active Incidents</h3>
            <p className="text-xs text-slate-400">Simulate an attack to review correlation and response.</p>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {currentIncident && (
        <ProofModal
          isOpen={proofModalOpen}
          onClose={() => setProofModalOpen(false)}
          incidentId={currentIncident.id}
          attackerIp={currentIncident.source_ip || "192.168.56.20"}
        />
      )}
    </div>
  );
};

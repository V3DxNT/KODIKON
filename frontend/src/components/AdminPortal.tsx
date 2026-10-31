"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  Lock, 
  RefreshCw, 
  Activity, 
  Sliders, 
  Server, 
  FileText,
  AlertTriangle,
  Play,
  Check,
  Search,
  ExternalLink,
  Cpu
} from "lucide-react";
import { IncidentDetail, Role } from "@/types/soc";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-rose-950 px-2.5 py-0.5 text-xs font-mono text-rose-300 border border-rose-800">
              ADMINISTRATIVE CLEARANCE
            </span>
            <span className="text-xs text-slate-400 font-mono">X-Role: admin (Full Authority)</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>SOC Incident Command Center</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-normal">
              LIVE MONITORING
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time correlation graph, plain-English intelligence, SSH firewall containment & MITRE adversary verification.
          </p>
        </div>

        {/* Quick Diagnostics Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onTriggerReplay}
            disabled={isReplaying}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-950/80 to-red-900/60 px-4 py-2.5 text-xs font-semibold text-rose-200 border border-rose-500/30 hover:border-rose-400 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Flame className={`h-4 w-4 text-rose-400 ${isReplaying ? "animate-spin" : ""}`} />
            <span>{isReplaying ? "Replaying 8-Event Attack..." : "Replay Live Attack"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Incident List + Right Detail Dossier */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Incidents Ticker (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              ACTIVE INCIDENTS ({filteredIncidents.length})
            </span>
            {/* Filter pills */}
            <div className="flex items-center space-x-1 text-[11px] font-mono">
              <button
                onClick={() => setFilterSeverity("all")}
                className={`px-2 py-0.5 rounded ${filterSeverity === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilterSeverity("high")}
                className={`px-2 py-0.5 rounded ${filterSeverity === "high" ? "bg-rose-950 text-rose-300 border border-rose-800" : "text-slate-400 hover:text-white"}`}
              >
                HIGH
              </button>
              <button
                onClick={() => setFilterSeverity("medium")}
                className={`px-2 py-0.5 rounded ${filterSeverity === "medium" ? "bg-amber-950 text-amber-300 border border-amber-800" : "text-slate-400 hover:text-white"}`}
              >
                MED
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === currentIncident?.id;
              const isVerified = inc.status === "verified";
              const isApproved = inc.status === "approved" || inc.status === "blocked" || isVerified;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                      : "glass-card hover:bg-slate-900/60 hover:border-white/15"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-400"></span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                        inc.severity === "high"
                          ? "bg-rose-950 text-rose-300 border-rose-800"
                          : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="font-mono text-xs text-white font-bold">
                        Incident #{inc.id}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isVerified
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : inc.status === "approved"
                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {inc.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono text-cyan-300 flex items-center justify-between">
                    <span>IP: {inc.source_ip}</span>
                    <span className="text-slate-400">{inc.events.length} events</span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {inc.summary}
                  </p>

                  <div className="mt-3 flex items-center space-x-1">
                    {inc.rule_hits.map((rule) => (
                      <span key={rule} className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-white/10">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Incident Dossier & Controls (8 cols) */}
        {currentIncident ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Incident Subtab Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveSubTab("dossier")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSubTab === "dossier"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Attack Dossier & Response Gate
                </button>
                <button
                  onClick={() => setActiveSubTab("telemetry")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSubTab === "telemetry"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Raw Telemetry ({currentIncident.events.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("infrastructure")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSubTab === "infrastructure"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Node Diagnostics
                </button>
              </div>

              {currentIncident.status === "verified" && (
                <button
                  onClick={() => setProofModalOpen(true)}
                  className="flex items-center space-x-1.5 rounded-xl bg-emerald-950/80 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>View Caldera Proof</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: DOSSIER */}
            {activeSubTab === "dossier" && (
              <div className="space-y-6">
                {/* Plain English Synthesis Banner */}
                <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Plain-English Incident Intelligence</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Generated via LLM + Jinja2 Fallback
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-100 font-medium leading-relaxed">
                    &ldquo;{currentIncident.summary}&rdquo;
                  </p>
                </div>

                {/* The Two-Step Human Response Gate */}
                <div className="rounded-2xl glass-panel p-6 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-rose-400" />
                        <span>Human-in-the-Loop SOAR Response Gate</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Approval required before modifying production firewall on host <span className="font-mono text-cyan-400">192.168.56.10</span>.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="text-slate-400">STATUS:</span>
                      <span className="font-bold text-cyan-300 uppercase">{currentIncident.status}</span>
                    </div>
                  </div>

                  {/* Two Buttons */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Step 1: Approve Response */}
                    <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-mono text-blue-300 border border-blue-800">
                            STEP 1
                          </span>
                          <span className="text-xs font-bold text-white">Authorize Containment</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Moves incident status from <code>new</code> to <code>approved</code>. Writes cryptographic admin audit record.
                        </p>
                      </div>

                      <button
                        onClick={handleApproveClick}
                        disabled={isApproving || currentIncident.status !== "new"}
                        className={`mt-4 w-full flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                          currentIncident.status !== "new"
                            ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md cursor-pointer"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span>{isApproving ? "Authorizing..." : currentIncident.status !== "new" ? "Approved" : "Approve Incident Response"}</span>
                      </button>
                    </div>

                    {/* Step 2: Block & Verify */}
                    <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] font-mono text-rose-300 border border-rose-800">
                            STEP 2
                          </span>
                          <span className="text-xs font-bold text-white">Execute Block & Caldera Verify</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Connects via SSH Paramiko, applies <code>sudo ufw deny</code>, and triggers Caldera re-attack API to prove containment.
                        </p>
                      </div>

                      <button
                        onClick={handleBlockClick}
                        disabled={isBlocking || currentIncident.status === "verified"}
                        className={`mt-4 w-full flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                          currentIncident.status === "verified"
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 cursor-default"
                            : "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
                        }`}
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>
                          {isBlocking
                            ? "Executing SSH Block & Caldera..."
                            : currentIncident.status === "verified"
                            ? "Verified & Neutralized"
                            : "Execute Block & Verify (Caldera)"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Graph & Chronological Timeline */}
                <EventGraphTimeline incident={currentIncident} />
              </div>
            )}

            {/* TAB CONTENT: RAW TELEMETRY */}
            {activeSubTab === "telemetry" && (
              <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    RAW LOG TELEMETRY FOR INCIDENT #{currentIncident.id}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Source: /var/log/auth.log & auditd
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                        <th className="py-2 px-3">EVENT ID</th>
                        <th className="py-2 px-3">TYPE</th>
                        <th className="py-2 px-3">SOURCE IP</th>
                        <th className="py-2 px-3">USER</th>
                        <th className="py-2 px-3">RAW LINE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {currentIncident.events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-white/5">
                          <td className="py-2.5 px-3 text-cyan-400">#{ev.id}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 border border-white/10">
                              {ev.event_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{ev.source_ip}</td>
                          <td className="py-2.5 px-3">{ev.user || "—"}</td>
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

            {/* TAB CONTENT: INFRASTRUCTURE DIAGNOSTICS */}
            {activeSubTab === "infrastructure" && (
              <div className="space-y-4">
                <div className="rounded-2xl glass-panel p-6 border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono pb-3 border-b border-white/5">
                    SEALED HOST-ONLY TESTBED ARCHITECTURE
                  </h4>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
                      <div className="text-[10px] font-mono text-slate-400">CONTROLLER HOST</div>
                      <div className="text-base font-bold text-white mt-1">192.168.56.1</div>
                      <div className="text-xs text-slate-400 mt-1">FastAPI Backend + Next.js UI</div>
                    </div>

                    <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
                      <div className="text-[10px] font-mono text-slate-400">VICTIM VM (SSH + NGINX)</div>
                      <div className="text-base font-bold text-cyan-400 mt-1">192.168.56.10</div>
                      <div className="text-xs text-slate-400 mt-1">Target for sudo ufw deny</div>
                    </div>

                    <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
                      <div className="text-[10px] font-mono text-slate-400">ATTACKER / CALDERA</div>
                      <div className="text-base font-bold text-rose-400 mt-1">192.168.56.20</div>
                      <div className="text-xs text-slate-400 mt-1">Sandcat Agent + Port 8888 API</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-12 rounded-3xl glass-panel text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h3 className="mt-3 text-lg font-bold text-white">Zero Open Incidents</h3>
            <p className="text-xs text-slate-400 mt-1">
              Trigger a live attack replay to simulate log ingestion and correlation.
            </p>
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

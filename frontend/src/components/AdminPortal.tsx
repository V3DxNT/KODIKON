"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Lock, 
  FileText,
  Play,
  Shield,
  Activity,
  AlertTriangle
} from "lucide-react";
import { IncidentDetail, AuditLog } from "@/types/soc";
import { EventGraphTimeline } from "./EventGraphTimeline";
import { ProofModal } from "./ProofModal";
import { SecurityMetricsDashboard } from "./SecurityMetricsDashboard";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

interface AdminPortalProps {
  incidents: IncidentDetail[];
  auditLogs: AuditLog[];
  onApprove: (id: number) => Promise<void>;
  onBlock: (id: number) => Promise<void>;
  onTriggerReplay: () => Promise<void>;
  isReplaying: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  incidents,
  auditLogs,
  onApprove,
  onBlock,
  onTriggerReplay,
  isReplaying,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(incidents[0]?.id || 101);
  const [activeSubTab, setActiveSubTab] = useState<"dossier" | "telemetry" | "infrastructure" | "analytics">("dossier");
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

  // Calculate actual security metrics from live incident data
  const highSevCount = incidents.filter((i) => i.severity === "high").length;
  const verifiedCount = incidents.filter((i) => i.status === "verified").length;
  const totalEvents = incidents.reduce((acc, curr) => acc + (curr.events?.length || 0), 0);
  const uniqueRules = Array.from(new Set(incidents.flatMap((i) => i.rule_hits || [])));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Formal Admin Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-6">
        <div className="flex items-start space-x-4">
          <SentinelForgeLogo variant="symbol" size="lg" className="hidden sm:inline-flex mt-1" />
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                SENTINEL FORGE &bull; ADMIN CONSOLE
              </span>
              <span>&bull;</span>
              <span className="text-cyan-600 dark:text-cyan-400">Clearance: X-Role: admin</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Security Operations Command Center
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Correlated perimeter telemetry, human-in-the-loop response authorization, and adversary verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onTriggerReplay}
            disabled={isReplaying}
            className="btn-metallic-secondary flex items-center space-x-2 rounded-full px-4 py-2.5 text-xs font-mono text-[var(--text-primary)] cursor-pointer disabled:opacity-50 transition-all shadow-sm"
          >
            <Play className={`h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400 ${isReplaying ? "animate-spin" : ""}`} />
            <span>{isReplaying ? "Simulating Attack Telemetry..." : "Replay Inbound Attack"}</span>
          </button>
        </div>
      </div>

      {/* Balanced 4-Card Security Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metallic-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            <span>ACTIVE INCIDENTS</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {incidents.length}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-sans">
            <span className="text-rose-500 font-semibold">{highSevCount} High</span> &bull; {incidents.length - highSevCount} Medium
          </div>
        </div>

        <div className="metallic-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            <span>CALDERA PROOFS</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {verifiedCount} / {incidents.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium font-sans">
            Mathematical Block Verification
          </div>
        </div>

        <div className="metallic-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            <span>CORRELATED EVENTS</span>
            <Activity className="h-3.5 w-3.5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {totalEvents}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-sans">
            From raw auth.log & auditd
          </div>
        </div>

        <div className="metallic-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            <span>ACTIVE RULES</span>
            <Shield className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {uniqueRules.length || 3}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
            {uniqueRules.join(" · ") || "R-01 · R-02 · R-03"}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Incident Register + Right Incident Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Incident Register (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-primary)]">
              INCIDENT REGISTER ({filteredIncidents.length})
            </span>
            {/* Filter pills */}
            <div className="p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center space-x-1 text-[11px] font-mono">
              <button
                onClick={() => setFilterSeverity("all")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterSeverity === "all"
                    ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-bold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilterSeverity("high")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterSeverity === "high"
                    ? "bg-rose-500 text-white font-bold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-rose-500"
                }`}
              >
                HIGH
              </button>
              <button
                onClick={() => setFilterSeverity("medium")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterSeverity === "medium"
                    ? "bg-amber-500 text-white font-bold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-amber-500"
                }`}
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
                  className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[var(--bg-surface)] border-cyan-400/60 shadow-lg ring-1 ring-cyan-400/30"
                      : "metallic-card border-[var(--border-card)] hover:border-cyan-400/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        inc.severity === "high"
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40"
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
                        Ref #{inc.id}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                      isVerified
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40"
                        : inc.status === "approved"
                        ? "bg-sky-500/10 text-sky-600 border border-sky-500/30 dark:bg-slate-800 dark:text-slate-200"
                        : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                    }`}>
                      {inc.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-3 text-xs font-mono text-[var(--text-primary)] flex items-center justify-between">
                    <span className="font-semibold">IP: {inc.source_ip}</span>
                    <span className="text-[var(--text-muted)]">{inc.events.length} telemetry hits</span>
                  </div>

                  <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {inc.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {inc.rule_hits.map((rule) => (
                      <span
                        key={rule}
                        className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      >
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
          <div className="lg:col-span-8 space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-hairline)] gap-3">
              <div className="p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] inline-flex items-center space-x-1 overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveSubTab("dossier")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "dossier"
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-bold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Incident Dossier
                </button>
                <button
                  onClick={() => setActiveSubTab("analytics")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "analytics"
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-bold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Analytics & Metrics
                </button>
                <button
                  onClick={() => setActiveSubTab("telemetry")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "telemetry"
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-bold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Raw Telemetry ({currentIncident.events.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("infrastructure")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "infrastructure"
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-bold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Host Diagnostics
                </button>
              </div>

              {currentIncident.status === "verified" && (
                <button
                  onClick={() => setProofModalOpen(true)}
                  className="btn-premium-success flex items-center space-x-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>View Caldera Proof</span>
                </button>
              )}
            </div>

            {/* TAB: DOSSIER */}
            {activeSubTab === "dossier" && (
              <div className="space-y-6">
                {/* Threat Parameters Quick Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)]">
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">ATTACKER IP</div>
                    <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">
                      {currentIncident.source_ip}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">TARGET SYSTEM</div>
                    <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">
                      192.168.56.10:22 (SSH)
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">MITRE PROFILE</div>
                    <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                      T1110 &bull; Brute Force
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">STATUS GATE</div>
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">
                      {currentIncident.status}
                    </div>
                  </div>
                </div>

                {/* Plain English Threat Synthesis (Solid card) */}
                <div className="metallic-surface rounded-2xl p-6 sm:p-7 space-y-3 border border-[var(--border-card)]">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] flex items-center space-x-2 font-semibold">
                      <FileText className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Plain-English Threat Assessment</span>
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      Synthesis Engine (Contract #2)
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] font-normal leading-relaxed pt-1">
                    &ldquo;{currentIncident.summary}&rdquo;
                  </p>
                </div>

                {/* Multi-Stage Human Response Gate */}
                <div className="metallic-surface rounded-2xl p-6 sm:p-7 space-y-6 border border-[var(--border-card)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-hairline)] gap-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] flex items-center space-x-2 font-bold">
                        <Lock className="h-3.5 w-3.5 text-cyan-500" />
                        <span>Human-in-the-Loop Response Gate</span>
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Dual-authorization required before committing host firewall changes on{" "}
                        <span className="font-mono text-[var(--text-primary)] font-semibold">192.168.56.10</span>.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="text-[var(--text-muted)]">GATE STATUS:</span>
                      <span className="font-bold text-[var(--text-primary)] uppercase px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                        {currentIncident.status}
                      </span>
                    </div>
                  </div>

                  {/* 2-Step Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Step 1: Approve Containment */}
                    <div className="metallic-card rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-[var(--border-card)]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">STEP 01</span>
                          <span className="text-xs font-semibold text-[var(--text-primary)]">Approve Containment</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                          Transitions status to <code className="font-mono text-cyan-600 dark:text-cyan-400">approved</code> and records a cryptographically sealed audit row.
                        </p>
                      </div>

                      <button
                        onClick={handleApproveClick}
                        disabled={isApproving || currentIncident.status !== "new"}
                        className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          currentIncident.status !== "new"
                            ? "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                            : "btn-metallic-primary"
                        }`}
                      >
                        {isApproving ? "Authorizing..." : currentIncident.status !== "new" ? "Approved" : "Authorize Response"}
                      </button>
                    </div>

                    {/* Step 2: Commit Block & Caldera Verify */}
                    <div className="metallic-card rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-[var(--border-card)]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">STEP 02</span>
                          <span className="text-xs font-semibold text-[var(--text-primary)]">Commit Block & Caldera Verify</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                          Executes <code className="font-mono text-rose-600 dark:text-rose-400">sudo ufw deny</code> via Paramiko SSH and re-runs adversary profile via Caldera REST API.
                        </p>
                      </div>

                      <button
                        onClick={handleBlockClick}
                        disabled={isBlocking || currentIncident.status === "verified"}
                        className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          currentIncident.status === "verified"
                            ? "btn-premium-success cursor-default"
                            : "btn-metallic-danger"
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
              <div className="metallic-surface rounded-2xl p-6 sm:p-7 space-y-4 border border-[var(--border-card)]">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-bold">
                    RAW LOG TELEMETRY FOR INCIDENT #{currentIncident.id}
                  </h4>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    /var/log/auth.log & auditd
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px]">
                        <th className="py-2.5 px-3">EVENT ID</th>
                        <th className="py-2.5 px-3">TYPE</th>
                        <th className="py-2.5 px-3">SOURCE IP</th>
                        <th className="py-2.5 px-3">USER</th>
                        <th className="py-2.5 px-3">RAW LINE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-hairline)] text-[var(--text-secondary)]">
                      {currentIncident.events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                          <td className="py-2.5 px-3 text-[var(--text-muted)] font-semibold">#{ev.id}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium">
                              {ev.event_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[var(--text-primary)]">{ev.source_ip}</td>
                          <td className="py-2.5 px-3">{ev.user || "—"}</td>
                          <td className="py-2.5 px-3 text-[11px] text-[var(--text-secondary)] truncate max-w-md">
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
              <div className="metallic-surface rounded-2xl p-6 sm:p-7 space-y-6 border border-[var(--border-card)]">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-bold pb-3 border-b border-[var(--border-hairline)]">
                  SEALED HOST-ONLY TESTBED TOPOLOGY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="metallic-card rounded-2xl p-5 space-y-1.5 border border-[var(--border-card)]">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">CONTROLLER INTERFACE</div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)]">192.168.56.1</div>
                    <div className="text-xs text-[var(--text-secondary)]">FastAPI SOC Daemon + Next.js</div>
                  </div>

                  <div className="metallic-card rounded-2xl p-5 space-y-1.5 border border-[var(--border-card)]">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">VICTIM VM (TARGET)</div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)]">192.168.56.10</div>
                    <div className="text-xs text-[var(--text-secondary)]">sshd | auditd | ufw daemon</div>
                  </div>

                  <div className="metallic-card rounded-2xl p-5 space-y-1.5 border border-[var(--border-card)]">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">ATTACKER & VERIFIER</div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)]">192.168.56.20</div>
                    <div className="text-xs text-[var(--text-secondary)]">Caldera Server + Sandcat Agent</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECURITY ANALYTICS & METRICS DASHBOARD */}
            {activeSubTab === "analytics" && (
              <SecurityMetricsDashboard incidents={incidents} auditLogs={auditLogs} />
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-16 text-center metallic-card rounded-2xl space-y-3 border border-[var(--border-card)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--text-muted)] mx-auto" />
            <h3 className="text-base font-medium text-[var(--text-primary)]">Zero Active Incidents</h3>
            <p className="text-xs text-[var(--text-secondary)]">Simulate an attack to review correlation and response.</p>
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

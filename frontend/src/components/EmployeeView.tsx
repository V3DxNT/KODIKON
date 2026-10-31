"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Info, 
  UserX, 
  FileText, 
  ArrowRight,
  Download,
  CheckCircle,
  Flag,
  LogOut,
  Send,
  X
} from "lucide-react";
import { IncidentDetail } from "@/types/soc";
import { AuthUser } from "@/lib/auth-adapter";

interface EmployeeViewProps {
  incidents: IncidentDetail[];
  onAttemptBlock: (incidentId: number) => void;
  onSwitchToAdmin: () => void;
  onLogout?: () => void;
  staffUser?: AuthUser | null;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  incidents,
  onAttemptBlock,
  onSwitchToAdmin,
  onLogout,
  staffUser,
}) => {
  const [deniedModalOpen, setDeniedModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackTimestamp, setAckTimestamp] = useState<string | null>(null);
  const [tipCategory, setTipCategory] = useState("phishing");
  const [tipNotes, setTipNotes] = useState("");
  const [tipSubmitted, setTipSubmitted] = useState(false);

  const activeIncident = incidents[0];

  const handleActionClick = (id: number) => {
    setDeniedModalOpen(true);
    onAttemptBlock(id);
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setAckTimestamp(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const handleDownloadAdvisory = () => {
    if (!activeIncident) return;
    const content = [
      "==================================================",
      "PROJECT X — ORGANIZATIONAL SECURITY BRIEFING",
      "==================================================",
      `Date: ${new Date().toISOString()}`,
      `Advisory Reference: #${activeIncident.id}`,
      `Severity: ${activeIncident.severity.toUpperCase()}`,
      `Status: ${activeIncident.status.toUpperCase()}`,
      `Target Entity: ${activeIncident.source_ip || "External Perimeter"}`,
      "",
      "EXECUTIVE SUMMARY:",
      activeIncident.summary || "Suspicious automated activity intercepted at perimeter interface.",
      "",
      "POLICY NOTICE:",
      "Firewall isolation is role-gated and requires Administrator dual-authorization.",
      "Zero customer or proprietary data has been compromised.",
      "==================================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ProjectX_Security_Advisory_${activeIncident.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTipSubmitted(true);
    setTimeout(() => {
      setTipSubmitted(false);
      setReportModalOpen(false);
      setTipNotes("");
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              STAFF READ-ONLY FEED
            </span>
            <span>&bull;</span>
            <span className="text-cyan-600 dark:text-cyan-400">Authorization: Level 1 (Operations)</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Organizational Security Bulletin
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Real-time plain-language operational awareness for office managers, legal, and operational personnel.
          </p>
        </div>

        {/* User Session & Status Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full metallic-card border border-[var(--border-card)]">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                {staffUser ? staffUser.displayName : "Staff Session"}
              </div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">Perimeter Monitored</div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-metallic-secondary flex items-center space-x-1.5 rounded-full px-3.5 py-2 text-xs font-mono cursor-pointer"
              title="Log out of staff session"
            >
              <LogOut className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Action Utilities Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl metallic-card border border-[var(--border-card)]">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
          <Info className="h-4 w-4 text-cyan-500 shrink-0" />
          <span>General staff clearance active. Read-only advisory access.</span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setReportModalOpen(true)}
            className="btn-metallic-secondary flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-full cursor-pointer"
          >
            <Flag className="h-3 w-3 text-amber-500" />
            <span>Report Suspicious Event</span>
          </button>

          <button
            onClick={handleDownloadAdvisory}
            className="btn-metallic-secondary flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-full cursor-pointer"
          >
            <Download className="h-3 w-3 text-[var(--text-muted)]" />
            <span>Export Advisory (.txt)</span>
          </button>
        </div>
      </div>

      {/* Featured Plain-English Incident Briefing */}
      {activeIncident ? (
        <div className="metallic-surface rounded-2xl p-6 sm:p-8 space-y-6 border border-[var(--border-card)]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
            <div className="flex items-center space-x-3">
              <span className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                activeIncident.severity === "high"
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
              }`}>
                {activeIncident.severity.toUpperCase()} SEVERITY
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                Advisory Ref: #{activeIncident.id}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-[var(--text-muted)]">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(activeIncident.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} UTC</span>
              </div>
              {acknowledged && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] font-semibold">
                  <CheckCircle className="h-3 w-3" />
                  <span>Acknowledged {ackTimestamp}</span>
                </span>
              )}
            </div>
          </div>

          {/* Plain English Summary Callout */}
          <div className="metallic-card rounded-2xl p-6 sm:p-7 space-y-3 border border-[var(--border-card)]">
            <div className="text-xs font-mono tracking-widest uppercase text-[var(--text-muted)] flex items-center space-x-2 font-semibold">
              <FileText className="h-4 w-4 text-cyan-500" />
              <span>Executive Threat Summary</span>
            </div>
            <p className="text-base text-[var(--text-primary)] font-normal leading-relaxed">
              &ldquo;{activeIncident.summary || "Suspicious automated authentication activity was intercepted at the primary perimeter interface. The containment protocol is currently pending administrator authorization."}&rdquo;
            </p>
          </div>

          {/* 3-Column Explainer Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="metallic-card rounded-2xl p-5 space-y-2 border border-[var(--border-card)]">
              <span className="font-mono text-[var(--text-muted)] uppercase tracking-widest text-[10px] font-bold">OCCURRENCE</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                An unauthorized external IP address attempted systematic credential stuffing against the SSH daemon.
              </p>
            </div>
            <div className="metallic-card rounded-2xl p-5 space-y-2 border border-[var(--border-card)]">
              <span className="font-mono text-[var(--text-muted)] uppercase tracking-widest text-[10px] font-bold">CURRENT IMPACT</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Kernel audit telemetry actively traced the entry point. Zero customer data or internal assets were exfiltrated.
              </p>
            </div>
            <div className="metallic-card rounded-2xl p-5 space-y-2 border border-[var(--border-card)]">
              <span className="font-mono text-[var(--text-muted)] uppercase tracking-widest text-[10px] font-bold">REQUIRED ACTION</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Security Administration will authenticate, commit the permanent firewall isolation, and run verification.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
              <Lock className="h-3.5 w-3.5 text-cyan-500" />
              <span>Firewall modification is role-gated</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!acknowledged ? (
                <button
                  onClick={handleAcknowledge}
                  className="btn-metallic-secondary rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Acknowledge Briefing
                </button>
              ) : (
                <button
                  disabled
                  className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 cursor-default"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Briefing Acknowledged</span>
                </button>
              )}

              <button
                onClick={() => handleActionClick(activeIncident.id)}
                className="btn-metallic-danger rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer"
              >
                Execute Firewall Block
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="btn-metallic-primary rounded-full px-5 py-2.5 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Switch to Admin View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="metallic-card rounded-2xl p-16 text-center space-y-3 border border-[var(--border-card)]">
          <ShieldCheck className="h-8 w-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-medium text-[var(--text-primary)]">All Monitored Interfaces Secure</h3>
          <p className="text-xs text-[var(--text-secondary)]">No active security advisories requiring attention.</p>
        </div>
      )}

      {/* Formal 403 Forbidden Modal */}
      {deniedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 space-y-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500">
              <UserX className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              HTTP 403 — Privileged Role Required
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Execution denied by backend policy dependency. Enacting firewall drops (<code className="font-mono text-rose-500">sudo ufw deny</code>) 
              is restricted exclusively to certified Administrators.
            </p>

            <div className="rounded-xl bg-[var(--bg-terminal)] p-3 font-mono text-[11px] text-[var(--text-muted)] border border-[var(--border-hairline)]">
              <code>Header sent: X-Role: receptionist &rarr; 403 Forbidden</code>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeniedModalOpen(false)}
                className="btn-metallic-secondary rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setDeniedModalOpen(false);
                  onSwitchToAdmin();
                }}
                className="btn-metallic-primary rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Authenticate Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Report Suspicious Event Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 space-y-5 relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-2xl">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-full cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500">
                <Flag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Report Security Anomaly</h3>
                <p className="text-xs text-[var(--text-secondary)]">Transmit internal observation to SOC analysts</p>
              </div>
            </div>

            {tipSubmitted ? (
              <div className="rounded-2xl bg-emerald-500/10 p-6 text-center border border-emerald-500/30 space-y-2">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Report Received</h4>
                <p className="text-xs text-[var(--text-secondary)]">Dispatched to SOC queue with high priority.</p>
              </div>
            ) : (
              <form onSubmit={handleTipSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-primary)]">INCIDENT CATEGORY</label>
                  <select
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value)}
                    className="w-full rounded-xl bg-[var(--bg-input)] px-4 py-2.5 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-input)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="phishing">Suspicious Email / Phishing Attempt</option>
                    <option value="badge">Door / Badge Reader Anomaly</option>
                    <option value="terminal">Unusual Computer Prompt / Pop-up</option>
                    <option value="wifi">Rogue Wi-Fi Network Detected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-primary)]">OBSERVATION DETAILS</label>
                  <textarea
                    rows={3}
                    value={tipNotes}
                    onChange={(e) => setTipNotes(e.target.value)}
                    placeholder="Describe what you observed, affected workstation, or sender address..."
                    required
                    className="w-full rounded-xl bg-[var(--bg-input)] p-3 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-input)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="btn-metallic-secondary rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-metallic-primary rounded-full px-4 py-2 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="h-3 w-3" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Info, 
  UserX, 
  FileText, 
  HelpCircle,
  ShieldAlert
} from "lucide-react";
import { IncidentDetail, Role } from "@/types/soc";

interface EmployeeViewProps {
  incidents: IncidentDetail[];
  onAttemptBlock: (incidentId: number) => void;
  onSwitchToAdmin: () => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  incidents,
  onAttemptBlock,
  onSwitchToAdmin,
}) => {
  const [deniedModalOpen, setDeniedModalOpen] = useState(false);
  const activeIncident = incidents[0];

  const handleActionClick = (id: number) => {
    // Show 403 Forbidden feedback specifically designed for the receptionist demo
    setDeniedModalOpen(true);
    onAttemptBlock(id);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-mono text-cyan-300 border border-cyan-800">
              STAFF PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono">Role: Receptionist (Read-Only)</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white tracking-tight">
            Company Security Bulletin
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Plain-English security awareness feed for office managers and non-technical staff.
          </p>
        </div>

        <div className="flex items-center space-x-3 rounded-2xl glass-panel px-4 py-3 border border-emerald-500/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">DEFENSE POSTURE</div>
            <div className="text-xs text-slate-300">Automated Monitoring Active</div>
          </div>
        </div>
      </div>

      {/* Access Control Notice */}
      <div className="mt-6 rounded-2xl bg-slate-900/40 p-4 border border-white/5 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Role-Gated Security Policy:</strong> You are browsing with standard employee privileges. 
          You can review company incident advisories, but destructive firewall changes (`sudo ufw deny`) require an authenticated 
          Security Administrator.
        </div>
      </div>

      {/* Featured Plain-English Incident Briefing */}
      {activeIncident ? (
        <div className="mt-8 rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeIncident.severity === "high"
                  ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                  : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
              }`}>
                {activeIncident.severity} Advisory
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Incident #{activeIncident.id}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{new Date(activeIncident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Plain English Summary Callout */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Plain-English Incident Intelligence</span>
            </div>
            <p className="mt-3 text-base text-slate-100 font-medium leading-relaxed">
              &ldquo;{activeIncident.summary || "Suspicious automated login attempts were detected from an unknown external address. The automated firewall defense has been prepared for administrator authorization."}&rdquo;
            </p>
          </div>

          {/* Staff Explainer Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
              <span className="text-slate-400 font-mono">WHAT HAPPENED?</span>
              <p className="mt-1.5 text-slate-200">
                An outside computer tried dozens of passwords to break into the main server.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
              <span className="text-slate-400 font-mono">ARE WE IMPACTED?</span>
              <p className="mt-1.5 text-slate-200">
                Telemetry recorded the intrusion path. Zero company files were exfiltrated.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
              <span className="text-slate-400 font-mono">RECOMMENDED ACTION</span>
              <p className="mt-1.5 text-slate-200">
                Notify the IT Admin to approve the firewall block and run verification.
              </p>
            </div>
          </div>

          {/* Actions Bar with Disabled/Gated Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Firewall isolation requires admin credentials</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleActionClick(activeIncident.id)}
                className="flex items-center space-x-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 border border-white/10 hover:border-rose-500/40 hover:text-rose-300 transition-all cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>Execute Firewall Block</span>
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="flex items-center space-x-1.5 rounded-xl bg-cyan-600/20 px-4 py-2.5 text-xs font-semibold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all"
              >
                <span>Switch to Admin Mode &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-12 text-center py-12 rounded-3xl glass-panel">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="mt-3 text-lg font-bold text-white">All Systems Normal</h3>
          <p className="text-xs text-slate-400 mt-1">No security incidents are currently pending employee review.</p>
        </div>
      )}

      {/* 403 Forbidden Role Denial Modal */}
      {deniedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0d111a] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-500/30">
              <UserX className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              HTTP 403 — Admin Role Required
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Action rejected by backend policy. Modifying Linux firewall rules (`sudo ufw deny`) 
              and triggering MITRE adversary emulation is restricted exclusively to certified Administrators.
            </p>

            <div className="mt-4 rounded-xl bg-black/60 p-3 font-mono text-[11px] text-rose-300 border border-rose-900/40">
              <code>Header sent: X-Role: receptionist &rarr; 403 Forbidden</code>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeniedModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setDeniedModalOpen(false);
                  onSwitchToAdmin();
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                Authenticate as Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

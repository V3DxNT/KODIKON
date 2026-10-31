"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Info, 
  UserX, 
  FileText,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { IncidentDetail } from "@/types/soc";

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
    setDeniedModalOpen(true);
    onAttemptBlock(id);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 space-y-10">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 hairline-b gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="uppercase tracking-widest text-slate-300">STAFF READ-ONLY FEED</span>
            <span>&bull;</span>
            <span>Authorization: Receptionist Level</span>
          </div>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">
            Organizational Security Bulletin
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Real-time plain-language operational awareness for office managers, legal, and operational staff.
          </p>
        </div>

        <div className="flex items-center space-x-3.5 px-4 py-3 rounded-xl metallic-card">
          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">PERIMETER STATUS</div>
            <div className="text-xs font-medium text-slate-200">Active Monitoring</div>
          </div>
        </div>
      </div>

      {/* Institutional Notice */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3.5 text-xs text-slate-400 leading-relaxed">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Policy Notification:</strong> You are viewing with general staff clearance. 
          Modifying network perimeter firewalls (<code>sudo ufw deny</code>) or triggering adversary re-tests requires dual-authorization 
          from an authenticated Security Administrator.
        </div>
      </div>

      {/* Featured Plain-English Incident Briefing */}
      {activeIncident ? (
        <div className="metallic-surface rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 hairline-b">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/10 px-3 py-1 rounded-md border border-white/10">
                {activeIncident.severity.toUpperCase()} SEVERITY
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Advisory Ref: #{activeIncident.id}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{new Date(activeIncident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
            </div>
          </div>

          {/* Plain English Summary Callout */}
          <div className="metallic-card rounded-xl p-6 sm:p-8 space-y-3">
            <div className="text-xs font-mono tracking-widest uppercase text-slate-400 flex items-center space-x-2">
              <FileText className="h-4 w-4 text-slate-300" />
              <span>Executive Threat Summary</span>
            </div>
            <p className="text-base text-slate-100 font-normal leading-relaxed">
              &ldquo;{activeIncident.summary || "Suspicious automated authentication activity was intercepted at the primary perimeter interface. The containment protocol is currently pending administrator authorization."}&rdquo;
            </p>
          </div>

          {/* 3-Column Explainer Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="metallic-card rounded-xl p-5 space-y-2">
              <span className="font-mono text-slate-500 uppercase tracking-widest text-[10px]">OCCURRENCE</span>
              <p className="text-slate-300 leading-relaxed">
                An unauthorized external IP address attempted systematic credential stuffing against the SSH daemon.
              </p>
            </div>
            <div className="metallic-card rounded-xl p-5 space-y-2">
              <span className="font-mono text-slate-500 uppercase tracking-widest text-[10px]">CURRENT IMPACT</span>
              <p className="text-slate-300 leading-relaxed">
                Kernel audit telemetry actively traced the entry point. Zero customer data or internal assets were exfiltrated.
              </p>
            </div>
            <div className="metallic-card rounded-xl p-5 space-y-2">
              <span className="font-mono text-slate-500 uppercase tracking-widest text-[10px]">REQUIRED ACTION</span>
              <p className="text-slate-300 leading-relaxed">
                Security Administration will authenticate, commit the permanent firewall isolation, and run verification.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 hairline-t flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Firewall modification is role-gated</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleActionClick(activeIncident.id)}
                className="btn-metallic-danger rounded-lg px-4 py-2.5 text-xs font-medium cursor-pointer"
              >
                Execute Firewall Block
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="btn-metallic-primary rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Switch to Admin View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="metallic-card rounded-2xl p-16 text-center space-y-3">
          <ShieldCheck className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-medium text-white">All Monitored Interfaces Secure</h3>
          <p className="text-xs text-slate-400">No active security advisories requiring attention.</p>
        </div>
      )}

      {/* Formal 403 Forbidden Modal */}
      {deniedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md metallic-surface rounded-2xl p-8 border border-white/10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <UserX className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium text-white">
              HTTP 403 — Privileged Role Required
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execution denied by backend policy dependency. Enacting firewall drops (<code>sudo ufw deny</code>) 
              is restricted exclusively to certified Administrators.
            </p>

            <div className="rounded-lg bg-black/60 p-3 font-mono text-[11px] text-slate-400 border border-white/5">
              <code>Header sent: X-Role: receptionist &rarr; 403 Forbidden</code>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeniedModalOpen(false)}
                className="btn-metallic-secondary rounded-lg px-4 py-2 text-xs font-medium cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setDeniedModalOpen(false);
                  onSwitchToAdmin();
                }}
                className="btn-metallic-primary rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Authenticate Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

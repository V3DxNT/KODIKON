"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPortal } from "@/components/AdminPortal";
import { 
  fetchIncidents, 
  fetchIncident, 
  approveIncident, 
  blockIncident, 
  fetchAuditLogs, 
  triggerReplaySimulation 
} from "@/lib/api";
import { IncidentDetail, AuditLog } from "@/types/soc";
import { useAuth } from "@/context/AuthContext";
import mockData from "@/mocks/incident.json";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { Glass } from "@/components/Glass";

export default function AdminPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [incidents, setIncidents] = useState<IncidentDetail[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const summaries = await fetchIncidents();
      const details = await Promise.all(
        summaries.map(async (s) => {
          const d = await fetchIncident(s.id);
          return d || {
            id: s.id,
            created_at: s.created_at,
            status: s.status,
            severity: s.severity,
            summary: s.summary,
            rule_hits: s.rule_hits,
            source_ip: s.source_ip,
            events: [],
          };
        })
      );
      setIncidents(details);

      const audits = await fetchAuditLogs();
      setAuditLogs(audits);
    } catch {
      setIncidents(mockData.incidents as unknown as IncidentDetail[]);
      setAuditLogs(mockData.audit as unknown as AuditLog[]);
    }
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (active) {
        await loadData();
      }
    };
    void run();
    const interval = setInterval(() => {
      void run();
    }, 2500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await approveIncident(id, "admin");
      showToast(res.detail || `Incident #${id} authorized by Admin`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve incident";
      showToast(msg);
      throw err;
    }
  };

  const handleBlock = async (id: number) => {
    try {
      const res = await blockIncident(id, "admin");
      showToast(res.detail || `Firewall block applied & Caldera confirmed!`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute block";
      showToast(msg);
      throw err;
    }
  };

  const handleTriggerReplay = async () => {
    setIsReplaying(true);
    try {
      await triggerReplaySimulation();
      showToast("Attack sequence ingested into daemon!");
      await loadData();
    } catch {
      showToast("Simulation trigger failed");
    } finally {
      setIsReplaying(false);
    }
  };

  // In demo presentation mode, allow direct access so the full console is immediately visible
  // Only show the restriction if explicitly logged in under an employee-only session
  if (role === "employee") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <Glass radius={24} blur={24} intensity={0.85} className="max-w-md w-full p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 shadow-inner">
            <Lock className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              RESTRICTED CONSOLE
            </div>
            <h2 className="text-xl font-medium text-white mt-1">
              Admin Authentication Required
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are currently authenticated in Staff Advisory mode. Please authenticate as Administrator to commit response actions.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => router.push("/staff")}
              className="btn-metallic-secondary rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Return to Staff Feed
            </button>
            <button
              onClick={() => router.push("/login?redirect=/admin")}
              className="btn-metallic-primary rounded-full px-6 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <span>Authenticate Admin</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Glass>
      </div>
    );
  }

  return (
    <div>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Glass radius={12} blur={20} intensity={0.9} className="flex items-center space-x-2.5 px-5 py-3 text-xs font-mono text-slate-200 shadow-xl animate-in slide-in-from-bottom-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </Glass>
        </div>
      )}

      <AdminPortal
        incidents={incidents}
        auditLogs={auditLogs}
        onApprove={handleApprove}
        onBlock={handleBlock}
        onTriggerReplay={handleTriggerReplay}
        isReplaying={isReplaying}
      />
    </div>
  );
}

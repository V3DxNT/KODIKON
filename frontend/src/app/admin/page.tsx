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

  // If in employee role, show formal access gate
  if (role !== "admin") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full metallic-surface rounded-2xl p-8 sm:p-10 border border-white/15 text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
            <Lock className="h-6 w-6" />
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
            The Incident Command Center contains active response capabilities. Please verify administrator identity to proceed.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => router.push("/staff")}
              className="btn-metallic-secondary rounded-lg px-4 py-2.5 text-xs font-medium cursor-pointer"
            >
              Return to Staff Feed
            </button>
            <button
              onClick={() => router.push("/login?redirect=/admin")}
              className="btn-metallic-primary rounded-lg px-5 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <span>Authenticate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
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

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThreatHuntingDashboard } from "@/components/ThreatHuntingDashboard";
import { AdminPortal } from "@/components/AdminPortal";
import { 
  fetchIncidents, 
  fetchIncident, 
  approveIncident, 
  blockIncident, 
  fetchAuditLogs,
  resetDatabase
} from "@/lib/api";
import { IncidentDetail, AuditLog } from "@/types/soc";
import { useAuth } from "@/context/AuthContext";
import { Lock, ArrowRight, SlidersHorizontal, LayoutDashboard, RefreshCw, Trash2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [incidents, setIncidents] = useState<IncidentDetail[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"threat_hunting" | "extended_console">("threat_hunting");

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
    } catch (err) {
      console.warn("Failed to query live daemon data:", err);
      setIncidents([]);
      setAuditLogs([]);
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
      showToast(res.detail || `Firewall block applied on VM & Caldera confirmed!`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute block";
      showToast(msg);
      throw err;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      showToast("Live telemetry refreshed from SOC daemon");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm("Reset database? This will clear all incidents, events, and audit logs to zero.")) {
      return;
    }
    setIsRefreshing(true);
    try {
      await resetDatabase();
      setIncidents([]);
      setAuditLogs([]);
      showToast("Database reset: All telemetry events, incidents, and audit logs cleared");
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset database";
      showToast(msg);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show the restriction if explicitly logged in under an employee-only session
  if (role === "employee") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F7]">
        <div className="max-w-md w-full p-8 sm:p-10 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              RESTRICTED CONSOLE
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Admin Authentication Required
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            You are currently authenticated in Staff Advisory mode. Please authenticate as Administrator to commit response actions.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => router.push("/staff")}
              className="h-8 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all"
            >
              Return to Staff Feed
            </button>
            <button
              onClick={() => router.push("/login?redirect=/admin")}
              className="h-8 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-medium flex items-center space-x-2 cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all"
            >
              <span>Authenticate Admin</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans antialiased selection:bg-blue-500/20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-sans text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-3">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* View Switcher Top Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span>Admin Portal</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">
            {viewMode === "threat_hunting" ? "Threat Hunting Dashboard" : "Extended Operations Console"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDb}
            disabled={isRefreshing}
            className="h-8 px-2.5 sm:px-3 rounded-lg border border-rose-200/90 bg-white hover:bg-rose-50 text-xs font-medium text-rose-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
            title="Reset Database & Clear All Telemetry"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
            title="Refresh telemetry from backend"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === "threat_hunting" ? "extended_console" : "threat_hunting")}
            className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all cursor-pointer flex items-center space-x-1.5"
            title="Toggle between Threat Hunting Dashboard and Extended Operations Console"
          >
            {viewMode === "threat_hunting" ? (
              <>
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">Switch to Extended Console</span>
                <span className="sm:hidden">Extended</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
                <span>Return to Threat Hunting</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === "threat_hunting" ? (
        <ThreatHuntingDashboard
          incidents={incidents}
          auditLogs={auditLogs}
          onApprove={handleApprove}
          onBlock={handleBlock}
          onRefresh={handleRefresh}
          onResetDb={handleResetDb}
        />
      ) : (
        <div className="max-w-[1440px] mx-auto p-3 sm:p-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <AdminPortal
              incidents={incidents}
              auditLogs={auditLogs}
              onApprove={handleApprove}
              onBlock={handleBlock}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      )}
    </div>
  );
}

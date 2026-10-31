"use client";

import React, { useState, useEffect } from "react";
import { RoleNavbar } from "@/components/RoleNavbar";
import { HeroSection } from "@/components/HeroSection";
import { EmployeeView } from "@/components/EmployeeView";
import { AdminPortal } from "@/components/AdminPortal";
import { AuditLedgerView } from "@/components/AuditLedgerView";
import { ArchitectureView } from "@/components/ArchitectureView";
import { 
  fetchIncidents, 
  fetchIncident, 
  approveIncident, 
  blockIncident, 
  fetchAuditLogs, 
  triggerReplaySimulation 
} from "@/lib/api";
import { IncidentDetail, AuditLog, Role } from "@/types/soc";
import mockData from "@/mocks/incident.json";

export default function Home() {
  const [currentRole, setCurrentRole] = useState<Role>("admin");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [incidents, setIncidents] = useState<IncidentDetail[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const summaries = await fetchIncidents();
      // Fetch full details for each incident
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

      // Check if backend was connected or using fallback
      try {
        const res = await fetch("http://127.0.0.1:8000/health", { cache: "no-store" });
        setIsBackendConnected(res.ok);
      } catch {
        setIsBackendConnected(false);
      }
    } catch {
      // Use mock
      setIncidents(mockData.incidents as unknown as IncidentDetail[]);
      setAuditLogs(mockData.audit as unknown as AuditLog[]);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await approveIncident(id, currentRole);
      showToast(res.detail || `Incident #${id} authorized by Admin`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to approve incident");
      throw err;
    }
  };

  const handleBlock = async (id: number) => {
    try {
      const res = await blockIncident(id, currentRole);
      showToast(res.detail || `Firewall block applied & Caldera confirmed!`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to execute block");
      throw err;
    }
  };

  const handleTriggerReplay = async () => {
    setIsReplaying(true);
    try {
      await triggerReplaySimulation();
      showToast("Attack sequence replayed into ingestion pipeline!");
      await loadData();
      if (activeTab === "overview") {
        setActiveTab("portal");
      }
    } catch {
      showToast("Replay failed");
    } finally {
      setIsReplaying(false);
    }
  };

  const handleEnterPortal = (role: Role) => {
    setCurrentRole(role);
    setActiveTab("portal");
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl border border-cyan-500/40 bg-[#0b0f19]/95 px-5 py-3 text-xs font-mono text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-md animate-in slide-in-from-bottom-5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <RoleNavbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {activeTab === "overview" && (
          <HeroSection
            onEnterPortal={handleEnterPortal}
            onTriggerReplay={handleTriggerReplay}
            isReplaying={isReplaying}
          />
        )}

        {activeTab === "portal" && currentRole === "employee" && (
          <EmployeeView
            incidents={incidents}
            onAttemptBlock={handleBlock}
            onSwitchToAdmin={() => setCurrentRole("admin")}
          />
        )}

        {activeTab === "portal" && currentRole === "admin" && (
          <AdminPortal
            incidents={incidents}
            onApprove={handleApprove}
            onBlock={handleBlock}
            onTriggerReplay={handleTriggerReplay}
            isReplaying={isReplaying}
          />
        )}

        {activeTab === "audit" && <AuditLedgerView logs={auditLogs} />}

        {activeTab === "architecture" && <ArchitectureView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#030407] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project X &mdash; Single-Box SOC for Small Enterprise</span>
          <span>MITRE ATT&CK T1110 / T1136 / T1041 &bull; Caldera Verified</span>
        </div>
      </footer>
    </div>
  );
}

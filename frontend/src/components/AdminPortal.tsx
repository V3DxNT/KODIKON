"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  ShieldCheck,
  Shield,
  Layers,
  Crosshair,
  FileText,
  ClipboardCheck,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Calendar,
  CheckCircle2,
  XCircle,
  Info,
  Check,
  Minus,
  Download,
  ExternalLink,
  LogOut,
  RefreshCw,
  MoreHorizontal,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { IncidentDetail, AuditLog } from "@/types/soc";
import { EventGraphTimeline } from "./EventGraphTimeline";
import { ProofModal } from "./ProofModal";
import { SentinelForgeLogo } from "./SentinelForgeLogo";
import { ThreatHuntingDashboard } from "./ThreatHuntingDashboard";
import { useAuth } from "@/context/AuthContext";

interface AdminPortalProps {
  incidents: IncidentDetail[];
  auditLogs: AuditLog[];
  onApprove: (id: number) => Promise<void>;
  onBlock: (id: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

type TabType =
  | "dashboard"
  | "incidents"
  | "response"
  | "threats"
  | "assets"
  | "detections"
  | "logs"
  | "audit"
  | "reports"
  | "users"
  | "settings";

export const AdminPortal: React.FC<AdminPortalProps> = ({
  incidents,
  auditLogs,
  onApprove,
  onBlock,
  onRefresh,
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  // Active top-level navigation tab
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(
    incidents[0]?.id || 101
  );

  // Global search input
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Incidents list filters
  const [incidentSearch, setIncidentSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [openRowActionId, setOpenRowActionId] = useState<number | null>(null);

  // Response execution state
  const [isBlocking, setIsBlocking] = useState(false);
  const [isRetestingCaldera, setIsRetestingCaldera] = useState(false);

  // Detection rules state
  const [rules, setRules] = useState([
    {
      id: "R1",
      name: "R1 - SSH Brute Force",
      technique: "T1110 – Brute Force",
      threshold: 5,
      window: 60,
      enabled: true,
      active: true,
    },
    {
      id: "R2",
      name: "R2 - Suspicious Account Creation",
      technique: "T1136 – Create Account",
      threshold: 1,
      window: 300,
      enabled: true,
      active: true,
    },
    {
      id: "R3",
      name: "R3 - Suspicious Outbound Activity",
      technique: "T1041 – Exfiltration Over C2 Channel",
      threshold: 1,
      window: 120,
      enabled: true,
      active: true,
    },
  ]);

  // Audit trail state
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("all");
  const [auditUserFilter, setAuditUserFilter] = useState("all");
  const [auditResultFilter, setAuditResultFilter] = useState("all");

  // Users & Roles state
  const [usersList, setUsersList] = useState([
    { username: "admin", email: "admin@projectx.local", role: "Administrator", status: "Active" },
    { username: "analyst", email: "analyst@projectx.local", role: "Analyst", status: "Active" },
    { username: "viewer", email: "viewer@projectx.local", role: "Viewer", status: "Active" },
  ]);
  const [newUsername, setNewUsername] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Analyst");

  // General Settings state
  const [orgName, setOrgName] = useState("Project X SOC");
  const [orgTimezone, setOrgTimezone] = useState("UTC");
  const [retentionDays, setRetentionDays] = useState(90);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  // Currently focused incident
  const currentIncident =
    incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Filtered incidents for Image 2
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        if (severityFilter !== "all" && inc.severity !== severityFilter) return false;
        if (statusFilter !== "all" && inc.status !== statusFilter) return false;
        if (incidentSearch.trim()) {
          const q = incidentSearch.toLowerCase();
          const matchId = `inc-${inc.id}`.toLowerCase().includes(q) || String(inc.id).includes(q);
          const matchIp = inc.source_ip?.toLowerCase().includes(q) ?? false;
          const matchSummary = inc.summary?.toLowerCase().includes(q) ?? false;
          const matchRule = inc.rule_hits.some((r) => r.toLowerCase().includes(q));
          if (!matchId && !matchIp && !matchSummary && !matchRule) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return b.id - a.id;
        return a.id - b.id;
      });
  }, [incidents, severityFilter, statusFilter, incidentSearch, sortOrder]);

  // Derived metrics for Dashboard
  const openIncidentsCount = incidents.filter((i) => i.status === "new").length;
  const criticalIncidentsCount = incidents.filter((i) => i.severity === "high").length;
  const resolvedIncidentsCount = incidents.filter((i) => i.status === "verified" || i.status === "blocked").length;
  const monitoredAssetsCount = 2; // Ubuntu Server (192.168.56.10) & Attacker VM (192.168.56.20)

  // Handlers for Response Actions
  const handleBlockClick = async () => {
    if (!currentIncident) return;
    setIsBlocking(true);
    try {
      await onBlock(currentIncident.id);
      showToast(`Firewall rule committed. MITRE Caldera verification proof successful!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Firewall block failed";
      showToast(msg);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleRetestCaldera = async () => {
    if (!currentIncident) return;
    setIsRetestingCaldera(true);
    try {
      if (onRefresh) await onRefresh();
      showToast("Adversary re-test telemetry refreshed. Proving traffic containment.");
    } finally {
      setIsRetestingCaldera(false);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newUserEmail.trim()) return;
    setUsersList((prev) => [
      ...prev,
      { username: newUsername, email: newUserEmail, role: newUserRole, status: "Active" },
    ]);
    setNewUsername("");
    setNewUserEmail("");
    showToast(`User ${newUsername} added with ${newUserRole} role.`);
  };

  const handleExportAudit = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Timestamp,User,Action,Target,Result"]
        .concat(
          auditLogs.map(
            (a) => `${a.ts},${a.actor_role},${a.action},${a.target},${a.result}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-trail-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Audit trail exported successfully.");
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-cyan-500/20 relative">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-xl metallic-surface px-5 py-3 text-xs font-mono text-[var(--text-primary)] shadow-2xl border border-white/20 animate-in slide-in-from-bottom-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (Styled to match website's dark metallic glass theme)
         ───────────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-hairline)] flex flex-col justify-between select-none z-10">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-5 border-b border-[var(--border-hairline)]">
            <Link href="/" className="flex items-center space-x-2 group cursor-pointer" title="SENTINEL FORGE">
              <SentinelForgeLogo variant="horizontal" size="sm" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutDashboard className={`h-4 w-4 ${activeTab === "dashboard" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("incidents")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "incidents"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${activeTab === "incidents" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Incidents</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-[var(--text-secondary)] border border-white/5 font-semibold">
                {incidents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("response")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "response"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <ShieldCheck className={`h-4 w-4 ${activeTab === "response" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Response</span>
            </button>

            <button
              onClick={() => setActiveTab("threats")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "threats"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <Shield className={`h-4 w-4 ${activeTab === "threats" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Threats</span>
            </button>

            <button
              onClick={() => setActiveTab("assets")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "assets"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <Layers className={`h-4 w-4 ${activeTab === "assets" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Assets</span>
            </button>

            <button
              onClick={() => setActiveTab("detections")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "detections"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <Crosshair className={`h-4 w-4 ${activeTab === "detections" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Detections</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <FileText className={`h-4 w-4 ${activeTab === "logs" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <ClipboardCheck className={`h-4 w-4 ${activeTab === "audit" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "reports"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "reports" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <Users className={`h-4 w-4 ${activeTab === "users" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Users & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
              }`}
            >
              <Settings className={`h-4 w-4 ${activeTab === "settings" ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Utility */}
        <div className="p-4 border-t border-[var(--border-hairline)] space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Landing</span>
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">/</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT MAIN CONTENT AREA
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-hairline)] px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Global Search Input */}
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search incidents, IPs, or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Right Header Badges & User Profile */}
          <div className="flex items-center space-x-4">
            {/* Telemetry Refresh */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Refresh live telemetry from daemon"
                className="hidden sm:flex items-center space-x-2 btn-metallic-secondary h-8 px-3 rounded-lg text-xs font-medium cursor-pointer"
              >
                <RefreshCw className="h-3 w-3 text-blue-600" />
                <span>Refresh Telemetry</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05] transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {incidents.some((i) => i.status === "new") && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-surface)]"></span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl metallic-surface border border-white/15 shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-semibold text-white">Security Alerts</span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      {incidents.filter((i) => i.status === "new").length} Unresolved
                    </span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {incidents.filter((i) => i.status === "new").length > 0 ? (
                      incidents
                        .filter((i) => i.status === "new")
                        .map((inc) => (
                          <div
                            key={inc.id}
                            onClick={() => {
                              setSelectedIncidentId(inc.id);
                              setActiveTab("response");
                              setNotificationOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer space-y-1 transition-colors border border-transparent hover:border-white/10"
                          >
                            <div className="font-medium text-slate-200 flex items-center justify-between">
                              <span>Incident #{inc.id}</span>
                              <span className="text-[10px] font-mono text-rose-400 uppercase">{inc.severity}</span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] leading-tight truncate">
                              {inc.summary || `Attacker ${inc.source_ip} detected`}
                            </p>
                          </div>
                        ))
                    ) : (
                      <div className="p-3 text-center text-slate-400 text-xs font-mono">
                        No pending threat alerts.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Pill / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2.5 pl-2 pr-2 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center font-mono">
                  PX
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[var(--text-primary)] leading-none">
                    Administrator
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    Demo Mode
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl metallic-surface border border-white/15 shadow-2xl p-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="font-semibold text-white">admin@projectx.local</p>
                    <p className="text-[10px] font-mono text-cyan-400">Clearance: Root Admin</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.05] text-[var(--text-secondary)] hover:text-white"
                  >
                    Platform Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
        {/* ─────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD (Threat Hunting - Wazuh / Apple Light Mode)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="p-2 sm:p-6 animate-in fade-in duration-200">
            <ThreatHuntingDashboard
              incidents={incidents}
              auditLogs={auditLogs}
              onApprove={onApprove}
              onBlock={onBlock}
              onRefresh={onRefresh}
            />
          </div>
        )}

        {false && activeTab === "dashboard" && (
          <div className="p-8 max-w-7xl space-y-8 animate-in fade-in duration-200">
            {/* Title & Time Range Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Security Overview
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Monitor your infrastructure, incidents, and autonomous response status.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-secondary)]">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Last 24 hours</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                </div>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="metallic-card rounded-2xl p-6 flex items-center space-x-4 border border-[var(--border-card)] hover:border-rose-500/30 transition-all">
                <div className="h-12 w-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">
                    {openIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Open Incidents
                  </div>
                </div>
              </div>

              <div className="metallic-card rounded-2xl p-6 flex items-center space-x-4 border border-[var(--border-card)] border-t-rose-500/40 hover:border-rose-500/50 transition-all">
                <div className="h-12 w-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-rose-300 font-mono tracking-tight">
                    {criticalIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Critical Incidents
                  </div>
                </div>
              </div>

              <div className="metallic-card rounded-2xl p-6 flex items-center space-x-4 border border-[var(--border-card)] hover:border-emerald-500/30 transition-all">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-300 font-mono tracking-tight">
                    {resolvedIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Resolved Incidents
                  </div>
                </div>
              </div>

              <div className="metallic-card rounded-2xl p-6 flex items-center space-x-4 border border-[var(--border-card)] hover:border-cyan-500/30 transition-all">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-cyan-400"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-300 font-mono tracking-tight">
                    {monitoredAssetsCount}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Monitored Assets
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Event Activity + Detection Rule Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Event Activity Bar Chart */}
              <div className="lg:col-span-8 metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-6 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span>Event Activity (Last 24 hours)</span>
                  </h3>
                  <div className="flex items-center space-x-4 text-xs font-mono text-[var(--text-muted)]">
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                      <span>All Events</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                      <span>Security Events</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                      <span>Info Events</span>
                    </span>
                  </div>
                </div>

                {/* SVG / CSS Bar Chart Representation */}
                <div className="h-56 flex items-end justify-between pt-6 border-b border-[var(--border-hairline)] px-2 gap-2 sm:gap-4">
                  {[
                    { time: "00:00", all: 24, sec: 12, info: 38 },
                    { time: "04:00", all: 38, sec: 24, info: 26 },
                    { time: "08:00", all: 40, sec: 39, info: 28 },
                    { time: "12:00", all: 42, sec: 20, info: 40 },
                    { time: "16:00", all: 44, sec: 27, info: 22 },
                    { time: "20:00", all: 45, sec: 42, info: 30 },
                    { time: "24:00", all: 46, sec: 18, info: 18 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group">
                      <div className="w-full flex items-end justify-center space-x-1 h-44">
                        <div
                          style={{ height: `${(bar.all / 50) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-cyan-500/70 group-hover:bg-cyan-400 rounded-t-sm transition-all"
                          title={`All Events: ${bar.all}`}
                        ></div>
                        <div
                          style={{ height: `${(bar.sec / 50) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-rose-500/80 group-hover:bg-rose-400 rounded-t-sm transition-all"
                          title={`Security Events: ${bar.sec}`}
                        ></div>
                        <div
                          style={{ height: `${(bar.info / 50) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-amber-400/80 group-hover:bg-amber-300 rounded-t-sm transition-all"
                          title={`Info Events: ${bar.info}`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{bar.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection Rule Status Card */}
              <div className="lg:col-span-4 metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Detection Rule Status
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    Active MITRE ATT&CK Triggers
                  </p>
                </div>

                <div className="space-y-3.5">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-black/30 hover:border-cyan-500/30 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[var(--text-primary)]">
                          {rule.name}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                          {rule.technique}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                        <svg className="w-10 h-5 text-cyan-400 stroke-current fill-none" viewBox="0 0 40 20">
                          <path d="M0,15 Q10,5 20,12 T40,5" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("detections")}
                  className="w-full btn-metallic-secondary h-9 px-3.5 rounded-lg text-xs font-medium transition-all"
                >
                  Configure Detection Rules &rarr;
                </button>
              </div>
            </div>

            {/* Bottom Row: Recent Incidents + Lab Environment Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Recent Incidents Table */}
              <div className="lg:col-span-8 metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Recent Incidents
                  </h3>
                  <button
                    onClick={() => setActiveTab("incidents")}
                    className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View all &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] font-mono">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Source IP</th>
                        <th className="py-2.5 px-3">Severity</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)]">
                      {[
                        {
                          id: 101,
                          formattedId: "INC-2026-0012",
                          time: "23:42",
                          title: "SSH Brute Force Attempt",
                          ip: "192.168.56.20",
                          severity: "Critical",
                          status: "Open",
                        },
                        {
                          id: 102,
                          formattedId: "INC-2026-0011",
                          time: "19:18",
                          title: "Suspicious Account Creation",
                          ip: "192.168.10.25",
                          severity: "High",
                          status: "Investigating",
                        },
                        {
                          id: 103,
                          formattedId: "INC-2026-0010",
                          time: "15:07",
                          title: "Suspicious Outbound Connection",
                          ip: "192.168.16.22",
                          severity: "Medium",
                          status: "Resolved",
                        },
                      ].map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => {
                            setSelectedIncidentId(row.id);
                            setActiveTab("response");
                          }}
                          className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-semibold text-cyan-400">
                            {row.formattedId}
                          </td>
                          <td className="py-3 px-3 text-[var(--text-muted)] font-mono">{row.time}</td>
                          <td className="py-3 px-3 font-medium text-[var(--text-primary)]">{row.title}</td>
                          <td className="py-3 px-3 font-mono text-[var(--text-muted)]">{row.ip}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                                row.severity === "Critical"
                                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                  : row.severity === "High"
                                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                  : "bg-orange-500/15 text-orange-300 border border-orange-500/30"
                              }`}
                            >
                              {row.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                                row.status === "Open"
                                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                  : row.status === "Investigating"
                                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[var(--text-muted)]">
                            <MoreHorizontal className="h-4 w-4 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Environment Health Card */}
              <div className="lg:col-span-4 metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Lab Environment Health
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    Real-time host-only testbed status
                  </p>
                </div>

                <div className="space-y-3.5 text-xs font-mono text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span>Victim VM (192.168.56.10)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Online</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span>Log Shipper (auth.log)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span>Healthy</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span>Research AI (Synthesis)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span>Healthy</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span>Caldera Verifier (8888)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span>Connected</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between">
                  <span>Data source:</span>
                  <span className="text-cyan-400">Demo Lab Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: INCIDENTS (Filterable Incident List)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "incidents" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Incidents
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {filteredIncidents.length} of {incidents.length} incidents raised by detection rules.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="metallic-card rounded-2xl p-5 border border-[var(--border-card)] space-y-4">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search ID, title, IP, technique..."
                    value={incidentSearch}
                    onChange={(e) => setIncidentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">All severities</option>
                  <option value="high">Critical / High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="new">Open</option>
                  <option value="approved">Investigating</option>
                  <option value="verified">Resolved</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                  className="w-full lg:w-40 px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>

                <button
                  onClick={() => {
                    setIncidentSearch("");
                    setSeverityFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Incidents Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] font-mono uppercase tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">TITLE</th>
                      <th className="py-3 px-4">SOURCE IP</th>
                      <th className="py-3 px-4">SEVERITY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">DETECTED AT</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)]">
                    {filteredIncidents.map((inc) => (
                      <tr
                        key={inc.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td
                          onClick={() => {
                            setSelectedIncidentId(inc.id);
                            setActiveTab("response");
                          }}
                          className="py-3.5 px-4 font-mono font-semibold text-cyan-400 hover:underline cursor-pointer"
                        >
                          INC-2024-{String(inc.id).padStart(4, "0")}
                        </td>
                        <td
                          onClick={() => {
                            setSelectedIncidentId(inc.id);
                            setActiveTab("response");
                          }}
                          className="py-3.5 px-4 font-medium text-[var(--text-primary)] cursor-pointer max-w-xs truncate"
                        >
                          {inc.rule_hits.includes("R1")
                            ? "SSH Brute Force Attempt"
                            : inc.rule_hits.includes("R2")
                            ? "Suspicious Account Creation"
                            : "Suspicious Outbound Connection"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">
                          {inc.source_ip || "192.168.56.20"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              inc.severity === "high"
                                ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {inc.severity === "high" ? "Critical" : "High"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              inc.status === "verified"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : inc.status === "approved"
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                            }`}
                          >
                            {inc.status === "verified"
                              ? "Resolved"
                              : inc.status === "approved"
                              ? "Investigating"
                              : "Open"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono text-[11px]">
                          {inc.created_at ? new Date(inc.created_at).toLocaleString() : "2024-10-28 23:42"}
                        </td>
                        <td className="py-3.5 px-4 text-right relative">
                          <button
                            onClick={() =>
                              setOpenRowActionId(openRowActionId === inc.id ? null : inc.id)
                            }
                            className="p-1 rounded hover:bg-white/[0.06] text-[var(--text-muted)] hover:text-white cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openRowActionId === inc.id && (
                            <div className="absolute right-4 mt-1 w-44 rounded-xl metallic-surface border border-white/15 shadow-2xl p-1 z-30 text-left text-xs">
                              <button
                                onClick={() => {
                                  setSelectedIncidentId(inc.id);
                                  setActiveTab("response");
                                  setOpenRowActionId(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.05] text-[var(--text-primary)]"
                              >
                                Review & Respond
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedIncidentId(inc.id);
                                  setActiveTab("threats");
                                  setOpenRowActionId(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.05] text-[var(--text-primary)]"
                              >
                                View Graph
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: RESPONSE AND VERIFICATION
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "response" && (
          <div className="p-8 max-w-5xl space-y-7 animate-in fade-in duration-200">
            {/* Breadcrumb & Incident Dropdown */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <div className="flex items-center space-x-1.5 font-medium">
                <button
                  onClick={() => setActiveTab("incidents")}
                  className="hover:text-cyan-400 transition-colors font-mono"
                >
                  Incidents
                </button>
                <span>&gt;</span>
                <span className="font-mono text-cyan-400">
                  INC-2024-{String(currentIncident?.id || 101).padStart(4, "0")}
                </span>
                <span>&gt;</span>
                <span className="text-[var(--text-primary)] font-semibold">Response</span>
              </div>

              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    INC-2024-{String(inc.id).padStart(4, "0")} ({inc.source_ip})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Response and Verification
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Approve, block the firewall rule, and mathematically verify containment via MITRE Caldera.
              </p>
            </div>

            {/* 4-Step Progress Stepper */}
            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)]">
              <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
                {/* Step 1 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status !== "new"
                        ? "bg-emerald-500 text-black"
                        : "bg-cyan-500 text-black ring-4 ring-cyan-500/20"
                    }`}
                  >
                    1
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-semibold text-[var(--text-primary)]">Pending Approval</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-white/10 mx-4"></div>

                {/* Step 2 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "blocked" || currentIncident?.status === "verified"
                        ? "bg-emerald-500 text-black"
                        : currentIncident?.status === "approved"
                        ? "bg-cyan-500 text-black ring-4 ring-cyan-500/20"
                        : "bg-white/[0.05] text-[var(--text-muted)]"
                    }`}
                  >
                    2
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-semibold text-[var(--text-secondary)]">Firewall Block</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-white/10 mx-4"></div>

                {/* Step 3 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "verified"
                        ? "bg-emerald-500 text-black ring-4 ring-emerald-500/20"
                        : "bg-white/[0.05] text-[var(--text-muted)]"
                    }`}
                  >
                    3
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-semibold text-[var(--text-secondary)]">Caldera Verification</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-white/10 mx-4"></div>

                {/* Step 4 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "verified"
                        ? "bg-emerald-400 text-black font-extrabold"
                        : "bg-white/[0.05] text-[var(--text-muted)]"
                    }`}
                  >
                    4
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-semibold text-[var(--text-secondary)]">Result</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Response Card */}
            <div className="metallic-card rounded-2xl p-7 border border-[var(--border-card)] space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Recommended Response
                </h2>
              </div>

              {/* Warning Header */}
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Block source IP using UFW firewall
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Block the IP address <span className="font-mono text-cyan-300">{currentIncident?.source_ip || "192.168.56.20"}</span> at UFW firewall level to prevent further intrusion.
                  </p>
                </div>
              </div>

              {/* Target Information */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Target Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)] w-28">Source IP</span>
                    <span className="text-rose-400 font-medium">
                      {currentIncident?.source_ip || "192.168.56.20"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)] w-28">Target Server</span>
                    <span className="text-slate-300 font-medium">
                      192.168.56.10 (victim)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)] w-28">Block Rule</span>
                    <span className="text-cyan-400 font-medium">
                      ufw deny from {currentIncident?.source_ip || "192.168.56.20"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)] w-28">Reason</span>
                    <span className="text-slate-300 font-medium">
                      SSH Brute Force Attempt (5 failed attempts)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={handleBlockClick}
                  disabled={isBlocking || currentIncident?.status === "verified"}
                  className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-medium shadow-[0_1px_2px_rgba(5,150,105,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] border border-emerald-700 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {isBlocking
                      ? "Executing Block & Caldera..."
                      : currentIncident?.status === "verified"
                      ? "Quarantine Verified"
                      : "Approve and Execute Block"}
                  </span>
                </button>

                <button
                  onClick={() => showToast("Incident marked for manual review.")}
                  className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 text-xs font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
                >
                  Reject
                </button>

                {currentIncident?.status === "verified" && (
                  <button
                    onClick={() => setProofModalOpen(true)}
                    className="ml-auto flex items-center space-x-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>View Caldera Proof Log</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Verification Results Card */}
            <div className="metallic-card rounded-2xl p-7 border border-[var(--border-card)] space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Verification Results
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-mono ${
                    currentIncident?.status === "verified"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {currentIncident?.status === "verified" ? "Verified Neutralized" : "Pending Approval"}
                </span>
              </div>

              {/* Two Comparison Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-3">
                  <div className="text-xs font-bold text-rose-300 font-mono">
                    Before Block (Attack Test)
                  </div>
                  <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>Attack Successful</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] space-y-1 font-mono text-[11px] leading-relaxed">
                    <p>SSH access was successful.</p>
                    <p>Test Time: 2024-10-28 14:19:25</p>
                    <p className="text-slate-300">
                      Caldera adversary was able to gain access to the victim.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-3">
                  <div className="text-xs font-bold text-emerald-300 font-mono">
                    After Block (Verification Test)
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Not Successful</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] space-y-1 font-mono text-[11px] leading-relaxed">
                    <p>Access was blocked by UFW.</p>
                    <p>Caldera adversary could not establish a connection.</p>
                    <p className="text-emerald-300 font-medium">
                      Firewall rule is working as mathematically proven.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Note */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-cyan-300 font-mono">Verification Note</div>
                    <p className="text-[var(--text-secondary)] mt-0.5">
                      Run Caldera adversary again to confirm the block remains effective and no unauthorized ingress is possible.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRetestCaldera}
                  disabled={isRetestingCaldera}
                  className="h-8 px-3 rounded-lg btn-metallic-secondary text-xs font-medium shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isRetestingCaldera ? "Re-testing..." : "Re-test with Caldera"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: DETECTION RULES
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "detections" && (
          <div className="p-8 max-w-5xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Detection Rules
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Tune event thresholds and correlation windows for Linux perimeter defenses.
              </p>
            </div>

            <div className="space-y-5">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{rule.name}</h3>
                      <p className="text-xs text-cyan-400 mt-0.5 font-mono">
                        {rule.technique}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-[var(--text-secondary)]">Threshold (events)</label>
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRules((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, threshold: val } : r))
                          );
                        }}
                        className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[var(--text-secondary)]">Window (seconds)</label>
                      <input
                        type="number"
                        value={rule.window}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRules((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, window: val } : r))
                          );
                        }}
                        className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 pt-1">
                    <input
                      type="checkbox"
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setRules((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, enabled: checked } : r))
                        );
                        showToast(`Rule ${rule.id} ${checked ? "enabled" : "disabled"}`);
                      }}
                      className="h-4 w-4 rounded border-[var(--border-input)] bg-[var(--bg-input)] text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`rule-${rule.id}`}
                      className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer select-none"
                    >
                      Rule enabled
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => showToast("Detection rule configurations saved.")}
                className="h-9 px-4 rounded-lg btn-metallic-primary text-xs font-medium cursor-pointer"
              >
                Save Configurations
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: AUDIT TRAIL
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Audit Trail
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Non-repudiation log of security operator decisions and verification proofs.
                </p>
              </div>

              <button
                onClick={handleExportAudit}
                className="h-9 px-3.5 rounded-lg btn-metallic-secondary flex items-center space-x-2 text-xs font-medium cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="metallic-card rounded-2xl p-5 border border-[var(--border-card)] space-y-4">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search by action, user, target..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
                  <div className="flex items-center space-x-2 px-3 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)]">
                    <span>20/04/2024</span>
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <span>&rarr;</span>
                  <div className="flex items-center space-x-2 px-3 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)]">
                    <span>31/12/2030</span>
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                </div>

                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">All Actions</option>
                  <option value="block">Execute Firewall Block</option>
                  <option value="approve">Approve Response</option>
                  <option value="verify">Caldera Verification</option>
                </select>

                <select
                  value={auditUserFilter}
                  onChange={(e) => setAuditUserFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="admin">admin</option>
                  <option value="system">system</option>
                  <option value="analyst">analyst</option>
                </select>

                <select
                  value={auditResultFilter}
                  onChange={(e) => setAuditResultFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-mono border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">All Results</option>
                  <option value="success">Success</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">TIMESTAMP</th>
                      <th className="py-3 px-4">USER</th>
                      <th className="py-3 px-4">ACTION</th>
                      <th className="py-3 px-4">TARGET</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)] text-[11px]">
                    {[
                      { ts: "2024-04-26 14:35:22", user: "admin", action: "Execute Firewall Block", target: "192.168.56.20" },
                      { ts: "2024-04-26 14:34:10", user: "admin", action: "Approve Response", target: "192.168.56.20" },
                      { ts: "2024-04-26 14:32:15", user: "system", action: "Caldera Verification", target: "192.168.56.20" },
                      { ts: "2024-04-26 13:15:42", user: "analyst", action: "View Incident", target: "-" },
                      { ts: "2024-04-26 11:20:10", user: "admin", action: "Reject Response", target: "192.168.56.30" },
                      { ts: "2024-04-26 10:05:33", user: "analyst", action: "Login", target: "-" },
                      { ts: "2024-04-26 09:42:11", user: "analyst", action: "Unauthorized Access Attempt", target: "/incidents/123/approve" },
                      { ts: "2024-04-26 08:15:20", user: "system", action: "Detection Rule Triggered", target: "192.168.56.20" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4 text-[var(--text-muted)]">{row.ts}</td>
                        <td className="py-3 px-4 text-white font-semibold">{row.user}</td>
                        <td className="py-3 px-4 text-cyan-300">{row.action}</td>
                        <td className="py-3 px-4 text-slate-300">{row.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 6: USERS & ROLES
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="p-8 max-w-5xl space-y-7 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Users & Roles
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Configure dual-custody authorization roles and clearances.
              </p>
            </div>

            {/* Users Table */}
            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] uppercase">
                      <th className="py-2.5 px-3">USER</th>
                      <th className="py-2.5 px-3">EMAIL</th>
                      <th className="py-2.5 px-3">ROLE</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)]">
                    {usersList.map((u, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">{u.username}</td>
                        <td className="py-3 px-3 text-[var(--text-muted)]">{u.email}</td>
                        <td className="py-3 px-3">
                          {u.username === "admin" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              Administrator
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => {
                                const val = e.target.value;
                                setUsersList((prev) =>
                                  prev.map((usr, idx) => (idx === i ? { ...usr, role: val } : usr))
                                );
                                showToast(`Role updated for ${u.username}`);
                              }}
                              className="px-2.5 py-1 text-xs border border-[var(--border-input)] rounded-lg bg-[var(--bg-input)] text-slate-200 focus:outline-none"
                            >
                              <option value="Administrator">Administrator</option>
                              <option value="Analyst">Analyst</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add User Form */}
            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Add user</h3>
              <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row items-end gap-3 text-xs font-mono">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div className="w-full sm:w-44 space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto h-9 px-4 rounded-lg btn-metallic-primary text-xs font-medium cursor-pointer shrink-0"
                >
                  Add user
                </button>
              </form>
            </div>

            {/* Role Permissions Matrix */}
            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Role permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] uppercase">
                      <th className="py-2.5 px-3">PERMISSION</th>
                      <th className="py-2.5 px-3 text-center">ADMINISTRATOR</th>
                      <th className="py-2.5 px-3 text-center">ANALYST</th>
                      <th className="py-2.5 px-3 text-center">VIEWER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)]">
                    {[
                      { perm: "View dashboards & incidents", admin: true, analyst: true, viewer: true },
                      { perm: "Change incident status", admin: true, analyst: true, viewer: false },
                      { perm: "Approve / reject firewall block", admin: true, analyst: false, viewer: false },
                      { perm: "Edit rules, users & settings", admin: true, analyst: false, viewer: false },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.03]">
                        <td className="py-3 px-3 font-medium text-slate-200">{row.perm}</td>
                        <td className="py-3 px-3 text-center">
                          <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.analyst ? (
                            <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.viewer ? (
                            <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 7: GENERAL SETTINGS
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="p-8 max-w-4xl space-y-7 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                General Settings
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Organisation and autonomous platform preferences.
              </p>
            </div>

            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-5">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Organisation</h3>
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Timezone</label>
                  <select
                    value={orgTimezone}
                    onChange={(e) => setOrgTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Audit log retention (days)</label>
                  <input
                    type="number"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-[var(--border-input)] rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Preferences</h3>
              <div className="space-y-3 text-xs font-mono">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border-input)] bg-[var(--bg-input)] text-cyan-500 focus:ring-0"
                  />
                  <span className="text-[var(--text-secondary)]">Auto-refresh dashboards (2.5s cadence)</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border-input)] bg-[var(--bg-input)] text-cyan-500 focus:ring-0"
                  />
                  <span className="text-[var(--text-secondary)]">Email alerts for critical incidents</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={simulationMode}
                    onChange={(e) => setSimulationMode(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border-input)] bg-[var(--bg-input)] text-cyan-500 focus:ring-0"
                  />
                  <span className="text-[var(--text-secondary)]">
                    Lab simulation mode (zero-VM laptop execution)
                  </span>
                </label>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Also manage{" "}
                <button
                  onClick={() => setActiveTab("detections")}
                  className="text-cyan-400 hover:underline"
                >
                  detection rules
                </button>{" "}
                and{" "}
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-cyan-400 hover:underline"
                >
                  users & roles
                </button>
                .
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => showToast("Preferences and organisation settings saved.")}
                className="h-9 px-4 rounded-lg btn-metallic-primary text-xs font-medium cursor-pointer"
              >
                Save changes
              </button>
              <button
                onClick={() => showToast("Changes discarded.")}
                className="h-9 px-4 rounded-lg btn-metallic-secondary text-xs font-medium cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: THREATS (Interactive Attack Graph)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "threats" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Threat Intelligence & Attack Graph
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                NetworkX graph correlation of perimeter telemetry and MITRE ATT&CK kill-chain.
              </p>
            </div>

            {currentIncident ? (
              <div className="space-y-6">
                <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2">
                    Plain-English LLM Threat Assessment (Contract #2)
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    &ldquo;{currentIncident.summary}&rdquo;
                  </p>
                </div>
                <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)]">
                  <EventGraphTimeline incident={currentIncident} />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center metallic-card rounded-2xl border border-[var(--border-card)]">
                <p className="text-xs text-[var(--text-muted)] font-mono">No active incidents to graph.</p>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: ASSETS (Infrastructure Diagnostics)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "assets" && (
          <div className="p-8 max-w-6xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Monitored Infrastructure Nodes
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                VirtualBox host-only testbed topology & daemon connectivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">
                    CONTROLLER INTERFACE
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-xl font-mono font-bold text-white">192.168.56.1</div>
                <p className="text-xs text-[var(--text-secondary)]">FastAPI Autonomous Daemon + Next.js Console</p>
                <div className="pt-2 text-[11px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-2">
                  Status: Listening on port 8000
                </div>
              </div>

              <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">
                    VICTIM VM (TARGET)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-xl font-mono font-bold text-white">192.168.56.10</div>
                <p className="text-xs text-[var(--text-secondary)]">Ubuntu Server 22.04 LTS (sshd, auditd, ufw)</p>
                <div className="pt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2">
                  SSH: Port 22 &bull; Log Shipper Active
                </div>
              </div>

              <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">
                    ATTACKER & VERIFIER
                  </span>
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="text-xl font-mono font-bold text-white">192.168.56.20</div>
                <p className="text-xs text-[var(--text-secondary)]">Kali Linux (MITRE Caldera Server + Sandcat Agent)</p>
                <div className="pt-2 text-[11px] font-mono text-blue-400 bg-blue-950/30 border border-blue-800/40 rounded-lg p-2">
                  Caldera API: Port 8888 Active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: LOGS (Raw Ingestion Stream)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "logs" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Raw Log Ingestion Stream
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Live raw syslog stream from /var/log/auth.log and auditd.
                </p>
              </div>

              <button
                onClick={() => showToast("Stream refreshed")}
                className="h-8 px-3 rounded-lg btn-metallic-secondary flex items-center space-x-1.5 text-xs font-medium cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="metallic-card rounded-2xl p-6 border border-[var(--border-card)] space-y-4 font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px]">
                      <th className="py-2 px-3">EVENT ID</th>
                      <th className="py-2 px-3">TYPE</th>
                      <th className="py-2 px-3">IP</th>
                      <th className="py-2 px-3">USER</th>
                      <th className="py-2 px-3">RAW SYSLOG LINE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[var(--text-secondary)]">
                    {(currentIncident?.events || []).map((ev) => (
                      <tr key={ev.id} className="hover:bg-white/[0.03]">
                        <td className="py-2.5 px-3 text-cyan-400 font-semibold">#{ev.id}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10px] text-slate-300">
                            {ev.event_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-white">{ev.source_ip}</td>
                        <td className="py-2.5 px-3 text-slate-300">{ev.user || "—"}</td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)] truncate max-w-lg text-[11px]">
                          {ev.raw_line}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: REPORTS
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "reports" && (
          <div className="p-8 max-w-5xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Security Executive Reports
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Non-repudiation proof digests and post-incident verification certificates.
              </p>
            </div>

            <div className="metallic-card rounded-2xl p-8 border border-[var(--border-card)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)]">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Incident Certificate #{currentIncident?.id || 101}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">
                    MITRE Caldera Verification Seal: VALIDATED
                  </p>
                </div>
                <button
                  onClick={() => showToast("Executive report exported.")}
                  className="h-8 px-3.5 rounded-lg btn-metallic-primary flex items-center space-x-2 text-xs font-medium cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                <div className="font-semibold text-cyan-300">Threat Synthesis:</div>
                <p className="text-[var(--text-secondary)] leading-relaxed font-sans">
                  {currentIncident?.summary || "Automated attack successfully mitigated and verified via Caldera testbed."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Caldera Proof Modal */}
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

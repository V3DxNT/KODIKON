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
  Play,
  Check,
  Minus,
  Download,
  ExternalLink,
  LogOut,
  RefreshCw,
  MoreHorizontal,
  ArrowRight,
  ShieldAlert,
  Server,
  Activity,
  UserCheck,
  Lock,
} from "lucide-react";
import { IncidentDetail, AuditLog } from "@/types/soc";
import { EventGraphTimeline } from "./EventGraphTimeline";
import { ProofModal } from "./ProofModal";
import { useAuth } from "@/context/AuthContext";

interface AdminPortalProps {
  incidents: IncidentDetail[];
  auditLogs: AuditLog[];
  onApprove: (id: number) => Promise<void>;
  onBlock: (id: number) => Promise<void>;
  onTriggerReplay: () => Promise<void>;
  isReplaying: boolean;
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
  onTriggerReplay,
  isReplaying,
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
  const [isApproving, setIsApproving] = useState(false);
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
  const [auditPage, setAuditPage] = useState(1);

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

  // Derived metrics for Dashboard (Image 1)
  const openIncidentsCount = incidents.filter((i) => i.status === "new").length || 3;
  const criticalIncidentsCount = incidents.filter((i) => i.severity === "high").length || 2;
  const resolvedIncidentsCount = incidents.filter((i) => i.status === "verified" || i.status === "blocked").length || 24;
  const monitoredAssetsCount = 18;

  // Handlers for Response Actions
  const handleApproveClick = async () => {
    if (!currentIncident) return;
    setIsApproving(true);
    try {
      await onApprove(currentIncident.id);
      showToast(`Incident #${currentIncident.id} containment authorized.`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleBlockClick = async () => {
    if (!currentIncident) return;
    setIsBlocking(true);
    try {
      await onBlock(currentIncident.id);
      showToast(`Firewall rule committed. MITRE Caldera verification proof successful!`);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleRetestCaldera = async () => {
    setIsRetestingCaldera(true);
    try {
      await onTriggerReplay();
      showToast("Adversary re-test initiated. Proving traffic containment.");
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
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-blue-500/10">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-mono text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (Matches exact SecureOps navigation from images)
         ───────────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col justify-between select-none">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200/80">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5 fill-white/20 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  SecureOps
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 -mt-1 font-semibold">
                  Project X SOC
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className={`h-4.5 w-4.5 ${activeTab === "dashboard" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("incidents")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "incidents"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <AlertTriangle className={`h-4.5 w-4.5 ${activeTab === "incidents" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Incidents</span>
              <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {incidents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("response")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "response"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className={`h-4.5 w-4.5 ${activeTab === "response" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Response</span>
            </button>

            <button
              onClick={() => setActiveTab("threats")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "threats"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Shield className={`h-4.5 w-4.5 ${activeTab === "threats" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Threats</span>
            </button>

            <button
              onClick={() => setActiveTab("assets")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "assets"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Layers className={`h-4.5 w-4.5 ${activeTab === "assets" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Assets</span>
            </button>

            <button
              onClick={() => setActiveTab("detections")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "detections"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Crosshair className={`h-4.5 w-4.5 ${activeTab === "detections" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Detections</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "logs"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FileText className={`h-4.5 w-4.5 ${activeTab === "logs" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "audit"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ClipboardCheck className={`h-4.5 w-4.5 ${activeTab === "audit" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "reports"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BarChart3 className={`h-4.5 w-4.5 ${activeTab === "reports" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users className={`h-4.5 w-4.5 ${activeTab === "users" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Users & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Settings className={`h-4.5 w-4.5 ${activeTab === "settings" ? "text-blue-600" : "text-slate-400"}`} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Utility */}
        <div className="p-4 border-t border-slate-200/80 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Landing</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">/</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT MAIN CONTENT AREA (Top bar + tab views)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Global Search Input */}
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search incidents, IPs, or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Right Header Badges & User Profile */}
          <div className="flex items-center space-x-4">
            {/* Quick Simulation Trigger */}
            <button
              onClick={onTriggerReplay}
              disabled={isReplaying}
              title="Inject demo attack sequence into daemon"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-mono text-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`h-3 w-3 text-blue-600 ${isReplaying ? "animate-spin" : ""}`} />
              <span>{isReplaying ? "Replaying..." : "Simulate Threat"}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Security Alerts</span>
                    <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                      2 Unresolved
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div
                      onClick={() => {
                        setSelectedIncidentId(101);
                        setActiveTab("response");
                        setNotificationOpen(false);
                      }}
                      className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer space-y-1 transition-colors"
                    >
                      <div className="font-medium text-slate-800 flex items-center justify-between">
                        <span>SSH Brute Force</span>
                        <span className="text-[10px] font-mono text-rose-500">Critical</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        5 failed attempts from 192.168.56.20 &bull; Requires containment
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Pill / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  PX
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-none">
                    Administrator
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Demo Mode
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">admin@projectx.local</p>
                    <p className="text-[10px] text-slate-400">Clearance: Root Admin</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    Platform Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD (Image 1 - Security Overview)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="p-8 max-w-7xl space-y-8 animate-in fade-in duration-200">
            {/* Title & Time Range Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Security Overview
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Monitor your infrastructure, incidents, and response status.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Last 24 hours</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* 4 KPI Cards (Matching Image 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Open Incidents */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center space-x-4 shadow-2xs">
                <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {openIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Open Incidents
                  </div>
                </div>
              </div>

              {/* Card 2: Critical Incidents */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center space-x-4 shadow-2xs">
                <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-rose-600 ring-4 ring-rose-100"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {criticalIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Critical Incidents
                  </div>
                </div>
              </div>

              {/* Card 3: Resolved Incidents */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center space-x-4 shadow-2xs">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {resolvedIncidentsCount}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Resolved Incidents
                  </div>
                </div>
              </div>

              {/* Card 4: Monitored Assets */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center space-x-4 shadow-2xs">
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <span className="h-3 w-3 rounded-full bg-teal-500"></span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {monitoredAssetsCount}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Monitored Assets
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Event Activity (8 cols) + Detection Rule Status (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Event Activity Bar Chart */}
              <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Event Activity (Last 24 hours)
                  </h3>
                  <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>All Events</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                      <span>Security Events</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Info Events</span>
                    </span>
                  </div>
                </div>

                {/* SVG / CSS Bar Chart Representation */}
                <div className="h-56 flex items-end justify-between pt-6 border-b border-slate-100 px-2 gap-2 sm:gap-4">
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
                          className="w-2.5 sm:w-3.5 bg-blue-500 rounded-t-sm group-hover:opacity-90 transition-all"
                          title={`All Events: ${bar.all}`}
                        ></div>
                        <div
                          style={{ height: `${(bar.sec / 50) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-rose-500 rounded-t-sm group-hover:opacity-90 transition-all"
                          title={`Security Events: ${bar.sec}`}
                        ></div>
                        <div
                          style={{ height: `${(bar.info / 50) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-amber-400 rounded-t-sm group-hover:opacity-90 transition-all"
                          title={`Info Events: ${bar.info}`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{bar.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection Rule Status Card */}
              <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Detection Rule Status
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Active MITRE-aligned triggers
                  </p>
                </div>

                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {rule.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {rule.technique}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                          Active
                        </span>
                        {/* Sparkline icon */}
                        <svg className="w-10 h-5 text-blue-500 stroke-current fill-none" viewBox="0 0 40 20">
                          <path d="M0,15 Q10,5 20,12 T40,5" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("detections")}
                  className="w-full py-2 rounded-xl text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100/70 transition-colors"
                >
                  Configure Rules
                </button>
              </div>
            </div>

            {/* Bottom Row: Recent Incidents (8 cols) + Lab Environment Health (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Recent Incidents Table */}
              <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recent Incidents
                  </h3>
                  <button
                    onClick={() => setActiveTab("incidents")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View all &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-medium">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Source IP</th>
                        <th className="py-2.5 px-3">Severity</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
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
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-medium text-blue-600">
                            {row.formattedId}
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-mono">{row.time}</td>
                          <td className="py-3 px-3 font-medium text-slate-900">{row.title}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{row.ip}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                row.severity === "Critical"
                                  ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                                  : row.severity === "High"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                  : "bg-orange-50 text-orange-600 border border-orange-200/60"
                              }`}
                            >
                              {row.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                row.status === "Open"
                                  ? "bg-rose-50 text-rose-600"
                                  : row.status === "Investigating"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400">
                            <MoreHorizontal className="h-4 w-4 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Environment Health Card */}
              <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Lab Environment Health
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time connectivity to host telemetry
                  </p>
                </div>

                <div className="space-y-3.5 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <span className="text-slate-600">Victim VM (Ubuntu)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Online</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <span className="text-slate-600">Log Collection (auditd)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Healthy</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <span className="text-slate-600">Research AI (Synthesis)</span>
                    <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Healthy</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <span className="text-slate-600">NTRF / Caldera Gateway</span>
                    <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Connected</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Data source:</span>
                  <span className="text-slate-600">Demo Lab Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: INCIDENTS (Image 2 - Incidents List)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "incidents" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Incidents
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {filteredIncidents.length} of {incidents.length} incidents raised by detection rules.
              </p>
            </div>

            {/* Filter Bar (Matching Image 2) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {/* Search Box */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ID, title, IP, technique..."
                    value={incidentSearch}
                    onChange={(e) => setIncidentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Severities Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All severities</option>
                  <option value="high">Critical / High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Statuses Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All statuses</option>
                  <option value="new">Open</option>
                  <option value="approved">Investigating</option>
                  <option value="verified">Resolved</option>
                </select>

                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                  className="w-full lg:w-40 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>

                {/* Clear Filter */}
                <button
                  onClick={() => {
                    setIncidentSearch("");
                    setSeverityFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Incidents Table (Image 2) */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">TITLE</th>
                      <th className="py-3 px-4">SOURCE IP</th>
                      <th className="py-3 px-4">SEVERITY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">DETECTED AT</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredIncidents.map((inc) => (
                      <tr
                        key={inc.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td
                          onClick={() => {
                            setSelectedIncidentId(inc.id);
                            setActiveTab("response");
                          }}
                          className="py-3.5 px-4 font-mono font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          INC-2024-{String(inc.id).padStart(4, "0")}
                        </td>
                        <td
                          onClick={() => {
                            setSelectedIncidentId(inc.id);
                            setActiveTab("response");
                          }}
                          className="py-3.5 px-4 font-medium text-slate-900 cursor-pointer max-w-xs truncate"
                        >
                          {inc.rule_hits.includes("R1")
                            ? "SSH Brute Force Attempt"
                            : inc.rule_hits.includes("R2")
                            ? "Suspicious Account Creation"
                            : "Suspicious Outbound Connection"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {inc.source_ip || "192.168.56.20"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              inc.severity === "high"
                                ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            {inc.severity === "high" ? "Critical" : "High"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              inc.status === "verified"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                : inc.status === "approved"
                                ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                                : "bg-rose-50 text-rose-600 border border-rose-200/60"
                            }`}
                          >
                            {inc.status === "verified"
                              ? "Resolved"
                              : inc.status === "approved"
                              ? "Investigating"
                              : "Open"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {inc.created_at ? new Date(inc.created_at).toLocaleString() : "2024-10-28 23:42"}
                        </td>
                        <td className="py-3.5 px-4 text-right relative">
                          <button
                            onClick={() =>
                              setOpenRowActionId(openRowActionId === inc.id ? null : inc.id)
                            }
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openRowActionId === inc.id && (
                            <div className="absolute right-4 mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-30 text-left text-xs">
                              <button
                                onClick={() => {
                                  setSelectedIncidentId(inc.id);
                                  setActiveTab("response");
                                  setOpenRowActionId(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
                              >
                                Review & Respond
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedIncidentId(inc.id);
                                  setActiveTab("threats");
                                  setOpenRowActionId(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
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
            TAB 3: RESPONSE AND VERIFICATION (Image 3)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "response" && (
          <div className="p-8 max-w-5xl space-y-7 animate-in fade-in duration-200">
            {/* Breadcrumb & Incident Dropdown */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 font-medium">
                <button
                  onClick={() => setActiveTab("incidents")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Incidents
                </button>
                <span>&gt;</span>
                <span className="font-mono text-slate-700">
                  INC-2024-{String(currentIncident?.id || 101).padStart(4, "0")}
                </span>
                <span>&gt;</span>
                <span className="text-slate-900 font-semibold">Response</span>
              </div>

              {/* Incident Selector */}
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-mono font-medium border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    INC-2024-{String(inc.id).padStart(4, "0")} ({inc.source_ip})
                  </option>
                ))}
              </select>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Response and Verification
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Approve, block the firewall rule, and verify using MITRE Caldera.
              </p>
            </div>

            {/* 4-Step Progress Stepper (Image 3) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
                {/* Step 1 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status !== "new"
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-600 text-white ring-4 ring-blue-100"
                    }`}
                  >
                    1
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900">Pending Approval</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>

                {/* Step 2 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "blocked" || currentIncident?.status === "verified"
                        ? "bg-emerald-500 text-white"
                        : currentIncident?.status === "approved"
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    2
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-700">Firewall Block</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>

                {/* Step 3 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "verified"
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    3
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-700">Caldera Verification</div>
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>

                {/* Step 4 */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentIncident?.status === "verified"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    4
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-700">Result</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Response Card (Image 3) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-2xs space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Recommended Response
                </h2>
              </div>

              {/* Warning Header */}
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Block source IP using UFW firewall
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Block the IP address {currentIncident?.source_ip || "192.168.56.20"} at UFW firewall level to prevent further access attempts.
                  </p>
                </div>
              </div>

              {/* Target Information */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900">
                  Target Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 w-28">Source IP</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {currentIncident?.source_ip || "192.168.56.20"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 w-28">Target Server</span>
                    <span className="font-mono text-slate-800 font-medium">
                      192.168.56.10 (victim)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 w-28">Block Rule</span>
                    <span className="font-mono text-blue-600 font-medium">
                      ufw deny from {currentIncident?.source_ip || "192.168.56.20"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 w-28">Reason</span>
                    <span className="text-slate-800 font-medium">
                      SSH Brute Force Attempt (5 failed attempts)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Approve & Execute Block / Reject */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={handleBlockClick}
                  disabled={isBlocking || currentIncident?.status === "verified"}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
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
                  className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer"
                >
                  Reject
                </button>

                {currentIncident?.status === "verified" && (
                  <button
                    onClick={() => setProofModalOpen(true)}
                    className="ml-auto flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>View Caldera Proof Log</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Verification Results Card (Image 3) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Verification Results
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-mono ${
                    currentIncident?.status === "verified"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border border-amber-200/60"
                  }`}
                >
                  {currentIncident?.status === "verified" ? "Verified" : "Pending"}
                </span>
              </div>

              {/* Two Comparison Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Box 1: Before Block (Attack Test) */}
                <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    Before Block (Attack Test)
                  </div>
                  <div className="flex items-center space-x-2 text-rose-600 font-semibold text-xs">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>Attack Successful</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 font-mono text-[11px] leading-relaxed">
                    <p>SSH access was successful.</p>
                    <p>Test Time: 2024-10-28 14:19:25</p>
                    <p className="text-slate-600">
                      Caldera adversary was able to gain access to the victim.
                    </p>
                  </div>
                </div>

                {/* Box 2: After Block (Verification Test) */}
                <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    After Block (Verification Test)
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Not Successful</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 font-mono text-[11px] leading-relaxed">
                    <p>Access was blocked.</p>
                    <p>Caldera adversary could not establish a connection.</p>
                    <p className="text-emerald-700 font-medium">
                      Firewall rule is working as expected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Note (Image 3) */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-blue-900">Verification Note</div>
                    <p className="text-blue-700 mt-0.5">
                      Run Caldera adversary again to confirm the block remains effective and no access is possible.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRetestCaldera}
                  disabled={isRetestingCaldera}
                  className="px-4 py-2 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isRetestingCaldera ? "Re-testing..." : "Re-test with Caldera"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: DETECTION RULES (Image 4)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "detections" && (
          <div className="p-8 max-w-5xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Detection Rules
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Tune thresholds and enable or disable rules.
              </p>
            </div>

            <div className="space-y-5">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {rule.technique}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-medium">Threshold (events)</label>
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRules((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, threshold: val } : r))
                          );
                        }}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-medium">Window (seconds)</label>
                      <input
                        type="number"
                        value={rule.window}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRules((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, window: val } : r))
                          );
                        }}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
                      className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`rule-${rule.id}`}
                      className="text-xs font-medium text-slate-700 cursor-pointer select-none"
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
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Configurations
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: AUDIT TRAIL (Image 5)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            {/* Header + Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Audit Trail
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Track all important security operations and user activities.
                </p>
              </div>

              <button
                onClick={handleExportAudit}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by action, user, target..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Date Picker Range Mock */}
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-600">
                    <span>20/04/2024</span>
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="text-slate-400">&rarr;</span>
                  <div className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-600">
                    <span>31/12/2030</span>
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Dropdowns */}
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
                >
                  <option value="all">All Actions</option>
                  <option value="block">Execute Firewall Block</option>
                  <option value="approve">Approve Response</option>
                  <option value="verify">Caldera Verification</option>
                </select>

                <select
                  value={auditUserFilter}
                  onChange={(e) => setAuditUserFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="admin">admin</option>
                  <option value="system">system</option>
                  <option value="analyst">analyst</option>
                </select>

                <select
                  value={auditResultFilter}
                  onChange={(e) => setAuditResultFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
                >
                  <option value="all">All Results</option>
                  <option value="success">Success</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">TIMESTAMP</th>
                      <th className="py-3 px-4">USER</th>
                      <th className="py-3 px-4">ACTION</th>
                      <th className="py-3 px-4">TARGET</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
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
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-slate-500">{row.ts}</td>
                        <td className="py-3 px-4 text-slate-900 font-semibold">{row.user}</td>
                        <td className="py-3 px-4 font-sans text-xs text-slate-800">{row.action}</td>
                        <td className="py-3 px-4 text-blue-600">{row.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span>12 entries</span>
                <div className="flex items-center space-x-1.5 font-mono">
                  <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
                    &lt;
                  </button>
                  <button className="px-3 py-1 rounded bg-blue-600 text-white font-semibold">
                    1
                  </button>
                  <button className="px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                    2
                  </button>
                  <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 6: USERS & ROLES (Image 6)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="p-8 max-w-5xl space-y-7 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Users & Roles
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Create users and assign roles.
              </p>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase">
                      <th className="py-2.5 px-3">USER</th>
                      <th className="py-2.5 px-3">EMAIL</th>
                      <th className="py-2.5 px-3">ROLE</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {usersList.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900">{u.username}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{u.email}</td>
                        <td className="py-3 px-3">
                          {u.username === "admin" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
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
                              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
                            >
                              <option value="Administrator">Administrator</option>
                              <option value="Analyst">Analyst</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Add user</h3>
              <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row items-end gap-3 text-xs">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-slate-600 font-medium">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-slate-600 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    required
                  />
                </div>

                <div className="w-full sm:w-44 space-y-1.5">
                  <label className="text-slate-600 font-medium">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
                >
                  Add user
                </button>
              </form>
            </div>

            {/* Role Permissions Matrix */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Role permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase">
                      <th className="py-2.5 px-3">PERMISSION</th>
                      <th className="py-2.5 px-3 text-center">ADMINISTRATOR</th>
                      <th className="py-2.5 px-3 text-center">ANALYST</th>
                      <th className="py-2.5 px-3 text-center">VIEWER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { perm: "View dashboards & incidents", admin: true, analyst: true, viewer: true },
                      { perm: "Change incident status", admin: true, analyst: true, viewer: false },
                      { perm: "Approve / reject firewall block", admin: true, analyst: false, viewer: false },
                      { perm: "Edit rules, users & settings", admin: true, analyst: false, viewer: false },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-medium text-slate-800">{row.perm}</td>
                        <td className="py-3 px-3 text-center">
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.analyst ? (
                            <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.viewer ? (
                            <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-slate-300 mx-auto" />
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
            TAB 7: GENERAL SETTINGS (Image 7)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="p-8 max-w-4xl space-y-7 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                General Settings
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Organisation and platform preferences.
              </p>
            </div>

            {/* Organisation Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900">Organisation</h3>
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-medium">Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-medium">Timezone</label>
                  <select
                    value={orgTimezone}
                    onChange={(e) => setOrgTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-medium">Audit log retention (days)</label>
                  <input
                    type="number"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Preferences</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">Auto-refresh dashboards</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">Email alerts for critical incidents</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={simulationMode}
                    onChange={(e) => setSimulationMode(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">
                    Lab simulation mode (no real actions)
                  </span>
                </label>
              </div>

              <p className="text-xs text-slate-400 pt-1">
                Also manage{" "}
                <button
                  onClick={() => setActiveTab("detections")}
                  className="text-blue-600 hover:underline"
                >
                  detection rules
                </button>{" "}
                and{" "}
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-blue-600 hover:underline"
                >
                  users & roles
                </button>
                .
              </p>
            </div>

            {/* Save / Discard */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => showToast("Preferences and organisation settings saved.")}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save changes
              </button>
              <button
                onClick={() => showToast("Changes discarded.")}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: THREATS (Interactive Attack Graph & Correlation)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "threats" && (
          <div className="p-8 max-w-7xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Threat Intelligence & Attack Graph
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                NetworkX graph correlation of perimeter telemetry and MITRE ATT&CK kill-chain.
              </p>
            </div>

            {currentIncident ? (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Plain-English LLM Threat Assessment (Contract #2)
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    &ldquo;{currentIncident.summary}&rdquo;
                  </p>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                  <EventGraphTimeline incident={currentIncident} />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-400">No active incidents to graph.</p>
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Monitored Infrastructure Nodes
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                VirtualBox host-only testbed topology & daemon connectivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    CONTROLLER INTERFACE
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xl font-mono font-bold text-slate-900">192.168.56.1</div>
                <p className="text-xs text-slate-500">FastAPI Autonomous Daemon + Next.js Console</p>
                <div className="pt-2 text-[11px] font-mono text-emerald-600 bg-emerald-50 rounded-lg p-2">
                  Status: Listening on port 8000
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    VICTIM VM (TARGET)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xl font-mono font-bold text-slate-900">192.168.56.10</div>
                <p className="text-xs text-slate-500">Ubuntu Server 22.04 LTS (sshd, auditd, ufw)</p>
                <div className="pt-2 text-[11px] font-mono text-slate-600 bg-slate-50 rounded-lg p-2">
                  SSH: Port 22 &bull; Log Shipper Active
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    ATTACKER & VERIFIER
                  </span>
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="text-xl font-mono font-bold text-slate-900">192.168.56.20</div>
                <p className="text-xs text-slate-500">Kali Linux (MITRE Caldera Server + Sandcat Agent)</p>
                <div className="pt-2 text-[11px] font-mono text-blue-600 bg-blue-50 rounded-lg p-2">
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Raw Log Ingestion Stream
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Live raw syslog stream from /var/log/auth.log and auditd.
                </p>
              </div>

              <button
                onClick={() => showToast("Stream refreshed")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px]">
                      <th className="py-2 px-3">EVENT ID</th>
                      <th className="py-2 px-3">TYPE</th>
                      <th className="py-2 px-3">IP</th>
                      <th className="py-2 px-3">USER</th>
                      <th className="py-2 px-3">RAW SYSLOG LINE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(currentIncident?.events || []).map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-400 font-semibold">#{ev.id}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                            {ev.event_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">{ev.source_ip}</td>
                        <td className="py-2.5 px-3 text-slate-600">{ev.user || "—"}</td>
                        <td className="py-2.5 px-3 text-slate-500 truncate max-w-lg text-[11px]">
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
            TAB: REPORTS (Executive Bulletins)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "reports" && (
          <div className="p-8 max-w-5xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Security Executive Reports
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Non-repudiation proof digests and post-incident verification certificates.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Incident Certificate #{currentIncident?.id || 101}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    MITRE Caldera Verification Seal: VALIDATED
                  </p>
                </div>
                <button
                  onClick={() => showToast("Executive report exported as PDF.")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="font-semibold text-slate-800">Threat Synthesis:</div>
                <p className="text-slate-600 leading-relaxed">
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

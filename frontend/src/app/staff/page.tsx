"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployeeView } from "@/components/EmployeeView";
import { fetchIncidents, fetchIncident, blockIncident } from "@/lib/api";
import { IncidentDetail } from "@/types/soc";
import { useAuth } from "@/context/AuthContext";
import mockData from "@/mocks/incident.json";
import { Lock, ArrowRight, UserCheck, Shield } from "lucide-react";
import { Glass } from "@/components/Glass";

export default function StaffPage() {
  const router = useRouter();
  const { role, user, isStaff, isAdmin, logout } = useAuth();
  const [incidents, setIncidents] = useState<IncidentDetail[]>([]);
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
    } catch {
      setIncidents(mockData.incidents as unknown as IncidentDetail[]);
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

  const handleAttemptBlock = async (id: number) => {
    try {
      await blockIncident(id, "employee");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "HTTP 403: Admin privilege required");
      }
    }
  };

  // If unauthenticated guest (role === null), show formal staff clearance gate
  if (!isStaff && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <Glass radius={24} blur={24} intensity={0.85} className="max-w-md w-full p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 shadow-inner">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              PROTECTED PERSONNEL FEED
            </div>
            <h2 className="text-xl font-medium text-white mt-1">
              Staff Authentication Required
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Internal security bulletins and operational advisories are restricted to verified staff members. 
            Please sign in to access your organization security feed.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => router.push("/")}
              className="btn-metallic-secondary rounded-lg px-4 py-2.5 text-xs font-medium cursor-pointer"
            >
              Return Home
            </button>
            <button
              onClick={() => router.push("/staff/login?redirect=/staff")}
              className="btn-metallic-primary rounded-lg px-5 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <span>Staff Login</span>
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </Glass>
        </div>
      )}

      <EmployeeView
        incidents={incidents}
        onAttemptBlock={handleAttemptBlock}
        onSwitchToAdmin={() => router.push("/login?redirect=/admin")}
        onLogout={() => {
          logout();
          router.push("/");
        }}
        staffUser={user}
      />
    </div>
  );
}

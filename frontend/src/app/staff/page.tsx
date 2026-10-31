"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeView } from "@/components/EmployeeView";
import { fetchIncidents, fetchIncident, blockIncident } from "@/lib/api";
import { IncidentDetail } from "@/types/soc";
import { useAuth } from "@/context/AuthContext";
import mockData from "@/mocks/incident.json";

export default function StaffPage() {
  const router = useRouter();
  const { role } = useAuth();
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
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleAttemptBlock = async (id: number) => {
    try {
      await blockIncident(id, "employee");
    } catch (err: any) {
      showToast(err.message || "HTTP 403: Admin privilege required");
    }
  };

  return (
    <div>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <EmployeeView
        incidents={incidents}
        onAttemptBlock={handleAttemptBlock}
        onSwitchToAdmin={() => router.push("/login?redirect=/admin")}
      />
    </div>
  );
}

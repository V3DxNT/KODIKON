"use client";

import React, { useEffect, useState } from "react";
import { AuditLedgerView } from "@/components/AuditLedgerView";
import { fetchAuditLogs } from "@/lib/api";
import { AuditLog } from "@/types/soc";
import mockData from "@/mocks/incident.json";

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      } catch {
        setAuditLogs(mockData.audit as unknown as AuditLog[]);
      }
    };
    loadLogs();
    const interval = setInterval(loadLogs, 2500);
    return () => clearInterval(interval);
  }, []);

  return <AuditLedgerView logs={auditLogs} />;
}

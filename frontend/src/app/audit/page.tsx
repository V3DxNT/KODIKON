"use client";

import React, { useEffect, useState } from "react";
import { AuditLedgerView } from "@/components/AuditLedgerView";
import { fetchAuditLogs } from "@/lib/api";
import { AuditLog } from "@/types/soc";

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      } catch (err) {
        console.warn("Failed to load audit logs:", err);
        setAuditLogs([]);
      }
    };
    loadLogs();
    const interval = setInterval(loadLogs, 2500);
    return () => clearInterval(interval);
  }, []);

  return <AuditLedgerView logs={auditLogs} />;
}

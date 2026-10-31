import { IncidentDetail, IncidentSummary, AuditLog, ActionResponse, Role } from "@/types/soc";
import mockData from "@/mocks/incident.json";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

// In-memory state for mock fallback so actions update state realistically
let inMemoryIncidents: IncidentDetail[] = JSON.parse(JSON.stringify(mockData.incidents));
const inMemoryAudit: AuditLog[] = JSON.parse(JSON.stringify(mockData.audit));

export async function fetchIncidents(): Promise<IncidentSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to local mock
  }

  return inMemoryIncidents.map((inc) => ({
    id: inc.id,
    created_at: inc.created_at,
    status: inc.status,
    severity: inc.severity,
    summary: inc.summary,
    rule_hits: inc.rule_hits,
    source_ip: inc.source_ip,
    event_count: inc.events.length,
  }));
}

export async function fetchIncident(id: number): Promise<IncidentDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to local mock
  }

  const found = inMemoryIncidents.find((i) => i.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function approveIncident(id: number, role: Role): Promise<ActionResponse> {
  const xRole = role === "admin" ? "admin" : "receptionist";
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Role": xRole,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (role !== "admin") {
      throw new Error("Forbidden: admin role required for this action");
    }
    // Update in-memory mock
    const target = inMemoryIncidents.find((i) => i.id === id);
    if (target) {
      target.status = "approved";
      inMemoryAudit.unshift({
        id: Date.now(),
        ts: new Date().toISOString(),
        actor_role: "admin",
        action: "approve",
        target: String(id),
        result: "ok",
      });
    }
    return {
      status: "approved",
      detail: `Incident ${id} approved by admin (simulated)`,
    };
  }
}

export async function blockIncident(id: number, role: Role): Promise<ActionResponse> {
  const xRole = role === "admin" ? "admin" : "receptionist";
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Role": xRole,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (role !== "admin") {
      throw new Error("Forbidden: admin role required for this action");
    }
    // Update in-memory mock
    const target = inMemoryIncidents.find((i) => i.id === id);
    if (target) {
      target.status = "verified";
      inMemoryAudit.unshift({
        id: Date.now() + 1,
        ts: new Date().toISOString(),
        actor_role: "admin",
        action: "verify",
        target: target.source_ip || "unknown",
        result: "confirmed",
      });
      inMemoryAudit.unshift({
        id: Date.now(),
        ts: new Date().toISOString(),
        actor_role: "admin",
        action: "block",
        target: target.source_ip || "unknown",
        result: "ok",
      });
    }
    return {
      status: "verified",
      detail: `Attacker ${target?.source_ip} blocked (ufw) & verified via Caldera re-run (simulated)`,
    };
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const res = await fetch(`${API_BASE}/audit`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to local mock
  }

  return inMemoryAudit;
}

export async function triggerReplaySimulation(): Promise<boolean> {
  // Replays the 3 acts into backend /events or resets mock
  try {
    const ip = "192.168.56.20";
    const now = new Date();
    
    // Test if backend is reachable
    const health = await fetch(`${API_BASE}/health`).catch(() => null);
    if (health && health.ok) {
      // Send 5 ssh_fail, 1 ssh_success, 1 user_add, 1 egress
      const events = [
        ...Array(5).fill(0).map((_, i) => ({
          ts: new Date(now.getTime() - (300 - i * 10) * 1000).toISOString(),
          source_ip: ip,
          user: "root",
          host: "victim-server",
          event_type: "ssh_fail",
          raw_line: `sshd[${4000 + i}]: Failed password for root from ${ip} port ${49150 + i}`,
        })),
        {
          ts: new Date(now.getTime() - 240 * 1000).toISOString(),
          source_ip: ip,
          user: "admin",
          host: "victim-server",
          event_type: "ssh_success",
          raw_line: `sshd[4100]: Accepted password for admin from ${ip} port 49160`,
        },
        {
          ts: new Date(now.getTime() - 180 * 1000).toISOString(),
          source_ip: ip,
          user: "admin",
          host: "victim-server",
          event_type: "user_add",
          raw_line: `useradd[4150]: new user: name=backdoor, UID=1002, GID=1002`,
        },
        {
          ts: new Date(now.getTime() - 60 * 1000).toISOString(),
          source_ip: ip,
          user: "admin",
          host: "victim-server",
          event_type: "egress",
          raw_line: `[UFW BLOCK EGRESS] OUT=eth0 SRC=192.168.56.10 DST=192.168.56.20 PROTO=TCP DPT=4444`,
        },
      ];

      for (const ev of events) {
        await fetch(`${API_BASE}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ev),
        });
      }
      return true;
    }
  } catch {
    // If backend offline, reset inMemory mock
  }

  inMemoryIncidents = JSON.parse(JSON.stringify(mockData.incidents));
  return true;
}

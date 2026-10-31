import { IncidentDetail, IncidentSummary, AuditLog, ActionResponse, Role, EventOut } from "@/types/soc";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

/**
 * Fetch all incidents from the live SOC daemon (Contract #2).
 * Returns real correlated incidents populated by VM log ingestion.
 */
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
    console.warn(`[API] Failed to fetch incidents: HTTP ${res.status}`);
  } catch (err) {
    console.warn("[API] SOC backend daemon unreachable:", err);
  }
  return [];
}

/**
 * Fetch detailed incident with all associated events and LLM plain-English summary.
 */
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
    console.warn(`[API] Incident #${id} not found: HTTP ${res.status}`);
  } catch (err) {
    console.warn(`[API] Error fetching incident #${id}:`, err);
  }
  return null;
}

/**
 * Admin approves containment of the incident (Contract #2).
 */
export async function approveIncident(id: number, role: Role): Promise<ActionResponse> {
  const xRole = role === "admin" ? "admin" : "receptionist";
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
}

/**
 * Admin triggers live SSH block on victim VM and Caldera verification re-attack (Contract #3 & #4).
 */
export async function blockIncident(id: number, role: Role): Promise<ActionResponse> {
  const xRole = role === "admin" ? "admin" : "receptionist";
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
}

/**
 * Fetch immutable non-repudiation audit trail logs from the backend database.
 */
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
    console.warn(`[API] Failed to fetch audit logs: HTTP ${res.status}`);
  } catch (err) {
    console.warn("[API] Audit log endpoint unreachable:", err);
  }
  return [];
}

/**
 * Fetch raw telemetry events streamed from the victim VM log shipper.
 */
export async function fetchRawEvents(limit = 200): Promise<EventOut[]> {
  try {
    const res = await fetch(`${API_BASE}/events?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
    console.warn(`[API] Failed to fetch events: HTTP ${res.status}`);
  } catch (err) {
    console.warn("[API] Events endpoint unreachable:", err);
  }
  return [];
}


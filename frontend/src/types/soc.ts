export type Role = "employee" | "admin";

export interface EventOut {
  id: number;
  ts: string;
  source_ip: string;
  user: string | null;
  host: string;
  event_type: "ssh_fail" | "ssh_success" | "user_add" | "egress";
  raw_line: string;
}

export interface IncidentSummary {
  id: number;
  created_at: string;
  status: "new" | "approved" | "blocked" | "verified";
  severity: "low" | "medium" | "high";
  summary: string | null;
  rule_hits: string[];
  source_ip: string | null;
  event_count: number;
}

export interface IncidentDetail {
  id: number;
  created_at: string;
  status: "new" | "approved" | "blocked" | "verified";
  severity: "low" | "medium" | "high";
  summary: string | null;
  rule_hits: string[];
  source_ip: string | null;
  events: EventOut[];
}

export interface AuditLog {
  id: number;
  ts: string;
  actor_role: string;
  action: "approve" | "reject" | "block" | "verify";
  target: string;
  result: string;
}

export interface ActionResponse {
  status: string;
  detail: string;
  audit_id?: number;
}

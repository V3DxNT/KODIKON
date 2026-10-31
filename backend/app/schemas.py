from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

# Contract #1 — Event JSON schema (Normalizer output = Ingest input)
class EventIn(BaseModel):
    ts: datetime
    source_ip: str
    user: Optional[str] = None
    host: str
    event_type: str                 # one of: ssh_fail, ssh_success, user_add, egress
    raw_line: str

class EventOut(EventIn):
    id: int

# Contract #2 — Incident output consumed by Frontend UI
class IncidentOut(BaseModel):
    id: int
    created_at: datetime
    status: str                     # new -> approved -> blocked -> verified
    severity: str                   # low | medium | high
    summary: Optional[str] = None
    rule_hits: List[str]            # parsed list of rules e.g. ["R1", "R2", "R3"]
    source_ip: Optional[str] = None
    events: List[EventOut] = []

class IncidentSummaryOut(BaseModel):
    id: int
    created_at: datetime
    status: str
    severity: str
    summary: Optional[str] = None
    rule_hits: List[str] = []
    source_ip: Optional[str] = None
    event_count: int = 0

class AuditLogOut(BaseModel):
    id: int
    ts: datetime
    actor_role: str
    action: str
    target: str
    result: str

class ActionResponse(BaseModel):
    status: str
    detail: str
    audit_id: Optional[int] = None

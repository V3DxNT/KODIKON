from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ts: datetime
    source_ip: str
    user: Optional[str] = None
    host: str
    event_type: str          # "ssh_fail", "ssh_success", "user_add", "egress"
    raw_line: str
    incident_id: Optional[int] = Field(default=None, foreign_key="incident.id")

class Incident(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"      # new -> approved -> blocked -> verified
    severity: str = "low"    # low | medium | high
    summary: Optional[str] = None
    rule_hits: str = ""      # comma-joined e.g. "R1,R2,R3"
    source_ip: Optional[str] = None

class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ts: datetime = Field(default_factory=datetime.utcnow)
    actor_role: str
    action: str              # "approve", "reject", "block", "verify"
    target: str              # incident id or attacker ip
    result: str              # "ok", "denied", "failed", "confirmed"

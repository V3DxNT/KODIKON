from datetime import datetime, timezone
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.db import create_db_and_tables, get_session
from app.models import Event, Incident, AuditLog
from app.schemas import IncidentOut, IncidentSummaryOut, EventOut, AuditLogOut, ActionResponse
from app.ingest import router as ingest_router
from app.roles import require_admin, get_current_role
from app.actions import block_ip, verify_block

app = FastAPI(
    title="Project X SOC Backend",
    description="Single-box SOC backend: log ingestion, correlation, LLM explanation, role gating, SSH block, and Caldera verification.",
    version="1.0.0"
)

# Enable CORS for frontend integration (Next.js default port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Register event ingestion router
app.include_router(ingest_router)

@app.get("/health", tags=["system"])
def health():
    return {"status": "ok"}

@app.get("/incidents", response_model=List[IncidentSummaryOut], tags=["incidents"])
def list_incidents(session: Session = Depends(get_session)):
    """List all incidents for the Incident List page."""
    incidents = session.exec(select(Incident).order_by(Incident.created_at.desc())).all()
    out = []
    for inc in incidents:
        count_stmt = select(Event).where(Event.incident_id == inc.id)
        events = session.exec(count_stmt).all()
        rule_list = [r.strip() for r in inc.rule_hits.split(",") if r.strip()]
        out.append(IncidentSummaryOut(
            id=inc.id,
            created_at=inc.created_at,
            status=inc.status,
            severity=inc.severity,
            summary=inc.summary,
            rule_hits=rule_list,
            source_ip=inc.source_ip,
            event_count=len(events)
        ))
    return out

@app.get("/incidents/{incident_id}", response_model=IncidentOut, tags=["incidents"])
def get_incident(incident_id: int, session: Session = Depends(get_session)):
    """Contract #2 endpoint: Get complete incident detail including related events."""
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    events = session.exec(
        select(Event).where(Event.incident_id == incident.id).order_by(Event.ts.asc())
    ).all()

    rule_list = [r.strip() for r in incident.rule_hits.split(",") if r.strip()]

    return IncidentOut(
        id=incident.id,
        created_at=incident.created_at,
        status=incident.status,
        severity=incident.severity,
        summary=incident.summary,
        rule_hits=rule_list,
        source_ip=incident.source_ip,
        events=[
            EventOut(
                id=e.id,
                ts=e.ts,
                source_ip=e.source_ip,
                user=e.user,
                host=e.host,
                event_type=e.event_type,
                raw_line=e.raw_line,
            )
            for e in events
        ]
    )

@app.post("/incidents/{incident_id}/approve", response_model=ActionResponse, tags=["incidents"])
def approve_incident(
    incident_id: int,
    session: Session = Depends(get_session),
    admin_role: str = Depends(require_admin)
):
    """Admin-only endpoint: Approves an incident response."""
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = "approved"
    session.add(incident)

    audit = AuditLog(
        ts=datetime.now(timezone.utc),
        actor_role=admin_role,
        action="approve",
        target=str(incident.id),
        result="ok"
    )
    session.add(audit)
    session.commit()
    session.refresh(audit)

    return ActionResponse(status="approved", detail=f"Incident {incident_id} approved by {admin_role}", audit_id=audit.id)

@app.post("/incidents/{incident_id}/block", response_model=ActionResponse, tags=["incidents"])
def block_incident_attacker(
    incident_id: int,
    session: Session = Depends(get_session),
    admin_role: str = Depends(require_admin)
):
    """
    Admin-only endpoint:
    1. Executes SSH block (ufw deny from attacker_ip)
    2. Writes block audit log
    3. Triggers Caldera re-run verification
    4. Writes verify audit log
    5. Sets status to blocked -> verified
    """
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    attacker_ip = incident.source_ip or "unknown"

    # Step 1: Block via SSH
    try:
        block_result = block_ip(attacker_ip=attacker_ip)
        block_audit = AuditLog(
            ts=datetime.now(timezone.utc),
            actor_role=admin_role,
            action="block",
            target=attacker_ip,
            result="ok"
        )
        session.add(block_audit)
        incident.status = "blocked"
        session.add(incident)
        session.commit()
    except Exception as e:
        block_audit = AuditLog(
            ts=datetime.now(timezone.utc),
            actor_role=admin_role,
            action="block",
            target=attacker_ip,
            result=f"failed: {str(e)}"
        )
        session.add(block_audit)
        session.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Firewall block failed: {str(e)}"
        )

    # Step 2: Verify via Caldera re-attack
    verify_result = verify_block(attacker_ip=attacker_ip)
    verify_audit = AuditLog(
        ts=datetime.now(timezone.utc),
        actor_role=admin_role,
        action="verify",
        target=attacker_ip,
        result=verify_result
    )
    session.add(verify_audit)

    if "confirmed" in verify_result:
        incident.status = "verified"
    session.add(incident)
    session.commit()

    return ActionResponse(
        status=incident.status,
        detail=f"Attacker {attacker_ip} blocked and verification completed with result: {verify_result}",
        audit_id=verify_audit.id
    )

@app.get("/audit", response_model=List[AuditLogOut], tags=["audit"])
def list_audit_logs(session: Session = Depends(get_session)):
    """Fetch audit logs for audit trail view."""
    return session.exec(select(AuditLog).order_by(AuditLog.ts.desc())).all()

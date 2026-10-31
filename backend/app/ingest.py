from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db import get_session
from app.models import Event
from app.schemas import EventIn, EventOut
from app.correlate import correlate_event

router = APIRouter(prefix="/events", tags=["events"])

@router.post("", response_model=EventOut, status_code=201)
def ingest_event(event_in: EventIn, session: Session = Depends(get_session)):
    """
    Contract #1 endpoint:
    Ingests a normalized event from the log collector (Role A),
    stores it in the database, and correlates it into an incident.
    """
    valid_types = {"ssh_fail", "ssh_success", "user_add", "egress"}
    if event_in.event_type not in valid_types:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid event_type '{event_in.event_type}'. Must be one of: {valid_types}"
        )

    # Insert event
    event = Event(
        ts=event_in.ts,
        source_ip=event_in.source_ip,
        user=event_in.user,
        host=event_in.host,
        event_type=event_in.event_type,
        raw_line=event_in.raw_line,
    )
    session.add(event)
    session.commit()
    session.refresh(event)

    # Correlate into incident
    correlate_event(session, event)

    return event

from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlmodel import Session, select
import networkx as nx

from app.models import Event, Incident
from app.rules import evaluate_rules
from app.summary import summarize

CORRELATION_WINDOW_MINUTES = 10

def correlate_event(session: Session, new_event: Event) -> Incident:
    """
    Correlates a newly arrived Event with existing open incidents.
    Finds open incidents for the same source_ip within the time window.
    If none exists, creates a new incident. Updates rule hits, severity, and summary.
    """
    cutoff = new_event.ts - timedelta(minutes=CORRELATION_WINDOW_MINUTES)
    
    # Query open incidents for the same source IP created or updated recently
    statement = (
        select(Incident)
        .where(Incident.source_ip == new_event.source_ip)
        .where(Incident.status.in_(["new", "approved"]))
        .where(Incident.created_at >= cutoff)
        .order_by(Incident.created_at.desc())
    )
    incident = session.exec(statement).first()

    if not incident:
        # Create a new incident
        incident = Incident(
            created_at=datetime.now(timezone.utc),
            status="new",
            severity="low",
            source_ip=new_event.source_ip,
            rule_hits=""
        )
        session.add(incident)
        session.commit()
        session.refresh(incident)

    # Attach event to incident
    new_event.incident_id = incident.id
    session.add(new_event)
    session.commit()
    session.refresh(new_event)

    # Fetch all events for this incident to evaluate correlation graph and rules
    event_stmt = select(Event).where(Event.incident_id == incident.id).order_by(Event.ts.asc())
    all_events = list(session.exec(event_stmt).all())

    # Optional: Graph correlation check using NetworkX
    if len(all_events) > 1:
        G = nx.Graph()
        for e in all_events:
            G.add_node(e.id, ts=e.ts, ip=e.source_ip, event_type=e.event_type)
        
        for i in range(len(all_events)):
            for j in range(i + 1, len(all_events)):
                e1, e2 = all_events[i], all_events[j]
                if e1.source_ip == e2.source_ip:
                    time_diff = abs((e1.ts - e2.ts).total_seconds())
                    if time_diff <= CORRELATION_WINDOW_MINUTES * 60:
                        G.add_edge(e1.id, e2.id)

    # Re-evaluate rules and severity
    rule_hits, severity = evaluate_rules(all_events)
    incident.rule_hits = ",".join(rule_hits)
    incident.severity = severity
    
    # Generate plain-English summary (with Jinja2 fallback)
    incident.summary = summarize(incident, all_events)

    session.add(incident)
    session.commit()
    session.refresh(incident)

    return incident

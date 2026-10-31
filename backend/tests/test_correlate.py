"""
Tests for incident correlation in app/correlate.py.

Events that share a source IP within the correlation window join one open
incident; a different IP, an event outside the window, or an event arriving
after the incident is closed each start a new incident. After correlation the
incident carries its rule hits, severity, and a plain-English summary.
"""
from datetime import datetime, timezone, timedelta

from sqlmodel import select

from app.models import Event, Incident
from app.correlate import correlate_event, CORRELATION_WINDOW_MINUTES


def _ingest(session, event):
    """Persist an event and correlate it, returning the incident."""
    session.add(event)
    session.commit()
    return correlate_event(session, event)


def test_same_ip_forms_single_incident(session, make_event):
    inc1 = _ingest(session, make_event("ssh_fail"))
    inc2 = _ingest(session, make_event("ssh_success"))
    assert inc1.id == inc2.id
    assert len(session.exec(select(Incident)).all()) == 1


def test_different_ips_form_two_incidents(session, make_event):
    inc1 = _ingest(session, make_event("ssh_fail", source_ip="192.168.56.20"))
    inc2 = _ingest(session, make_event("ssh_fail", source_ip="10.0.0.99"))
    assert inc1.id != inc2.id
    assert len(session.exec(select(Incident)).all()) == 2


def test_full_sequence_is_one_high_incident(session, make_event):
    events = ([make_event("ssh_fail") for _ in range(5)]
              + [make_event("ssh_success"),
                 make_event("user_add"),
                 make_event("egress")])
    inc = None
    for e in events:
        inc = _ingest(session, e)
    assert len(session.exec(select(Incident)).all()) == 1
    assert set(inc.rule_hits.split(",")) == {"R1", "R2", "R3"}
    assert inc.severity == "high"
    assert inc.summary  # populated by the LLM or the template fallback


def test_events_are_attached_to_the_incident(session, make_event):
    _ingest(session, make_event("ssh_fail"))
    inc = _ingest(session, make_event("ssh_success"))
    attached = session.exec(select(Event).where(Event.incident_id == inc.id)).all()
    assert len(attached) == 2


def test_event_outside_window_forms_new_incident(session, make_event):
    inc1 = _ingest(session, make_event("ssh_fail"))
    # Age the first incident past the correlation window.
    inc1.created_at = datetime.now(timezone.utc) - timedelta(
        minutes=CORRELATION_WINDOW_MINUTES + 5
    )
    session.add(inc1)
    session.commit()

    inc2 = _ingest(session, make_event("ssh_fail"))
    assert inc1.id != inc2.id
    assert len(session.exec(select(Incident)).all()) == 2


def test_closed_incident_is_not_reused(session, make_event):
    inc1 = _ingest(session, make_event("ssh_fail"))
    inc1.status = "blocked"  # only "new"/"approved" incidents accept new events
    session.add(inc1)
    session.commit()

    inc2 = _ingest(session, make_event("ssh_fail"))
    assert inc1.id != inc2.id

from datetime import datetime, timezone
import pytest
from sqlmodel import SQLModel, create_engine, Session, select
from app.models import Event, Incident
from app.correlate import correlate_event

@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s

def test_events_same_ip_form_single_incident(session):
    now = datetime.now(timezone.utc)
    e1 = Event(ts=now, source_ip="192.168.56.20", host="victim", event_type="ssh_fail", raw_line="line 1")
    e2 = Event(ts=now, source_ip="192.168.56.20", host="victim", event_type="ssh_success", raw_line="line 2")
    
    session.add(e1)
    session.commit()
    inc1 = correlate_event(session, e1)

    session.add(e2)
    session.commit()
    inc2 = correlate_event(session, e2)

    assert inc1.id == inc2.id
    
    incidents = session.exec(select(Incident)).all()
    assert len(incidents) == 1

def test_events_different_ips_form_two_incidents(session):
    now = datetime.now(timezone.utc)
    e1 = Event(ts=now, source_ip="192.168.56.20", host="victim", event_type="ssh_fail", raw_line="fail from .20")
    e2 = Event(ts=now, source_ip="10.0.0.99", host="victim", event_type="ssh_fail", raw_line="fail from .99")

    session.add(e1)
    session.commit()
    inc1 = correlate_event(session, e1)

    session.add(e2)
    session.commit()
    inc2 = correlate_event(session, e2)

    assert inc1.id != inc2.id

    incidents = session.exec(select(Incident)).all()
    assert len(incidents) == 2

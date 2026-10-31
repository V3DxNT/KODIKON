"""
Light checks on the SQLModel table defaults in app/models.py, so a regression
in the incident lifecycle defaults (status/severity) is caught early.
"""
from datetime import datetime, timezone

from app.models import Event, Incident, AuditLog


def test_incident_defaults():
    inc = Incident()
    assert inc.id is None
    assert inc.status == "new"
    assert inc.severity == "low"
    assert inc.rule_hits == ""
    assert inc.summary is None
    assert isinstance(inc.created_at, datetime)


def test_event_optional_fields():
    e = Event(
        ts=datetime.now(timezone.utc),
        source_ip="192.168.56.20",
        host="victim",
        event_type="ssh_fail",
        raw_line="x",
    )
    assert e.user is None          # user is optional
    assert e.incident_id is None   # unlinked until correlated
    assert e.event_type == "ssh_fail"


def test_audit_log_fields():
    a = AuditLog(
        actor_role="admin", action="block", target="192.168.56.20", result="ok"
    )
    assert isinstance(a.ts, datetime)
    assert a.action == "block"
    assert a.result == "ok"

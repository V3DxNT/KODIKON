from datetime import datetime, timezone
import pytest
from app.models import Event
from app.rules import r1_bruteforce, r2_new_user, r3_egress, evaluate_rules

def make_event(event_type: str, source_ip="192.168.56.20", user="admin") -> Event:
    return Event(
        ts=datetime.now(timezone.utc),
        source_ip=source_ip,
        user=user,
        host="victim-vm",
        event_type=event_type,
        raw_line=f"dummy {event_type}"
    )

def test_r1_bruteforce():
    events = [make_event("ssh_fail") for _ in range(5)] + [make_event("ssh_success")]
    assert r1_bruteforce(events) is True

    # Less than 5 fails
    few_fails = [make_event("ssh_fail") for _ in range(4)] + [make_event("ssh_success")]
    assert r1_bruteforce(few_fails) is False

    # 5 fails but no success
    no_success = [make_event("ssh_fail") for _ in range(5)]
    assert r1_bruteforce(no_success) is False

def test_r2_new_user():
    events = [make_event("ssh_success"), make_event("user_add")]
    assert r2_new_user(events) is True

    only_user_add = [make_event("user_add")]
    assert r2_new_user(only_user_add) is False

def test_r3_egress():
    events = [make_event("egress")]
    assert r3_egress(events) is True

    normal = [make_event("ssh_success")]
    assert r3_egress(normal) is False

def test_benign_traffic():
    # A few normal logins, no failures
    benign_events = [
        make_event("ssh_success", user="alice"),
        make_event("ssh_success", user="bob"),
    ]
    hits, severity = evaluate_rules(benign_events)
    assert hits == []
    assert severity == "low"

def test_full_attack_sequence():
    # 5x ssh_fail, 1x ssh_success, 1x user_add, 1x egress
    attack_events = (
        [make_event("ssh_fail") for _ in range(5)]
        + [make_event("ssh_success")]
        + [make_event("user_add")]
        + [make_event("egress")]
    )
    hits, severity = evaluate_rules(attack_events)
    assert "R1" in hits
    assert "R2" in hits
    assert "R3" in hits
    assert severity == "high"

"""
Tests for the POST /events ingest endpoint (Contract #1) in app/ingest.py.

Covers: every valid event_type is accepted, unknown types and malformed
bodies are rejected with 422, and an accepted event is correlated so an
incident appears.
"""
import pytest

VALID_TYPES = ["ssh_fail", "ssh_success", "user_add", "egress"]


@pytest.mark.parametrize("event_type", VALID_TYPES)
def test_each_valid_event_type_is_accepted(client, event_payload, event_type):
    r = client.post("/events", json=event_payload(event_type))
    assert r.status_code == 201
    assert r.json()["event_type"] == event_type


def test_unknown_event_type_returns_422(client, event_payload):
    r = client.post("/events", json=event_payload("malware"))
    assert r.status_code == 422
    assert "Invalid event_type" in r.json()["detail"]


def test_missing_required_field_returns_422(client):
    # ts, source_ip, host and raw_line are all required by EventIn
    r = client.post("/events", json={"event_type": "ssh_fail"})
    assert r.status_code == 422


def test_accepted_event_is_correlated_into_an_incident(client, event_payload):
    client.post("/events", json=event_payload("ssh_fail"))
    incidents = client.get("/incidents").json()
    assert len(incidents) == 1
    assert incidents[0]["source_ip"] == "192.168.56.20"
    assert incidents[0]["event_count"] == 1


def test_ingest_persists_raw_line(client, event_payload):
    payload = event_payload("ssh_success")
    r = client.post("/events", json=payload)
    assert r.json()["raw_line"] == payload["raw_line"]

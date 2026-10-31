"""
End-to-end API tests through FastAPI's TestClient.

Exercises the full loop -- ingest -> correlate -> list/detail -> role gate ->
approve -> block+verify (stubbed) -> audit -- plus the error paths. The SSH
block and Caldera verify run in simulation mode (see the `client` fixture), so
no live victim or Caldera server is contacted.
"""


def _post_attack(client, event_payload, ip="192.168.56.20"):
    """Ingest a full R1+R2+R3 attack sequence (8 events) from one IP."""
    for _ in range(5):
        r = client.post("/events", json=event_payload("ssh_fail", source_ip=ip))
        assert r.status_code == 201
    for et in ("ssh_success", "user_add", "egress"):
        r = client.post("/events", json=event_payload(et, source_ip=ip))
        assert r.status_code == 201


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_ingest_returns_event_with_id(client, event_payload):
    r = client.post("/events", json=event_payload("ssh_fail"))
    assert r.status_code == 201
    body = r.json()
    assert body["id"] >= 1
    assert body["event_type"] == "ssh_fail"


def test_full_flow_detects_high_incident(client, event_payload):
    _post_attack(client, event_payload)

    incidents = client.get("/incidents").json()
    assert len(incidents) == 1
    inc = incidents[0]
    assert inc["severity"] == "high"
    assert set(inc["rule_hits"]) == {"R1", "R2", "R3"}
    assert inc["event_count"] == 8
    assert inc["summary"]


def test_incident_detail_matches_contract(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]

    detail = client.get(f"/incidents/{inc_id}").json()
    assert detail["id"] == inc_id
    assert len(detail["events"]) == 8
    assert detail["summary"]
    assert set(detail["rule_hits"]) == {"R1", "R2", "R3"}
    first = detail["events"][0]
    for field in ("id", "ts", "source_ip", "host", "event_type", "raw_line"):
        assert field in first


def test_incident_detail_404_for_unknown_id(client):
    assert client.get("/incidents/999").status_code == 404


def test_receptionist_is_forbidden_from_actions(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]

    assert client.post(
        f"/incidents/{inc_id}/approve", headers={"X-Role": "receptionist"}
    ).status_code == 403
    assert client.post(
        f"/incidents/{inc_id}/block", headers={"X-Role": "receptionist"}
    ).status_code == 403


def test_missing_role_header_defaults_to_receptionist(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]
    # no X-Role header -> default receptionist -> forbidden
    assert client.post(f"/incidents/{inc_id}/approve").status_code == 403


def test_admin_approve_is_case_insensitive(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]
    r = client.post(f"/incidents/{inc_id}/approve", headers={"X-Role": "ADMIN"})
    assert r.status_code == 200
    assert r.json()["status"] == "approved"


def test_admin_block_then_verify(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]
    client.post(f"/incidents/{inc_id}/approve", headers={"X-Role": "admin"})

    r = client.post(f"/incidents/{inc_id}/block", headers={"X-Role": "admin"})
    assert r.status_code == 200
    assert r.json()["status"] in ("blocked", "verified")

    detail = client.get(f"/incidents/{inc_id}").json()
    assert detail["status"] in ("blocked", "verified")


def test_block_unknown_incident_404(client):
    r = client.post("/incidents/999/block", headers={"X-Role": "admin"})
    assert r.status_code == 404


def test_audit_trail_records_every_action(client, event_payload):
    _post_attack(client, event_payload)
    inc_id = client.get("/incidents").json()[0]["id"]
    client.post(f"/incidents/{inc_id}/approve", headers={"X-Role": "admin"})
    client.post(f"/incidents/{inc_id}/block", headers={"X-Role": "admin"})

    audits = client.get("/audit").json()
    actions = [a["action"] for a in audits]
    assert "approve" in actions
    assert "block" in actions
    assert "verify" in actions
    for a in audits:
        assert a["actor_role"]
        assert a["result"]


def test_invalid_event_type_rejected(client, event_payload):
    assert client.post("/events", json=event_payload("portscan")).status_code == 422

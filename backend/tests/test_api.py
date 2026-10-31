from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from app.main import app
from app.db import get_session

@pytest.fixture(name="client")
def client_fixture(monkeypatch):
    # Enable simulated actions during testing so no live SSH/Caldera network connection is attempted
    monkeypatch.setattr("app.actions.SIMULATE_ACTIONS", True)

    # In-memory SQLite with StaticPool so all connections share the same memory DB
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)

    def get_test_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_full_api_flow(client):
    # 1. Ingest attack events (Contract #1)
    ip = "192.168.56.20"
    now_iso = datetime.now(timezone.utc).isoformat()

    # Ingest 5 ssh_fail
    for i in range(5):
        resp = client.post("/events", json={
            "ts": now_iso,
            "source_ip": ip,
            "user": "root",
            "host": "victim",
            "event_type": "ssh_fail",
            "raw_line": f"Failed password for invalid user root from {ip} port 4000{i}"
        })
        assert resp.status_code == 201

    # Ingest 1 ssh_success
    resp = client.post("/events", json={
        "ts": now_iso,
        "source_ip": ip,
        "user": "admin",
        "host": "victim",
        "event_type": "ssh_success",
        "raw_line": f"Accepted password for admin from {ip} port 40010"
    })
    assert resp.status_code == 201

    # Ingest 1 user_add
    resp = client.post("/events", json={
        "ts": now_iso,
        "source_ip": ip,
        "user": "admin",
        "host": "victim",
        "event_type": "user_add",
        "raw_line": "new user: name=backdoor, UID=1002"
    })
    assert resp.status_code == 201

    # Ingest 1 egress
    resp = client.post("/events", json={
        "ts": now_iso,
        "source_ip": ip,
        "user": "admin",
        "host": "victim",
        "event_type": "egress",
        "raw_line": "[UFW BLOCK EGRESS] OUT=eth0 SRC=192.168.56.10 DST=192.168.56.99"
    })
    assert resp.status_code == 201

    # 2. Check incident list
    list_resp = client.get("/incidents")
    assert list_resp.status_code == 200
    incidents = list_resp.json()
    assert len(incidents) == 1
    inc_id = incidents[0]["id"]
    assert incidents[0]["severity"] == "high"
    assert "R1" in incidents[0]["rule_hits"]
    assert "R2" in incidents[0]["rule_hits"]
    assert "R3" in incidents[0]["rule_hits"]
    assert incidents[0]["event_count"] == 8

    # 3. Check incident detail (Contract #2)
    detail_resp = client.get(f"/incidents/{inc_id}")
    assert detail_resp.status_code == 200
    detail = detail_resp.json()
    assert len(detail["events"]) == 8
    assert detail["summary"] is not None

    # 4. Role gate check: receptionist cannot approve or block
    rej_approve = client.post(f"/incidents/{inc_id}/approve", headers={"X-Role": "receptionist"})
    assert rej_approve.status_code == 403

    rej_block = client.post(f"/incidents/{inc_id}/block", headers={"X-Role": "receptionist"})
    assert rej_block.status_code == 403

    # 5. Admin can approve
    appr_resp = client.post(f"/incidents/{inc_id}/approve", headers={"X-Role": "admin"})
    assert appr_resp.status_code == 200

    # 6. Admin can block and verify (in stub mode since lab host is not live)
    block_resp = client.post(f"/incidents/{inc_id}/block", headers={"X-Role": "admin"})
    assert block_resp.status_code == 200
    assert block_resp.json()["status"] in ("blocked", "verified")

    # 7. Check audit trail
    audit_resp = client.get("/audit")
    assert audit_resp.status_code == 200
    audits = audit_resp.json()
    assert len(audits) >= 3  # approve, block, verify

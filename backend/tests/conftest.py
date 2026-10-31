"""
Shared pytest fixtures for the Project X SOC backend test suite.

Provides, per test:
- a fresh in-memory SQLite engine + session (StaticPool so every connection
  sees the same in-memory database),
- a FastAPI TestClient wired to that engine with SSH/Caldera actions stubbed
  and the on-startup table creation turned into a no-op (no soc.db on disk),
- factory fixtures for building Event rows and POST /events payloads.

All tests are hermetic: no real LLM, SSH, or Caldera network call is made.
"""
import pathlib
import sys
from datetime import datetime, timezone
from typing import Callable, Optional

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

# Make `app` importable no matter which directory pytest is launched from
# (backend/ is the parent of this tests/ package).
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

from app.main import app  # noqa: E402
from app.db import get_session  # noqa: E402
from app.models import Event  # noqa: E402


@pytest.fixture(autouse=True)
def _hermetic_env(monkeypatch):
    """Force every test offline: no LLM key => template summary path."""
    monkeypatch.setattr("app.summary.LLM_API_KEY", "", raising=False)


@pytest.fixture
def engine():
    """A fresh in-memory database for a single test."""
    eng = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(eng)
    yield eng
    eng.dispose()


@pytest.fixture
def session(engine):
    """A SQLModel session bound to the per-test in-memory engine."""
    with Session(engine) as s:
        yield s


@pytest.fixture
def client(engine, monkeypatch):
    """
    TestClient whose DB dependency uses the per-test engine. SSH block and
    Caldera verify are stubbed, and startup table creation is a no-op so no
    soc.db file is written during tests.
    """
    monkeypatch.setattr("app.actions.SIMULATE_ACTIONS", True, raising=False)
    monkeypatch.setattr("app.main.create_db_and_tables", lambda: None, raising=False)

    def _get_test_session():
        with Session(engine) as s:
            yield s

    app.dependency_overrides[get_session] = _get_test_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def make_event() -> Callable[..., Event]:
    """Factory for Event rows with sensible attack defaults."""

    def _make(
        event_type: str,
        source_ip: str = "192.168.56.20",
        user: str = "admin",
        host: str = "victim-vm",
        ts: Optional[datetime] = None,
    ) -> Event:
        return Event(
            ts=ts or datetime.now(timezone.utc),
            source_ip=source_ip,
            user=user,
            host=host,
            event_type=event_type,
            raw_line=f"dummy {event_type} from {source_ip}",
        )

    return _make


@pytest.fixture
def event_payload() -> Callable[..., dict]:
    """Factory for POST /events request bodies (Contract #1 shape)."""

    def _make(
        event_type: str,
        source_ip: str = "192.168.56.20",
        user: str = "root",
        host: str = "victim",
        ts: Optional[datetime] = None,
    ) -> dict:
        return {
            "ts": (ts or datetime.now(timezone.utc)).isoformat(),
            "source_ip": source_ip,
            "user": user,
            "host": host,
            "event_type": event_type,
            "raw_line": f"raw {event_type} from {source_ip}",
        }

    return _make

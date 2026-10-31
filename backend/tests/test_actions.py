"""
Tests for the SSH block and Caldera verify helpers in app/actions.py.

Every path is exercised without a live victim or Caldera server: the
simulation flag and the stub-host list short-circuit the real SSH call, and
the live Caldera branches are driven with a fake httpx client so no network
request leaves the machine.
"""
import pytest

from app import actions


# ----------------------------------------------------------------- block_ip
def test_block_ip_returns_simulated_when_flag_set(monkeypatch):
    monkeypatch.setattr(actions, "SIMULATE_ACTIONS", True)
    assert actions.block_ip(attacker_ip="192.168.56.20") == "blocked (simulated)"


def test_block_ip_stub_host_short_circuits(monkeypatch):
    monkeypatch.setattr(actions, "SIMULATE_ACTIONS", False)
    result = actions.block_ip(attacker_ip="192.168.56.20", victim_host="localhost")
    assert result == "blocked (simulated)"


def test_block_ip_empty_host_is_stubbed(monkeypatch):
    monkeypatch.setattr(actions, "SIMULATE_ACTIONS", False)
    monkeypatch.setattr(actions, "VICTIM_HOST", "")
    result = actions.block_ip(attacker_ip="192.168.56.20")
    assert "simulated" in result


# --------------------------------------------------------------- verify_block
def test_verify_block_stub_when_unconfigured(monkeypatch):
    monkeypatch.setattr(actions, "CALDERA_API_KEY", "")
    monkeypatch.setattr(actions, "CALDERA_PROFILE_ID", "")
    assert actions.verify_block(attacker_ip="192.168.56.20") == "confirmed (stub)"


class _Resp:
    def __init__(self, status_code, payload=None, text=""):
        self.status_code = status_code
        self._payload = payload or {}
        self.text = text

    def json(self):
        return self._payload


def _fake_client_factory(resp=None, raise_exc=None):
    class _FakeClient:
        def __init__(self, *a, **k):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

        def post(self, *a, **k):
            if raise_exc:
                raise raise_exc
            return resp

    return _FakeClient


def _configure_caldera(monkeypatch):
    monkeypatch.setattr(actions, "CALDERA_API_KEY", "key")
    monkeypatch.setattr(actions, "CALDERA_PROFILE_ID", "profile-1")


def test_verify_block_confirmed_on_operation_created(monkeypatch):
    _configure_caldera(monkeypatch)
    monkeypatch.setattr(
        actions.httpx, "Client", _fake_client_factory(resp=_Resp(201, {"id": "op1"}))
    )
    assert actions.verify_block(attacker_ip="192.168.56.20") == "confirmed"


def test_verify_block_reports_caldera_error_status(monkeypatch):
    _configure_caldera(monkeypatch)
    monkeypatch.setattr(
        actions.httpx, "Client", _fake_client_factory(resp=_Resp(500, text="boom"))
    )
    assert actions.verify_block(attacker_ip="192.168.56.20") == "caldera_error"


def test_verify_block_unreachable_on_exception(monkeypatch):
    _configure_caldera(monkeypatch)
    monkeypatch.setattr(
        actions.httpx, "Client", _fake_client_factory(raise_exc=RuntimeError("down"))
    )
    assert actions.verify_block(attacker_ip="192.168.56.20") == "caldera_unreachable"

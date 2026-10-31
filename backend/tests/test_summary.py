"""
Tests for plain-English incident summaries in app/summary.py.

The template fallback must always produce text so the demo never breaks when
the LLM is unavailable. The LLM path is driven with a fake httpx client; no
real API call is made. (conftest's autouse fixture already blanks the API key,
so the default path is the template.)
"""
from app import summary as summary_mod
from app.summary import summarize, summarize_with_llm, FALLBACK
from app.models import Incident


def _incident(severity="high", source_ip="192.168.56.20", rule_hits="R1,R2,R3"):
    return Incident(severity=severity, source_ip=source_ip, rule_hits=rule_hits)


def test_fallback_template_renders_all_fields():
    text = FALLBACK.render(
        severity="high", source_ip="1.2.3.4", rule_hits="R1,R2", event_count=3
    )
    assert "HIGH" in text          # severity is upper-cased
    assert "1.2.3.4" in text
    assert "R1,R2" in text
    assert "3" in text


def test_summarize_uses_template_without_llm_key(make_event):
    events = [make_event("ssh_fail"), make_event("egress")]
    text = summarize(_incident(), events)
    assert "HIGH" in text
    assert "192.168.56.20" in text


def test_summarize_prefers_injected_llm_client(make_event):
    class _Client:
        def summarize(self, incident, events):
            return "LLM says: brute force then exfiltration."

    text = summarize(_incident(), [make_event("ssh_fail")], llm_client=_Client())
    assert text == "LLM says: brute force then exfiltration."


def test_summarize_falls_back_when_llm_client_raises(make_event):
    class _Boom:
        def summarize(self, incident, events):
            raise RuntimeError("llm down")

    text = summarize(_incident(), [make_event("ssh_fail")], llm_client=_Boom())
    assert "HIGH" in text  # dropped through to the template


def test_summarize_with_llm_returns_none_without_key(make_event):
    # autouse fixture blanks LLM_API_KEY -> no key -> None
    assert summarize_with_llm(_incident(), [make_event("ssh_fail")]) is None


class _LLMResp:
    status_code = 200

    def json(self):
        return {"choices": [{"message": {"content": "  Three sentence summary.  "}}]}


class _LLMClient:
    def __init__(self, *a, **k):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def post(self, *a, **k):
        return _LLMResp()


def test_summarize_with_llm_success(monkeypatch, make_event):
    monkeypatch.setattr(summary_mod, "LLM_API_KEY", "fake-key")
    monkeypatch.setattr(summary_mod.httpx, "Client", _LLMClient)
    text = summarize_with_llm(_incident(), [make_event("ssh_success")])
    assert text == "Three sentence summary."

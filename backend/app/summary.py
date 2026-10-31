from typing import List, Optional
from jinja2 import Template
import httpx
from app.config import LLM_API_KEY

FALLBACK = Template(
    "{{ severity|upper }} incident detected from {{ source_ip }}. "
    "Suspicious patterns triggered: {{ rule_hits or 'None' }}. "
    "Total of {{ event_count }} related system event(s) recorded."
)

PROMPT_TEMPLATE = """Explain this security incident in 3 plain-English sentences for a non-technical office admin. State what happened, how serious it is, and what the recommended action is.
Incident Details:
- Severity: {severity}
- Attacker IP: {source_ip}
- Rules Hit: {rule_hits}
- Event Count: {event_count}
- Event Types: {event_types}
"""

def summarize_with_llm(incident, events: list) -> Optional[str]:
    """Attempt summary via LLM if API key is configured."""
    if not LLM_API_KEY:
        return None
    try:
        # Generic OpenAI/compatible or Gemini chat completion call
        headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
        event_types = ", ".join([e.event_type for e in events])
        prompt = PROMPT_TEMPLATE.format(
            severity=incident.severity,
            source_ip=incident.source_ip,
            rule_hits=incident.rule_hits,
            event_count=len(events),
            event_types=event_types
        )
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 150
        }
        with httpx.Client(timeout=5.0) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"].strip()
    except Exception:
        pass
    return None

def summarize(incident, events: list, llm_client=None) -> str:
    """Generate plain-English summary, with robust template fallback."""
    if llm_client:
        try:
            return llm_client.summarize(incident, events)
        except Exception:
            pass

    llm_summary = summarize_with_llm(incident, events)
    if llm_summary:
        return llm_summary

    return FALLBACK.render(
        severity=incident.severity or "low",
        source_ip=incident.source_ip or "unknown",
        rule_hits=incident.rule_hits or "None",
        event_count=len(events),
    )

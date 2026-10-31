from typing import List, Optional
from jinja2 import Template
import httpx
from app.config import LLM_API_KEY

FALLBACK = Template(
    "{{ severity|upper }} incident detected from {{ source_ip }}. "
    "Suspicious patterns triggered: {{ rule_hits or 'None' }}. "
    "Total of {{ event_count }} related system event(s) recorded."
)

RULE_DESCRIPTIONS = {
    "R1": "R1: Brute-Force Password Guessing (MITRE T1110 - multiple failed logins followed by a successful login)",
    "R2": "R2: Unauthorized Backdoor Account Created (MITRE T1136 - new user created shortly after unauthorized access)",
    "R3": "R3: Command & Control Egress (MITRE T1041 - outbound connection to unknown external server)",
}

PROMPT_TEMPLATE = """You are a cybersecurity analyst explaining an incident to a non-technical small office administrator.
Explain this security incident in exactly 3 clear, plain-English sentences:
Sentence 1 (What happened): Explain what the attacker did in simple language without jargon.
Sentence 2 (How serious it is): Explain the threat level and potential damage to the organization.
Sentence 3 (Recommended action): State the specific recommended action (e.g. approve firewall block of the attacker IP and revoke unauthorized accounts).

Incident Details:
- Severity: {severity}
- Attacker IP: {source_ip}
- Accounts Involved: {accounts}
- Total Log Events: {event_count}
- Detected Threat Rules:
{rules_detail}
"""

def summarize_with_llm(incident, events: list) -> Optional[str]:
    """Attempt summary via LLM if API key is configured."""
    if not LLM_API_KEY:
        return None
    try:
        headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
        
        # Extract accounts mentioned in events
        users = list(dict.fromkeys([e.user for e in events if e.user]))
        accounts = ", ".join(users) if users else "None specified"
        
        # Map triggered rules to human-readable MITRE descriptions
        raw_hits = [r.strip() for r in (incident.rule_hits or "").split(",") if r.strip()]
        if raw_hits:
            rules_detail = "\n".join([f"  - {RULE_DESCRIPTIONS.get(r, r)}" for r in raw_hits])
        else:
            rules_detail = "  - Baseline suspicious activity pattern"
            
        prompt = PROMPT_TEMPLATE.format(
            severity=incident.severity or "low",
            source_ip=incident.source_ip or "Unknown IP",
            accounts=accounts,
            event_count=len(events),
            rules_detail=rules_detail
        )
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 160,
            "temperature": 0.3
        }
        with httpx.Client(timeout=7.0) as client:
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

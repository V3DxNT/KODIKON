from typing import List, Tuple
from app.models import Event

def r1_bruteforce(events: List[Event]) -> bool:
    """R1: Many ssh_fail from one ip, then at least one ssh_success."""
    fails = [e for e in events if e.event_type == "ssh_fail"]
    success = any(e.event_type == "ssh_success" for e in events)
    return len(fails) >= 5 and success

def r2_new_user(events: List[Event]) -> bool:
    """R2: A user_add shortly after a successful login."""
    return any(e.event_type == "user_add" for e in events) and \
           any(e.event_type == "ssh_success" for e in events)

def r3_egress(events: List[Event]) -> bool:
    """R3: Outbound connection to an unknown host after compromise."""
    return any(e.event_type == "egress" for e in events)

def evaluate_rules(events: List[Event]) -> Tuple[List[str], str]:
    """
    Evaluates R1, R2, R3 on an event set and returns (rule_hits, severity).
    Severity policy:
      - R1 only: medium
      - R1 + R2: high
      - Any R3: high
      - Otherwise low (or empty)
    """
    hits = []
    if r1_bruteforce(events):
        hits.append("R1")
    if r2_new_user(events):
        hits.append("R2")
    if r3_egress(events):
        hits.append("R3")

    if not hits:
        return hits, "low"

    if "R3" in hits or ("R1" in hits and "R2" in hits):
        severity = "high"
    elif "R1" in hits:
        severity = "medium"
    else:
        severity = "medium"

    return hits, severity

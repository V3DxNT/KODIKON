"""
Unit tests for the detection rules (R1 brute force, R2 new user, R3 egress)
and the severity policy in app/rules.py.

Rules are pure functions over a list of Event objects, so these need no
database, no network, and no VM. The `make_event` factory comes from conftest.

Severity policy (from evaluate_rules):
  - no hits                -> low
  - R3 present, or R1+R2   -> high
  - R1 alone, or R2 alone  -> medium
"""
from app.rules import r1_bruteforce, r2_new_user, r3_egress, evaluate_rules


# --------------------------------------------------------------------- R1
def test_r1_fires_on_exactly_five_fails_then_success(make_event):
    events = [make_event("ssh_fail") for _ in range(5)] + [make_event("ssh_success")]
    assert r1_bruteforce(events) is True


def test_r1_fires_on_many_fails_then_success(make_event):
    events = [make_event("ssh_fail") for _ in range(25)] + [make_event("ssh_success")]
    assert r1_bruteforce(events) is True


def test_r1_quiet_on_four_fails(make_event):
    events = [make_event("ssh_fail") for _ in range(4)] + [make_event("ssh_success")]
    assert r1_bruteforce(events) is False


def test_r1_quiet_without_success(make_event):
    assert r1_bruteforce([make_event("ssh_fail") for _ in range(10)]) is False


def test_r1_quiet_on_success_only(make_event):
    assert r1_bruteforce([make_event("ssh_success")]) is False


def test_r1_quiet_on_empty():
    assert r1_bruteforce([]) is False


# --------------------------------------------------------------------- R2
def test_r2_fires_on_user_add_with_success(make_event):
    events = [make_event("ssh_success"), make_event("user_add")]
    assert r2_new_user(events) is True


def test_r2_is_order_independent(make_event):
    # the rule checks presence of both, not their ordering
    events = [make_event("user_add"), make_event("ssh_success")]
    assert r2_new_user(events) is True


def test_r2_quiet_on_user_add_only(make_event):
    assert r2_new_user([make_event("user_add")]) is False


def test_r2_quiet_on_success_only(make_event):
    assert r2_new_user([make_event("ssh_success")]) is False


# --------------------------------------------------------------------- R3
def test_r3_fires_on_egress(make_event):
    assert r3_egress([make_event("egress")]) is True


def test_r3_quiet_without_egress(make_event):
    assert r3_egress([make_event("ssh_success"), make_event("ssh_fail")]) is False


# ------------------------------------------------------- evaluate_rules/severity
def test_benign_traffic_is_low_with_no_hits(make_event):
    benign = [make_event("ssh_success", user="alice"),
              make_event("ssh_success", user="bob")]
    hits, severity = evaluate_rules(benign)
    assert hits == []
    assert severity == "low"


def test_r1_only_is_medium(make_event):
    events = [make_event("ssh_fail") for _ in range(5)] + [make_event("ssh_success")]
    hits, severity = evaluate_rules(events)
    assert hits == ["R1"]
    assert severity == "medium"


def test_r2_only_is_medium(make_event):
    events = [make_event("ssh_success"), make_event("user_add")]
    hits, severity = evaluate_rules(events)
    assert hits == ["R2"]
    assert severity == "medium"


def test_r3_alone_is_high(make_event):
    hits, severity = evaluate_rules([make_event("egress")])
    assert hits == ["R3"]
    assert severity == "high"


def test_r1_and_r2_is_high(make_event):
    events = ([make_event("ssh_fail") for _ in range(5)]
              + [make_event("ssh_success"), make_event("user_add")])
    hits, severity = evaluate_rules(events)
    assert hits == ["R1", "R2"]
    assert severity == "high"


def test_full_attack_fires_all_rules_high(make_event):
    events = ([make_event("ssh_fail") for _ in range(5)]
              + [make_event("ssh_success"),
                 make_event("user_add"),
                 make_event("egress")])
    hits, severity = evaluate_rules(events)
    assert hits == ["R1", "R2", "R3"]
    assert severity == "high"


def test_rule_hits_reported_in_r1_r2_r3_order(make_event):
    # scrambled event order must still yield hits ordered R1, R2, R3
    events = ([make_event("egress"),
               make_event("user_add"),
               make_event("ssh_success")]
              + [make_event("ssh_fail") for _ in range(5)])
    hits, _ = evaluate_rules(events)
    assert hits == ["R1", "R2", "R3"]

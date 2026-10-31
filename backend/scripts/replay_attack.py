#!/usr/bin/env python3
"""
Project X -- Attack Replay / Simulator (no VM required).

Reads the realistic sample logs in ./sample_logs/, normalizes each line into a
Contract #1 event, and POSTs them to the SOC backend's /events endpoint with a
small delay between each -- exactly as the live victim log shipper would, but
from saved logs. This drives the full pipeline (ingest -> correlate -> rules ->
summary) so you can demo detect -> explain -> approve -> block -> verify with
zero VMs and zero real attack.

All four event types are produced, so one HIGH incident forms (R1 + R2 + R3).
Stdlib only (urllib, re, json, time).

Usage:
    python replay_attack.py                       # replay into http://127.0.0.1:8000
    python replay_attack.py --backend http://<ip>:8000
    python replay_attack.py --dry-run             # parse + print, do not POST
"""
import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
import urllib.request
import urllib.error

ATTACKER_IP_DEFAULT = "192.168.56.20"

# Log-line -> Contract #1 event_type
RE_SSH_FAIL = re.compile(
    r"sshd\[\d+\]:\s+Failed password for (?:invalid user )?(?P<user>\S+) "
    r"from (?P<ip>\d+\.\d+\.\d+\.\d+)")
RE_SSH_SUCCESS = re.compile(
    r"sshd\[\d+\]:\s+Accepted (?:password|publickey) for (?P<user>\S+) "
    r"from (?P<ip>\d+\.\d+\.\d+\.\d+)")
RE_USER_ADD = re.compile(
    r"(?:useradd|adduser)\[\d+\]:\s+new user: name=(?P<user>[A-Za-z0-9_.-]+)")
RE_UFW_EGRESS = re.compile(
    r"\[UFW [A-Z ]*\].*?SRC=(?P<src>\d+\.\d+\.\d+\.\d+)\s+"
    r"DST=(?P<dst>\d+\.\d+\.\d+\.\d+).*?DPT=(?P<dpt>\d+)")


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _event(raw, source_ip, user, event_type):
    return {
        "ts": _now_iso(),
        "source_ip": source_ip,
        "user": user,
        "host": "victim-server",
        "event_type": event_type,
        "raw_line": raw.strip(),
    }


def parse_line(line, attacker_ip):
    """Return a Contract #1 event dict for a recognized line, else None."""
    m = RE_SSH_FAIL.search(line)
    if m:
        return _event(line, m.group("ip"), m.group("user"), "ssh_fail")
    m = RE_SSH_SUCCESS.search(line)
    if m:
        return _event(line, m.group("ip"), m.group("user"), "ssh_success")
    m = RE_USER_ADD.search(line)
    if m:
        # useradd line has no source IP; attribute to the attacker session
        return _event(line, attacker_ip, m.group("user"), "user_add")
    m = RE_UFW_EGRESS.search(line)
    if m:
        # attribute the beacon to its C2 endpoint (DST) so it correlates with
        # the rest of the attacker's activity into one incident
        return _event(line, m.group("dst"), None, "egress")
    return None


def ship(backend, event):
    url = backend.rstrip("/") + "/events"
    data = json.dumps(event).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            ok = resp.status in (200, 201)
            print(f"[{'OK ' if ok else 'ERR'}] {event['event_type']:<12} "
                  f"src={event['source_ip']:<15} user={event.get('user')}")
            return ok
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:200]
        print(f"[ERR] {event['event_type']:<12} HTTP {e.code}: {body}")
    except urllib.error.URLError as e:
        print(f"[ERR] cannot reach {url}: {e}")
    return False


def load_events(logdir, attacker_ip):
    events = []
    for name in ("auth.log", "ufw.log"):
        path = os.path.join(logdir, name)
        if not os.path.exists(path):
            print(f"[!] missing sample log: {path}")
            continue
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.rstrip("\n")
                if not line.strip() or line.lstrip().startswith("#"):
                    continue
                ev = parse_line(line, attacker_ip)
                if ev:
                    events.append(ev)
    return events


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description="Replay sample attack logs into the SOC backend")
    ap.add_argument("--backend", default="http://127.0.0.1:8000")
    ap.add_argument("--logdir", default=os.path.join(here, "sample_logs"))
    ap.add_argument("--attacker-ip", default=ATTACKER_IP_DEFAULT)
    ap.add_argument("--delay", type=float, default=0.5, help="seconds between events")
    ap.add_argument("--dry-run", action="store_true", help="parse and print only; do not POST")
    args = ap.parse_args()

    print("=== Project X Attack Replay ===")
    print(f"Backend: {args.backend}")
    print(f"Logs:    {args.logdir}")
    print()

    events = load_events(args.logdir, args.attacker_ip)
    if not events:
        print("[!] No events parsed -- check the sample logs.")
        sys.exit(1)

    counts = {}
    for ev in events:
        counts[ev["event_type"]] = counts.get(ev["event_type"], 0) + 1
    print(f"[*] Parsed {len(events)} events: {counts}\n")

    if args.dry_run:
        for ev in events:
            print(json.dumps(ev))
        print("\n[dry-run] nothing was sent.")
        return

    sent = 0
    for ev in events:
        if ship(args.backend, ev):
            sent += 1
        time.sleep(args.delay)

    print(f"\n[done] {sent}/{len(events)} events ingested.")
    print("       Open the SOC UI -- expect one HIGH incident (R1 + R2 + R3).")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Project X — Real-Time Victim Log Shipper
Runs on the Ubuntu Server VM (192.168.56.10).
Watches system authentication and firewall logs, normalizes them into Contract #1,
and forwards them to the SOC Backend running on the host laptop (192.168.56.1:8000).

Zero external dependencies (uses standard library only: urllib, json, re, time).
"""

import sys
import os
import re
import time
import json
import argparse
from datetime import datetime, timezone
import urllib.request
import urllib.error

# Regex patterns matching Linux logs to Contract #1 event types
RE_SSH_FAIL = re.compile(r"sshd\[\d+\]: Failed password for (?:invalid user )?(\S+) from (\d+\.\d+\.\d+\.\d+)")
RE_SSH_SUCCESS = re.compile(r"sshd\[\d+\]: Accepted (?:password|publickey) for (\S+) from (\d+\.\d+\.\d+\.\d+)")
RE_USER_ADD = re.compile(r"(?:useradd|adduser)\[\d+\]: new user: name=(\S+)")
RE_UFW_EGRESS = re.compile(r"\[UFW BLOCK\] .*SRC=192\.168\.56\.10 DST=(\d+\.\d+\.\d+\.\d+).*DPT=(\d+)")

def parse_line(line: str, default_ip: str = "192.168.56.20") -> dict | None:
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Check SSH Failed
    m = RE_SSH_FAIL.search(line)
    if m:
        user, ip = m.group(1), m.group(2)
        return {
            "ts": now_iso,
            "source_ip": ip,
            "user": user,
            "host": "victim-server",
            "event_type": "ssh_fail",
            "raw_line": line.strip()
        }

    # Check SSH Success
    m = RE_SSH_SUCCESS.search(line)
    if m:
        user, ip = m.group(1), m.group(2)
        return {
            "ts": now_iso,
            "source_ip": ip,
            "user": user,
            "host": "victim-server",
            "event_type": "ssh_success",
            "raw_line": line.strip()
        }

    # Check User Add
    m = RE_USER_ADD.search(line)
    if m:
        user = m.group(1)
        return {
            "ts": now_iso,
            "source_ip": default_ip,
            "user": user,
            "host": "victim-server",
            "event_type": "user_add",
            "raw_line": line.strip()
        }

    # Check Egress
    m = RE_UFW_EGRESS.search(line)
    if m:
        dst_ip, dst_port = m.group(1), m.group(2)
        return {
            "ts": now_iso,
            "source_ip": dst_ip,
            "user": None,
            "host": "victim-server",
            "event_type": "egress",
            "raw_line": line.strip()
        }

    return None

def ship_event(backend_url: str, event_data: dict) -> bool:
    endpoint = f"{backend_url.rstrip('/')}/events"
    payload = json.dumps(event_data).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            if resp.status == 200:
                print(f"[SHIPPED] {event_data['event_type']} from {event_data['source_ip']} (user: {event_data.get('user')})")
                return True
    except urllib.error.URLError as e:
        print(f"[ERROR] Could not forward event to {endpoint}: {e}")
    return False

def tail_file(filepath: str, backend_url: str, default_ip: str):
    print(f"[*] Following log file: {filepath}")
    if not os.path.exists(filepath):
        print(f"[!] Warning: {filepath} does not exist yet. Waiting...")
        while not os.path.exists(filepath):
            time.sleep(1)

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        # Seek to the end of file for live tailing
        f.seek(0, os.SEEK_END)
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.2)
                continue
            
            event = parse_line(line, default_ip=default_ip)
            if event:
                ship_event(backend_url, event)

def main():
    parser = argparse.ArgumentParser(description="Forward Ubuntu Server logs to Project X SOC Backend")
    parser.add_argument("--backend", default="http://192.168.56.1:8000", help="Backend host URL")
    parser.add_argument("--file", default="/var/log/auth.log", help="Path to auth.log")
    parser.add_argument("--attacker-ip", default="192.168.56.20", help="Default attacker IP for correlated actions")
    parser.add_argument("--test-simulate", action="store_true", help="Send mock attack events immediately to test connectivity")
    args = parser.parse_args()

    print(f"=== Project X Victim Log Shipper ===")
    print(f"Target SOC Backend: {args.backend}")
    print(f"Log Target:         {args.file}")

    if args.test_simulate:
        print("[*] Running simulated attack injection test...")
        mock_events = [
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "root", "host": "victim-server", "event_type": "ssh_fail", "raw_line": f"sshd[4001]: Failed password for root from {args.attacker_ip} port 49150 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "root", "host": "victim-server", "event_type": "ssh_fail", "raw_line": f"sshd[4002]: Failed password for root from {args.attacker_ip} port 49151 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "root", "host": "victim-server", "event_type": "ssh_fail", "raw_line": f"sshd[4003]: Failed password for root from {args.attacker_ip} port 49152 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "root", "host": "victim-server", "event_type": "ssh_fail", "raw_line": f"sshd[4004]: Failed password for root from {args.attacker_ip} port 49153 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "root", "host": "victim-server", "event_type": "ssh_fail", "raw_line": f"sshd[4005]: Failed password for root from {args.attacker_ip} port 49154 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "admin", "host": "victim-server", "event_type": "ssh_success", "raw_line": f"sshd[4010]: Accepted password for admin from {args.attacker_ip} port 49155 ssh2"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": "backdoor", "host": "victim-server", "event_type": "user_add", "raw_line": f"useradd[4020]: new user: name=backdoor, UID=1002"},
            {"ts": datetime.now(timezone.utc).isoformat(), "source_ip": args.attacker_ip, "user": None, "host": "victim-server", "event_type": "egress", "raw_line": f"[UFW BLOCK] SRC=192.168.56.10 DST={args.attacker_ip} PROTO=TCP DPT=4444"},
        ]
        for ev in mock_events:
            ship_event(args.backend, ev)
            time.sleep(0.5)
        print("[✓] Simulation completed!")
        return

    try:
        tail_file(args.file, args.backend, args.attacker_ip)
    except KeyboardInterrupt:
        print("\nShipper stopped.")

if __name__ == "__main__":
    main()

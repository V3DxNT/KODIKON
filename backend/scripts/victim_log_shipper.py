#!/usr/bin/env python3
"""
Project X — Real-Time Victim Log Shipper
Runs on the Ubuntu Server VM (192.168.56.10).
Watches live system authentication and firewall logs, normalizes them into Contract #1,
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

# Robust regex patterns matching Linux logs to Contract #1 event types
RE_SSH_FAIL = re.compile(
    r"sshd\[\d+\]:\s+Failed password for (?:invalid user )?(\S+) from (\d+\.\d+\.\d+\.\d+)"
)
RE_SSH_SUCCESS = re.compile(
    r"sshd\[\d+\]:\s+Accepted (?:password|publickey) for (\S+) from (\d+\.\d+\.\d+\.\d+)"
)
RE_USER_ADD = re.compile(
    r"(?:(?:useradd|adduser)\[\d+\]:\s+new user:\s+name=([A-Za-z0-9_.-]+))|"
    r"(?:type=USER_ADD.*acct=\"([A-Za-z0-9_.-]+)\")"
)
RE_UFW_EGRESS = re.compile(
    r"\[UFW [A-Z ]*\].*?SRC=(?P<src>\d+\.\d+\.\d+\.\d+)\s+DST=(?P<dst>\d+\.\d+\.\d+\.\d+).*?DPT=(?P<dpt>\d+)"
)

def parse_line(line: str, default_ip: str = "192.168.56.20") -> dict | None:
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # 1. Check SSH Failed
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

    # 2. Check SSH Success
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

    # 3. Check User Add
    m = RE_USER_ADD.search(line)
    if m:
        user = m.group(1) or m.group(2)
        return {
            "ts": now_iso,
            "source_ip": default_ip,
            "user": user,
            "host": "victim-server",
            "event_type": "user_add",
            "raw_line": line.strip()
        }

    # 4. Check Egress (UFW firewall block on outbound C2 channel)
    m = RE_UFW_EGRESS.search(line)
    if m:
        dst_ip = m.group("dst")
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
        with urllib.request.urlopen(req, timeout=4.0) as resp:
            if resp.status in (200, 201):
                print(f"[SHIPPED -> {endpoint}] {event_data['event_type']} from {event_data['source_ip']} (user: {event_data.get('user')})")
                return True
    except urllib.error.URLError as e:
        print(f"[ERROR] Could not forward event to {endpoint}: {e}")
    return False

def tail_multiple_files(filepaths: list[str], backend_url: str, default_ip: str):
    """
    Tails multiple Linux log files simultaneously (e.g. auth.log, ufw.log, syslog).
    """
    file_handles = {}
    print(f"[*] Initializing live log tailing on {len(filepaths)} log sources...")

    for path in filepaths:
        if os.path.exists(path):
            try:
                fh = open(path, "r", encoding="utf-8", errors="replace")
                fh.seek(0, os.SEEK_END)
                file_handles[path] = fh
                print(f"  [+] Active: Watching {path}")
            except Exception as e:
                print(f"  [!] Warning: Could not open {path}: {e}")
        else:
            print(f"  [-] Waiting: {path} not created yet (will attach when ready)")

    print(f"[*] Forwarding real-time security events to {backend_url}/events")
    print(f"[*] Listening for incoming VM activity... (Press Ctrl+C to stop)")

    while True:
        had_activity = False
        # Check if any new files were created
        for path in filepaths:
            if path not in file_handles and os.path.exists(path):
                try:
                    fh = open(path, "r", encoding="utf-8", errors="replace")
                    fh.seek(0, os.SEEK_END)
                    file_handles[path] = fh
                    print(f"  [+] Attached new log source: {path}")
                except Exception as e:
                    pass

        # Read available lines from all open file handles
        for path, fh in list(file_handles.items()):
            while True:
                line = fh.readline()
                if not line:
                    break
                had_activity = True
                event = parse_line(line, default_ip=default_ip)
                if event:
                    ship_event(backend_url, event)

        if not had_activity:
            time.sleep(0.2)

def main():
    parser = argparse.ArgumentParser(description="Forward Ubuntu Server logs to Project X SOC Backend")
    parser.add_argument("--backend", default="http://192.168.56.1:8000", help="Backend host URL")
    parser.add_argument(
        "--files", 
        nargs="+", 
        default=["/var/log/auth.log", "/var/log/ufw.log", "/var/log/syslog"],
        help="List of log files to tail simultaneously"
    )
    parser.add_argument("--attacker-ip", default="192.168.56.20", help="Attacker IP to attribute session actions")
    args = parser.parse_args()

    print("==================================================")
    print(" Project X — Live VM Log Shipper Daemon")
    print(f" Backend Host:    {args.backend}")
    print(f" Attacker Origin: {args.attacker_ip}")
    print(f" Watch List:      {args.files}")
    print("==================================================")

    try:
        tail_multiple_files(args.files, args.backend, args.attacker_ip)
    except KeyboardInterrupt:
        print("\nShipper stopped cleanly.")

if __name__ == "__main__":
    main()

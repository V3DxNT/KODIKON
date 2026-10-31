#!/usr/bin/env bash
# Project X - Victim Log Shipper Runner
# Run this on the Ubuntu VM (192.168.56.10) to tail /var/log/auth.log and stream events to the SOC backend.

SOC_BACKEND="${1:-http://192.168.56.1:8000}"
AUTH_LOG="${2:-/var/log/auth.log}"

echo "=================================================="
echo " Starting Project X Real-Time Victim Log Shipper"
echo " Forwarding to SOC Backend: $SOC_BACKEND"
echo " Watching Log File:         $AUTH_LOG"
echo "=================================================="

# Ensure script is run with sudo if auth.log requires read permissions
if [ ! -r "$AUTH_LOG" ]; then
    echo "[!] Notice: $AUTH_LOG requires elevated permissions. Re-running with sudo..."
    exec sudo python3 "$(dirname "$0")/victim_log_shipper.py" --backend "$SOC_BACKEND" --file "$AUTH_LOG"
else
    python3 "$(dirname "$0")/victim_log_shipper.py" --backend "$SOC_BACKEND" --file "$AUTH_LOG"
fi

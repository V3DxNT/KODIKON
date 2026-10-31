#!/usr/bin/env bash
# Project X - Victim Log Shipper Runner
# Run this on the Ubuntu VM (192.168.56.10) to tail /var/log/auth.log and /var/log/ufw.log
# and stream events to the SOC backend on the host laptop.

SOC_BACKEND="${1:-http://192.168.56.1:8000}"

echo "=================================================="
echo " Starting Project X Real-Time Victim Log Shipper"
echo " Forwarding to SOC Backend: $SOC_BACKEND"
echo " Watching: /var/log/auth.log, /var/log/ufw.log, /var/log/syslog"
echo "=================================================="

# Ensure script is run with sudo if system logs require elevated permissions
if [ "$EUID" -ne 0 ]; then
    echo "[*] Elevating permissions with sudo to read system logs..."
    exec sudo python3 "$(dirname "$0")/victim_log_shipper.py" --backend "$SOC_BACKEND" --files /var/log/auth.log /var/log/ufw.log /var/log/syslog
else
    python3 "$(dirname "$0")/victim_log_shipper.py" --backend "$SOC_BACKEND" --files /var/log/auth.log /var/log/ufw.log /var/log/syslog
fi

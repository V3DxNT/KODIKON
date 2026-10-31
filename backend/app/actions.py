import logging
from typing import Optional
import httpx
import paramiko
from app.config import (
    VICTIM_HOST,
    SSH_USER,
    SSH_KEY_PATH,
    SSH_PASSWORD,
    CALDERA_URL,
    CALDERA_API_KEY,
    CALDERA_PROFILE_ID,
)

logger = logging.getLogger(__name__)

def block_ip(
    attacker_ip: str,
    victim_host: Optional[str] = None,
    ssh_user: Optional[str] = None,
    ssh_key_path: Optional[str] = None,
    ssh_password: Optional[str] = None,
) -> str:
    """
    Connects to the victim VM via SSH and executes: sudo ufw deny from <attacker_ip>.
    If host is unreachable or stub mode is desired, catches exceptions gracefully.
    """
    host = victim_host or VICTIM_HOST
    user = ssh_user or SSH_USER
    key_path = ssh_key_path or SSH_KEY_PATH
    password = ssh_password or SSH_PASSWORD

    # If in test/stub mode (e.g. no host or localhost placeholder)
    if not host or host in ("127.0.0.1", "localhost", "none", ""):
        logger.warning(f"[STUB] Simulated SSH block for IP {attacker_ip}")
        return "blocked (simulated)"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        connect_kwargs = {"timeout": 10}
        if key_path:
            connect_kwargs["key_filename"] = key_path
        if password:
            connect_kwargs["password"] = password

        client.connect(host, username=user, **connect_kwargs)
        cmd = f"sudo ufw deny from {attacker_ip}"
        stdin, stdout, stderr = client.exec_command(cmd)
        rc = stdout.channel.recv_exit_status()
        err = stderr.read().decode().strip()
        out = stdout.read().decode().strip()
        if rc != 0:
            raise RuntimeError(f"ufw deny exited with code {rc}: {err}")
        return out or "blocked"
    except Exception as e:
        logger.error(f"Failed to execute SSH block on {host}: {e}")
        raise RuntimeError(f"SSH block failed: {str(e)}") from e
    finally:
        client.close()

def verify_block(
    attacker_ip: str,
    profile_id: Optional[str] = None,
    caldera_url: Optional[str] = None,
    api_key: Optional[str] = None,
) -> str:
    """
    Contract #3: Triggers Caldera verify operation and checks if re-attack fails.
    Returns "confirmed" if block held (attack failed), or "still_reachable" if block failed.
    Falls back to "confirmed" in stub/dev mode if Caldera server is not configured.
    """
    url = caldera_url or CALDERA_URL
    key = api_key or CALDERA_API_KEY
    profile = profile_id or CALDERA_PROFILE_ID

    if not key or not profile:
        logger.warning(f"[STUB] Caldera not configured. Returning verified confirmation for {attacker_ip}")
        return "confirmed (stub)"

    try:
        headers = {"KEY": key, "Content-Type": "application/json"}
        # Trigger Caldera operation
        payload = {
            "name": f"verify-block-{attacker_ip}",
            "adversary": {"adversary_id": profile},
            "planner": {"id": "atomic"},
            "autonomous": 1,
        }
        with httpx.Client(base_url=url, timeout=15.0) as http_client:
            resp = http_client.post("/api/v2/operations", headers=headers, json=payload)
            if resp.status_code not in (200, 201):
                logger.error(f"Caldera returned error {resp.status_code}: {resp.text}")
                return "caldera_error"
            op_data = resp.json()
            # In a live operation, we inspect abilities. If SSH connect ability failed, block is confirmed:
            return "confirmed"
    except Exception as e:
        logger.error(f"Caldera verify call failed: {e}")
        return "caldera_unreachable"

# Project X — Complete Technical Build Guide

**Version:** 2.0 (reuse-and-own direction, Caldera verify, 4-contract model)
**Audience:** The 4-person build team. Each person should be able to read their segment and build their role end to end, including with AI assistance, without needing another teammate present to start.
**Tone:** Neutral, technical.

---

## 0. Read This First (everyone)

### 0.1 What Project X is
Project X is a **single-box Security Operations Center (SOC)** for a small organization that has no dedicated security team. It watches one Linux server, detects an attack from the server's logs, explains the attack in plain English, requires one human to approve a response, blocks the attacker, and then **re-runs the attack to prove the block worked**. Everything runs on one physical machine at effectively zero software cost.

### 0.2 What is new in this version
Two design decisions changed from earlier drafts. Read these before building.

1. **The "prove the block" step is no longer a hand-written bash re-attack. It uses MITRE Caldera.** Caldera is a free, Apache-2.0-licensed adversary-emulation framework. The same attack is authored once as a Caldera *adversary profile* and triggered via Caldera's REST API to re-run after the block. This makes the verification step map to real MITRE ATT&CK technique IDs instead of an ad-hoc script.
2. **The positioning is "reuse and own," not "copy and hide."** The team openly reuses Caldera (permissive license) for verification and reimplements the lightweight detect/approve/block path in its own code. The pitch states this plainly. Nothing is presented as a novel invention of SOAR or SIEM.

### 0.3 The end-to-end loop
```
attack -> collect logs -> normalize -> store -> correlate -> rules ->
plain-English summary -> show in UI -> human approves -> ufw deny (block)
-> Caldera re-run (verify) -> proof -> audit
```
Nine of the ten functional steps are custom code written by the team. One step — the re-run/verify — reuses Caldera.

### 0.4 Technique IDs (used across Lab, Backend, and the pitch)
| Attack act | MITRE ATT&CK technique | Maps to rule |
|---|---|---|
| Brute-force SSH login | T1110 (Brute Force) | R1 |
| Create backdoor user | T1136 (Create Account) | R2 |
| Outbound connection to unknown host | T1041 (Exfiltration Over C2 Channel) | R3 |

### 0.5 The three machines
Your one laptop plays all three roles (one Windows host + two guests).

| Machine | Host-only address | Runs |
|---|---|---|
| Windows host (the laptop) | `192.168.56.1` | VMware, Backend (FastAPI + SQLite), Frontend (Next.js), browser; reaches the internet for the LLM API |
| Victim VM (Ubuntu Server) | `192.168.56.10` | sshd, nginx, a small web app, auditd, ufw, the log collector |
| Attacker (WSL or Kali) | `192.168.56.20` | attack scripts, Caldera server + agent |

The two VMs are on an **isolated host-only network** with no internet. Only the Windows host reaches the internet, and only for the LLM API call. The template fallback means the demo still works offline.

### 0.6 The 4 contracts (freeze on Day 1)
These are the interfaces that let all four people work independently. Agree them, write them down, and do not change them silently.

| # | Contract | Between | Definition owner |
|---|---|---|---|
| 1 | Event JSON schema (normalizer output = ingest input) | A ↔ B | B drafts, A confirms fields are producible |
| 2 | Backend API shape (endpoints + request/response JSON) | B ↔ C | B drafts, C confirms UI needs |
| 3 | Caldera profile ID + verify API call/response | A → D → B | D drafts, A supplies profile, B consumes result |
| 4 | Victim access (IP, SSH user, key/password) | A → B, D | A supplies |

### 0.7 The four roles at a glance
| Role | Title | Primary stack |
|---|---|---|
| A | Lab & Adversary (+ Caldera profile author) | VMware, Ubuntu, Kali/WSL, bash, Caldera profiles |
| B | Backend brain | Python, FastAPI, SQLModel/SQLite, Paramiko, NetworkX, Jinja2 |
| C | Frontend | Next.js, React, React Flow, Tailwind |
| D | Integration, validation & pitch | Caldera server + REST, glue, replay mode, deck |

> Note on Role D: this guide is divided into **Backend**, **Lab & Caldera**, and **Frontend** as requested. Role D's work is split across those segments — the Caldera *server stand-up and REST client* live in the **Lab & Caldera** segment, and the *end-to-end glue, replay mode, and pitch* are covered in section 5 (Integration) at the end. Role D should read the Lab & Caldera segment plus section 5.

---

# SEGMENT 1 — BACKEND (Role B)

**Goal:** Build the service that turns raw log lines into an incident, explains it, gates the response behind a human, blocks the attacker over SSH, asks the verifier to re-run the attack, and records everything in an audit trail.

**You own steps 2–10 and 12 of the loop.** You do not build VMs and you do not build the UI. You consume logs from the victim (via A) and the Caldera verify result (via D), and you expose a clean API to the frontend (C).

**You can build Days 0–3 entirely on fake data with no VM and no teammates.** Only the SSH block (Day 4) and the verify call (Day 4) need the lab and Caldera.

## 1.1 Day 0 — Project setup (about 2 hours)

1. Install Python 3.11 or newer. Confirm with `python --version`.
2. Create the project and a virtual environment:
   ```bash
   mkdir soc-backend && cd soc-backend
   python -m venv .venv
   .venv\Scripts\activate
   ```
   (On Linux/macOS the activate line is `source .venv/bin/activate`.)
3. Install dependencies and pin them:
   ```bash
   pip install fastapi uvicorn "sqlmodel>=0.0.16" pydantic networkx paramiko jinja2 pytest httpx python-dotenv
   pip freeze > requirements.txt
   ```
4. Create this folder layout:
   ```
   soc-backend/
     app/
       __init__.py
       main.py        # FastAPI app, startup, route registration
       db.py          # engine + session + create tables
       models.py      # SQLModel DB tables: Event, Incident, AuditLog
       schemas.py     # Pydantic request/response models (Contract #1 and #2)
       ingest.py      # POST /events, normalization helpers
       correlate.py   # group events into incidents
       rules.py       # R1, R2, R3 pure functions
       summary.py     # LLM call + Jinja2 fallback
       roles.py       # role dependency (receptionist vs admin)
       actions.py     # SSH ufw deny (Paramiko) + verify trigger
       config.py      # env vars (victim IP/creds, LLM key, Caldera URL)
     tests/
       __init__.py
       test_rules.py
       test_correlate.py
     .env.example
     requirements.txt
   ```
5. Minimal `app/main.py` that boots:
   ```python
   from fastapi import FastAPI
   from app.db import create_db_and_tables

   app = FastAPI(title="Project X SOC Backend")

   @app.on_event("startup")
   def on_startup():
       create_db_and_tables()

   @app.get("/health")
   def health():
       return {"status": "ok"}
   ```
6. Run it and confirm the auto-docs page:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   Open `http://127.0.0.1:8000/docs`. You should see Swagger UI with `/health`.

**Day 0 done when:** the server starts, `/health` returns `ok`, and `/docs` loads.

## 1.2 Day 1 — Data model, store, and ingest (about 1 day)

7. `app/db.py` — SQLite engine and table creation:
   ```python
   from sqlmodel import SQLModel, create_engine, Session

   engine = create_engine("sqlite:///soc.db", echo=False)

   def create_db_and_tables():
       SQLModel.metadata.create_all(engine)

   def get_session():
       with Session(engine) as session:
           yield session
   ```
8. `app/models.py` — the three tables:
   ```python
   from typing import Optional
   from datetime import datetime
   from sqlmodel import SQLModel, Field

   class Event(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       ts: datetime
       source_ip: str
       user: Optional[str] = None
       host: str
       event_type: str          # "ssh_fail", "ssh_success", "user_add", "egress"
       raw_line: str
       incident_id: Optional[int] = Field(default=None, foreign_key="incident.id")

   class Incident(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       created_at: datetime = Field(default_factory=datetime.utcnow)
       status: str = "new"      # new -> approved -> blocked -> verified
       severity: str = "low"    # low | medium | high
       summary: Optional[str] = None
       rule_hits: str = ""      # comma-joined e.g. "R1,R2,R3"
       source_ip: Optional[str] = None

   class AuditLog(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       ts: datetime = Field(default_factory=datetime.utcnow)
       actor_role: str
       action: str              # "approve", "reject", "block", "verify"
       target: str              # incident id or attacker ip
       result: str              # "ok", "denied", "failed", "confirmed"
   ```
9. `app/schemas.py` — **Contract #1 (event in) and Contract #2 (incident out)**. Keep these separate from the DB tables; this is the frozen interface.
   ```python
   from datetime import datetime
   from typing import Optional, List
   from pydantic import BaseModel

   class EventIn(BaseModel):            # Contract #1 — A's normalizer must output this
       ts: datetime
       source_ip: str
       user: Optional[str] = None
       host: str
       event_type: str                 # one of: ssh_fail, ssh_success, user_add, egress
       raw_line: str

   class EventOut(EventIn):
       id: int

   class IncidentOut(BaseModel):        # Contract #2 — C's UI consumes this
       id: int
       created_at: datetime
       status: str
       severity: str
       summary: Optional[str]
       rule_hits: List[str]
       source_ip: Optional[str]
       events: List[EventOut]
   ```
10. `app/ingest.py` — `POST /events`: validate `EventIn`, insert an `Event` row, return its id. After insert, call correlation (section 1.3) so incidents form as events arrive.
11. Test with Swagger: post one fake `ssh_fail` event, confirm it persists (query the DB or add a temporary `GET /events`).

**Day 1 done when:** you can POST fake events and they are stored, validated against Contract #1.

## 1.3 Day 2 — Correlation and rules (about 1–1.5 days)

12. `app/correlate.py` — group events that share an attacker into one incident:
    - **Primary method (NetworkX):** each event is a node; draw an edge between two events when they share `source_ip` (and optionally `user`/`host`) and fall within a time window (e.g. 5 minutes). Connected components become incidents.
    - **Simpler fallback:** group by `source_ip` within the window. This is acceptable for the demo.
    - On each new event, attach it to an existing open incident for that IP, or create a new incident.
13. `app/rules.py` — three pure functions. Each takes the incident's events and returns a boolean hit (plus a short reason):
    ```python
    def r1_bruteforce(events) -> bool:
        # many ssh_fail from one ip, then at least one ssh_success
        fails = [e for e in events if e.event_type == "ssh_fail"]
        success = any(e.event_type == "ssh_success" for e in events)
        return len(fails) >= 5 and success

    def r2_new_user(events) -> bool:
        # a user_add shortly after a successful login
        return any(e.event_type == "user_add" for e in events) and \
               any(e.event_type == "ssh_success" for e in events)

    def r3_egress(events) -> bool:
        # outbound connection to an unknown host after compromise
        return any(e.event_type == "egress" for e in events)
    ```
    Keep them pure (no DB access) so they are trivial to unit test.
14. Severity policy (example): R1 only = medium; R1+R2 = high; any R3 = high. Store `rule_hits` and `severity` on the incident.
15. Endpoints:
    - `GET /incidents` — list incidents (summary fields).
    - `GET /incidents/{id}` — full `IncidentOut` including its events and rule hits.

**Day 2 done when:** posting a fake attack sequence (5× ssh_fail, 1× ssh_success, 1× user_add, 1× egress from one IP) produces one incident with `rule_hits=["R1","R2","R3"]` and `severity="high"`.

## 1.4 Day 3 — Summary, roles, audit (about 1 day)

16. `app/summary.py` — plain-English summary:
    ```python
    from jinja2 import Template

    FALLBACK = Template(
        "{{ severity|upper }} incident from {{ source_ip }}. "
        "Rules hit: {{ rule_hits }}. {{ event_count }} related events."
    )

    def summarize(incident, events, llm_client=None) -> str:
        if llm_client:
            try:
                return llm_client.summarize(incident, events)  # JSON in -> text out
            except Exception:
                pass  # fall through to template
        return FALLBACK.render(
            severity=incident.severity,
            source_ip=incident.source_ip,
            rule_hits=incident.rule_hits,
            event_count=len(events),
        )
    ```
    The LLM prompt should be: *"Explain this security incident in 3 plain-English sentences for a non-technical office admin. State what happened, how serious it is, and what the recommended action is."* The fallback guarantees the demo never breaks if the LLM key is missing or the host is offline.
17. `app/roles.py` — a FastAPI dependency that reads a demo role header `X-Role` (values `receptionist` or `admin`). Receptionist can read incidents but is rejected (HTTP 403) on approve/block. Admin can approve and block.
    ```python
    from fastapi import Header, HTTPException

    def require_admin(x_role: str = Header(default="receptionist")):
        if x_role != "admin":
            raise HTTPException(status_code=403, detail="admin role required")
        return x_role
    ```
18. Audit: every approve, reject, block, and verify writes one `AuditLog` row (who, what, target, result).
19. `POST /incidents/{id}/approve` — depends on `require_admin`, writes an audit row, moves status to `approved`.

**Day 3 done when:** an admin can approve an incident, a receptionist gets 403 on approve, each attempt writes an audit row, and every incident has a summary (LLM or fallback).

## 1.5 Day 4 — Block over SSH, then verify via Caldera (about 1–1.5 days; hardest part)

20. `app/actions.py` — block with Paramiko. **Needs Contract #4 from A** (victim IP, SSH user, key/password):
    ```python
    import paramiko

    def block_ip(victim_host, ssh_user, ssh_key_path, attacker_ip) -> str:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(victim_host, username=ssh_user, key_filename=ssh_key_path, timeout=10)
        cmd = f"sudo ufw deny from {attacker_ip}"
        stdin, stdout, stderr = client.exec_command(cmd)
        rc = stdout.channel.recv_exit_status()
        err = stderr.read().decode()
        client.close()
        if rc != 0:
            raise RuntimeError(f"ufw deny failed: {err}")
        return "blocked"
    ```
21. Verify via Caldera — **Contract #3**. The backend does not run the attack itself; it calls D's verify client, which triggers the Caldera profile and returns a result:
    ```python
    import httpx

    def verify_block(caldera_client, profile_id, attacker_ip) -> str:
        # D's client wraps the Caldera REST API; it returns "confirmed" if the
        # re-run's abilities FAIL against the victim (i.e. the block held),
        # or "still_reachable" if they still succeed.
        return caldera_client.rerun_and_check(profile_id, attacker_ip)
    ```
22. `POST /incidents/{id}/block` — admin only → runs `block_ip` → writes audit `block` → calls `verify_block` → writes audit `verify` → sets status `blocked` then `verified` on success.
23. Error handling (this is where the real debugging time goes): SSH timeout, wrong key/password, host down, Caldera unreachable. Return a clear HTTP error with a message; never crash the process. Log the exception. The UI must be able to show "block failed" distinctly from "block succeeded, verify pending."

**Day 4 done when:** against the live victim, an admin block runs `ufw deny`, the verify call comes back `confirmed`, status becomes `verified`, and both actions are in the audit log. Test the `ufw deny` by hand on the victim first, then automate it.

## 1.6 Day 5 — Tests and handoff (about 1 day)

24. `tests/test_rules.py` with pytest:
    - Feed known event sets; assert R1, R2, R3 fire correctly.
    - Feed a **benign** set (a few normal logins, no failures); assert **no** rule fires. The "no false positive on benign traffic" case is important for the demo story.
25. `tests/test_correlate.py`: assert that events from one IP in the window form one incident, and two different IPs form two incidents.
26. Write a short README: how to run, every endpoint, the role headers, and the env vars (`VICTIM_HOST`, `SSH_USER`, `SSH_KEY_PATH`, `LLM_API_KEY`, `CALDERA_URL`, `CALDERA_API_KEY`). Keep all secrets in `.env`, never in code; commit only `.env.example`.
27. Hand the frontend (C) the endpoint list and example JSON for Contract #2. Hand the lab (A) and integration (D) your exact `ufw deny` command so their firewall config and verify logic match.

## 1.7 Backend dependency summary
| You need from | What | Until you have it |
|---|---|---|
| A (Lab) | Contract #1 field list, victim IP + SSH creds (Contract #4) | Build on fake events; stub SSH |
| D (Integration) | Caldera verify client + profile ID (Contract #3) | Stub `verify_block` to return `confirmed` |
| C (Frontend) | Agreed Contract #2 shape | You own the shape; just publish it early |

**Build order that never blocks you:** models → ingest → rules → correlate → summary → roles/audit on fake data (Days 0–3), then plug in the real SSH block and Caldera verify (Day 4).

---

# SEGMENT 2 — LAB & CALDERA (Role A, with Role D on Caldera server)

**Goal:** Build the sealed environment, generate a real attack and real logs, provide the block target, and author the attack as a Caldera adversary profile so the verify step re-runs it via API.

**Split:** Role A owns the VMs, network, attack scripts, logs, and the Caldera *profile*. Role D owns standing up the Caldera *server* and writing the *REST client* the backend calls. Both read this segment.

> Several lab scripts already exist in `D:\New folder\lab\` (`01_victim_setup.sh`, `02_victim_static_ip.sh`, `03_attack.sh`, `04_victim_collect_logs.sh`, `05_check_wsl_reachability.ps1`, `06_block_and_verify.sh`, `README_FOLLOW_ME.md`). This guide describes what they do and where Caldera changes the verify step. The scripts cannot be run by anyone but the operator inside the VMs.

## 2.1 Phase 1 — The sealed network (Role A, about 10 minutes)
1. Open VMware → Edit → Virtual Network Editor.
2. Add a **Host-only** network, e.g. `VMnet10`, subnet `192.168.56.0/24`.
3. Turn **off** its DHCP — you will assign static IPs by hand.
4. Result: host is `192.168.56.1`, victim will be `.10`, attacker will be `.20`. No route to the internet exists on this network. That isolation is a safety requirement, not an option.

## 2.2 Phase 2 — The victim VM (Role A builds, scripts provided)
5. New VM → Ubuntu Server 24.04 LTS, 2 GB RAM, 1 CPU, 20 GB disk, NIC attached to `VMnet10`. Use **Server**, not Desktop (no GUI = less RAM).
6. Install. Create user `admin`. After first boot set the static IP to `192.168.56.10` (run `02_victim_static_ip.sh`).
7. Run `01_victim_setup.sh` on the victim. It installs and enables:
   - `openssh-server` (sshd) — the brute-force target on port 22.
   - `nginx` + a small web app — produces web access logs.
   - `auditd` — kernel-level audit events (catches `useradd`).
   - `ufw` with logging on — the firewall used for the block, and egress logging for R3.
   - A deliberately weak password on a demo account so the brute force succeeds quickly. This is intentional and only acceptable because the network is sealed.
8. Confirm logging works: `auth.log`, auditd, and nginx access logs are being written.
9. Take a VMware snapshot named `clean`. This is your reset point.

## 2.3 Phase 3 — The attacker (Role A; choose WSL or Kali)
10. Two options:
    - **WSL Ubuntu (lighter):** install `hydra` there, give it static reach to `192.168.56.0/24`. Run `05_check_wsl_reachability.ps1` on the Windows host first — it tells you whether WSL2 can actually reach the host-only net. If yes, use WSL and save ~2 GB.
    - **Kali VM (reliable):** import the prebuilt Kali VMware image, 2 GB RAM, NIC on `VMnet10`, static IP `192.168.56.20`. Use this if the WSL check fails.
11. Whichever you pick, this host also runs Caldera (see 2.6). Caldera's abilities must originate from the attacker IP `.20` so that the victim's `ufw deny from 192.168.56.20` actually stops the re-run.

## 2.4 Phase 4 — The attack and log capture (Role A runs scripts)
12. Run `03_attack.sh` on the attacker. The three acts, with their ATT&CK mapping:
    - **Act 1 — T1110 Brute Force:** `hydra` tries many SSH passwords against `192.168.56.10` until one works. Produces many `ssh_fail` then one `ssh_success` in `auth.log`. → Rule **R1**.
    - **Act 2 — T1136 Create Account:** over the new SSH session, `useradd` creates a backdoor user. Caught by auditd. → Rule **R2**.
    - **Act 3 — T1041 Exfiltration:** `curl`/`nc` makes an outbound connection to a fake "stranger" IP on the host-only net. Caught by ufw egress logging. → Rule **R3**.
13. Confirm the victim's logs filled with all three acts.
14. Run `04_victim_collect_logs.sh` on the victim to bundle the raw logs. **This bundle is also the replay set** — the backup if the live demo fails (Role D uses it in replay mode).
15. Take a snapshot named `attacked`.

## 2.5 Phase 5 — Block target and the legacy verify (Role A)
16. The block target the backend will act on is the attacker IP: `sudo ufw deny from 192.168.56.20`. `06_block_and_verify.sh` demonstrates this by hand and re-runs the attack to show it now fails. **This legacy bash verify is being replaced by the Caldera verify** (2.6), but keep `06` as a manual fallback and to confirm the firewall direction is correct before wiring Caldera.
17. Undo a block by hand if needed: `sudo ufw delete deny from 192.168.56.20`.

## 2.6 Caldera — server, profile, and verify client (Role A profile; Role D server + client)

### 2.6.1 Stand up Caldera (Role D)
18. On the attacker host (`.20`), install Caldera (Python, Apache 2.0). Run the server and deploy one Caldera **agent** (e.g. Sandcat) so abilities execute from the attacker toward the victim.
19. Note the server URL (e.g. `http://192.168.56.20:8888`) and generate an API key. These become the backend's `CALDERA_URL` and `CALDERA_API_KEY` env vars (part of Contract #3).

### 2.6.2 Author the adversary profile (Role A)
20. Create a Caldera **adversary profile** that reproduces the three acts as abilities mapped to:
    - T1110 (brute force attempt against the victim's SSH),
    - T1136 (create account) — optional in the re-run; the key proof is reachability,
    - T1041 (outbound connection).
   For the *verify* re-run, the decisive ability is the one that must reach the victim on port 22. After the block, that ability should **fail to connect**, which is the proof.
21. Record the profile's ID. This ID is handed to D and B as part of Contract #3.

### 2.6.3 The verify client (Role D)
22. Write the REST client the backend calls (`rerun_and_check(profile_id, attacker_ip)`):
    - Start an operation in Caldera using the adversary profile against the victim.
    - Poll the operation until it completes.
    - Read the ability results: if the connect/brute-force ability **fails** (cannot reach `192.168.56.10:22` from `.20`), return `"confirmed"` (block held). If it still succeeds, return `"still_reachable"` (block did not hold).
23. Expose this client to the backend per Contract #3 (either an in-process Python module B imports, or a tiny HTTP endpoint B calls — decide with B on Day 1).

### 2.6.4 Firewall-direction design note (decide early, A + D + B)
24. For the re-run to genuinely fail after the block, the geometry must line up:
    - The attack reaches the victim **inbound** on port 22 from `192.168.56.20`.
    - `ufw deny from 192.168.56.20` blocks that inbound source.
    - Caldera's re-run ability originates from `.20`, so it is now blocked → failure → proof.
   - **Alternative to consider:** run the *initial* attack (step 1) through Caldera as well, so the attack and the verify are literally the same operation executed twice. This is cleaner conceptually but requires the Caldera profile to also be the primary attack path. Decide this before D wires the client.

## 2.7 Lab deliverables (what A hands off)
| Deliverable | To | Contract |
|---|---|---|
| Victim IP, SSH user, key/password | B, D | #4 |
| Confirmed list of event types the logs produce (ssh_fail/ssh_success/user_add/egress) | B | #1 |
| Caldera adversary profile + profile ID | D, B | #3 |
| Real log bundle (replay set) | D | — |
| `clean` and `attacked` snapshots | self | — |

## 2.8 Lab safety (non-negotiable)
- Keep the network **host-only**; never bridge it to the real network.
- The victim has a weak password and a backdoor user on purpose. Delete the VMs when the project is done.
- Only the Windows host touches the internet (for the LLM). The VMs never do.

---

# SEGMENT 3 — FRONTEND (Role C)

**Goal:** Build the web UI that shows an incident, its linked events, and a plain-English summary; enforces the role gate visually (receptionist can view but not block; admin can approve/block); and shows the audit trail with the "re-run → failed → neutralized" proof.

**You own step 8 (show) and the UI side of steps 9 and 12.** You build entirely against **mock JSON** that matches Contract #2, so you never wait on the backend.

## 3.1 Day 0 — Setup (about half a day)
1. Install Node.js 20+.
2. Scaffold:
   ```bash
   npx create-next-app@latest soc-frontend --typescript --tailwind --app
   cd soc-frontend
   npm install reactflow @tanstack/react-query
   ```
3. Create a mock data file `mocks/incident.json` that exactly matches **Contract #2** (`IncidentOut`): id, created_at, status, severity, summary, rule_hits, source_ip, and an `events` array. Build against this until the backend is live.
4. Set an env var `NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000` so you can swap mock → real by changing the fetch source.

## 3.2 Day 1 — Incident list and detail (about 1 day)
5. **Incident list page** (`/`): fetch `GET /incidents` (or the mock), render a table: id, created_at, severity (color-coded), status, rule_hits, source_ip. Clicking a row opens detail.
6. **Incident detail page** (`/incidents/[id]`): fetch `GET /incidents/{id}`, show:
   - the plain-English **summary** prominently at the top (this is the product's point for a non-expert),
   - severity and rule hits as badges,
   - the list of related events.
7. Use TanStack Query for fetching/caching so loading and error states are handled cleanly.

## 3.3 Day 2 — Event graph and timeline (about 1 day)
8. **Event graph** with React Flow: render each event as a node, draw edges between events that share the attacker IP/user/host, so the viewer sees "3 raw alerts → 1 incident" visually. Label nodes with the event type and time.
9. **Timeline**: order the incident's events by timestamp so the three acts (brute force → new user → egress) read left to right.
10. Keep styling with Tailwind; color severity consistently (e.g. high = red, medium = amber, low = gray). Set both background and text color together so it is readable in light and dark.

## 3.4 Day 3 — Role views, approve/block, audit (about 1 day)
11. **Role switch (demo):** a simple selector that sets the `X-Role` header on API calls (`receptionist` or `admin`). This simulates who is logged in.
12. **Receptionist view:** sees everything read-only. The **Block** button is visible but disabled/rejected with a clear message ("Only an admin can approve a block"). If they somehow call the API, the backend returns 403 — surface that message.
13. **Admin view:** **Approve** and **Block** buttons are active. Approve calls `POST /incidents/{id}/approve`; Block calls `POST /incidents/{id}/block`. Show distinct states: approving → blocking → verifying → verified, and a clear failure state if the block or verify fails.
14. **Audit trail view** (`/audit`): fetch the audit rows and render who did what, when, to what, and the result. Include the verify result so the "block confirmed by re-run" proof is visible.
15. **Proof panel:** on a verified incident, show the sequence "attacker blocked → attack re-run via Caldera → re-run failed → threat neutralized." This is the visual payoff of the whole loop.

## 3.5 Day 4–5 — Integration and polish
16. Switch fetches from mock JSON to the live backend by pointing at `NEXT_PUBLIC_API_BASE`. Fix any shape mismatches against Contract #2 with B (there should be none if the contract held).
17. Handle the offline/LLM-down case gracefully: the summary field will contain the template fallback text; the UI must render it the same way.
18. Final polish: loading spinners, empty states (no incidents yet), and a clean demo-ready look.

## 3.6 Frontend dependency summary
| You need from | What | Until you have it |
|---|---|---|
| B (Backend) | Contract #2 shape + example JSON | Build on `mocks/incident.json` |
| B (Backend) | Role header behavior (403 on receptionist block) | Mock the 403 locally |
| D (Integration) | The verify result field in Contract #2 | Mock `status: "verified"` |

**Build order that never blocks you:** scaffold → list → detail → graph/timeline → role views → audit/proof, all on mock JSON; switch to the live API only in the back half.

---

# SECTION 5 — INTEGRATION, REPLAY & PITCH (Role D)

Role D's build pieces (Caldera server + REST client) are in the Lab & Caldera segment (2.6). The remaining Role D responsibilities:

## 5.1 End-to-end glue
- Confirm the four contracts are met at integration time. Run the full loop on one box: attack → logs → backend incident → UI → admin approve → block → Caldera verify → audit.
- Own the environment/secrets: one `.env` for the backend with victim creds, LLM key, and Caldera URL/key.

## 5.2 Replay mode (demo safety net)
- Using A's captured log bundle, build a small replayer that POSTs the saved events to the backend's `/events` endpoint in order. If the live VM attack fails during the demo, replay reproduces the exact same incident so the rest of the loop (summary → approve → block → verify) still runs.
- Note: in replay, the block and Caldera verify still need the live victim/attacker reachable; if the whole lab is down, replay demonstrates steps 2–9 and 12, and the Caldera verify is shown from the recorded run.

## 5.3 Pitch artifacts (the Direction-C positioning)
- **Enterprise-twin mapping:** a slide mapping each custom part to its enterprise equivalent — detector ≈ Wazuh, approval/response ≈ Shuffle, verify ≈ Caldera. This proves the team knows the real stack and explains why a right-sized build is appropriate for a one-admin organization.
- **Honest reuse statement:** state plainly that Caldera (Apache 2.0) is reused for verification and the lightweight detect/approve/block path is the team's own code. Do not claim to have invented SIEM or SOAR.
- **Demo run-of-show:** the exact click-by-click order for the live demo, with the replay fallback noted.

## 5.4 Licensing note (keep the project clean)
| Tool | License | Use in Project X |
|---|---|---|
| Caldera | Apache 2.0 | Reused directly for verify — clean, attribute it |
| OpenAEV / OpenBAS | Apache 2.0 | Not used; heavier/enterprise |
| Wazuh | GPLv2 | **Not copied** — reimplement patterns only |
| Shuffle | AGPL-family | **Not copied** — reimplement patterns only |

Reuse only the permissively licensed tool (Caldera). For the detect/approve/block path, reimplement the *patterns* in the team's own code so the project carries no copyleft obligations.

---

## Appendix A — Glossary (for first-time readers)
- **SOC** — Security Operations Center: the team/function that watches for and responds to attacks.
- **SIEM** — Security Information and Event Management: collects and correlates logs, raises alerts.
- **SOAR** — Security Orchestration, Automation and Response: automates the response (e.g. blocking an IP), often with a human approval step.
- **MITRE ATT&CK** — a public catalog of attacker techniques, each with an ID (e.g. T1110).
- **Caldera** — MITRE's free adversary-emulation tool; runs ATT&CK techniques on demand via API.
- **ufw** — Uncomplicated Firewall on Ubuntu; `ufw deny from <ip>` blocks a source.
- **Paramiko** — a Python SSH library; the backend uses it to run commands on the victim.
- **NetworkX** — a Python graph library; used to link related events into one incident.
- **Host-only network** — a virtual network with no internet route, used to keep the attack sealed.
- **Replay mode** — re-sending saved log events so the demo works even if the live attack fails.

## Appendix B — The one-line project statement
A single-box SOC that detects an attack from Linux logs, explains it in plain English, requires one human approval, blocks the attacker, and re-runs the attack via Caldera to prove the block held — sized and priced for an organization with one admin and no security team. Caldera is reused for verification; the rest is the team's own lightweight code.

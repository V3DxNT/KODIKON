# Project X — SOC Backend

FastAPI-powered single-box Security Operations Center (SOC) backend.

## Structure
```
backend/
  app/
    __init__.py
    main.py        # FastAPI app, startup, routes
    db.py          # SQLite engine and session
    models.py      # SQLModel DB tables: Event, Incident, AuditLog
    schemas.py     # Pydantic request/response models (Contract #1 & #2)
    ingest.py      # POST /events endpoint & validation
    correlate.py   # Event-to-incident correlation (NetworkX & time window)
    rules.py       # R1, R2, R3 pure functions and severity evaluation
    summary.py     # Plain-English LLM summary + Jinja2 template fallback
    roles.py       # Role-based access control dependency (receptionist vs admin)
    actions.py     # Paramiko SSH firewall block & Caldera verify trigger
    config.py      # Environment configuration
  tests/
    __init__.py
    test_rules.py
    test_correlate.py
  .env.example
  requirements.txt
```

## Setup & Running

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

5. Access interactive Swagger documentation:
   - URL: `http://127.0.0.1:8000/docs`

## Running Tests
```bash
pytest tests/
```

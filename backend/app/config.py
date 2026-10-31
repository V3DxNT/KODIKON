import os
from dotenv import load_dotenv

load_dotenv()

VICTIM_HOST = os.getenv("VICTIM_HOST", "192.168.56.10")
SSH_USER = os.getenv("SSH_USER", "admin")
SSH_KEY_PATH = os.getenv("SSH_KEY_PATH", "")
SSH_PASSWORD = os.getenv("SSH_PASSWORD", "")
SIMULATE_ACTIONS = os.getenv("SIMULATE_ACTIONS", "false").lower() in ("true", "1", "yes")

CALDERA_URL = os.getenv("CALDERA_URL", "http://192.168.56.20:8888")
CALDERA_API_KEY = os.getenv("CALDERA_API_KEY", "")
CALDERA_PROFILE_ID = os.getenv("CALDERA_PROFILE_ID", "")

LLM_API_KEY = os.getenv("LLM_API_KEY", "")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///soc.db")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))

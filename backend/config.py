import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "")
INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
IG_BUSINESS_ACCOUNT_ID = os.getenv("IG_BUSINESS_ACCOUNT_ID", "")
GRAPH_API_VERSION = os.getenv("GRAPH_API_VERSION", "v20.0")
CONFIG_FILE = Path(os.getenv("CONFIG_FILE", str(BASE_DIR / "reels_config.json")))


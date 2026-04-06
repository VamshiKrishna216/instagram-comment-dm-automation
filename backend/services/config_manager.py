import json
from pathlib import Path

from config import CONFIG_FILE

DEFAULT_CONFIG = {
    "reels": {},
    "default": {
        "trigger_keyword": "info",
        "dm_message": "Thanks for your interest! Check your DMs.",
        "comment_reply": "Sent you a DM!",
        "active": True,
    },
}


def _ensure_parent_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def _load_config():
    if not CONFIG_FILE.exists():
        _save_config(DEFAULT_CONFIG)
        return DEFAULT_CONFIG

    with CONFIG_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _save_config(config):
    _ensure_parent_dir(CONFIG_FILE)
    with CONFIG_FILE.open("w", encoding="utf-8") as file:
        json.dump(config, file, indent=2)


def get_all_configs():
    return _load_config()


def get_reel_config(media_id: str):
    config = _load_config()
    return config["reels"].get(media_id, config["default"])


def update_reel_config(media_id: str, new_config: dict):
    config = _load_config()
    config["reels"][media_id] = new_config
    _save_config(config)
    return new_config

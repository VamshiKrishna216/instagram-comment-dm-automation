import requests

from config import GRAPH_API_VERSION, IG_BUSINESS_ACCOUNT_ID, INSTAGRAM_ACCESS_TOKEN

GRAPH_API_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"


def _request(method: str, path: str, *, params=None, json=None):
    request_params = dict(params or {})
    request_params["access_token"] = INSTAGRAM_ACCESS_TOKEN

    response = requests.request(
        method,
        f"{GRAPH_API_URL}/{path.lstrip('/')}",
        params=request_params,
        json=json,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def send_dm(comment_id: str, message: str):
    return _request(
        "POST",
        f"{IG_BUSINESS_ACCOUNT_ID}/messages",
        json={
            "recipient": {"comment_id": comment_id},
            "message": {"text": message},
        },
    )


def reply_to_comment(comment_id: str, message: str):
    return _request("POST", f"{comment_id}/replies", json={"message": message})


def get_account_media():
    data = _request(
        "GET",
        f"{IG_BUSINESS_ACCOUNT_ID}/media",
        params={
            "fields": "id,media_type,media_url,thumbnail_url,permalink,caption",
            "limit": 100,
        },
    )
    return data.get("data", [])

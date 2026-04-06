from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.config_manager import get_all_configs, get_reel_config, update_reel_config
from services.instagram import get_account_media, reply_to_comment, send_dm

router = APIRouter(prefix="/api", tags=["admin"])


class ReelConfigUpdate(BaseModel):
    trigger_keyword: str = Field(default="")
    dm_message: str = Field(default="")
    comment_reply: str = Field(default="")
    active: bool = Field(default=True)


class TestDMRequest(BaseModel):
    comment_id: str
    message: str


class TestReplyRequest(BaseModel):
    comment_id: str
    message: str


@router.get("/reels")
async def fetch_reels():
    try:
        media_items = get_account_media()
        configs = get_all_configs()

        reels = []
        for item in media_items:
            media_id = item["id"]
            config = configs["reels"].get(media_id, configs["default"])
            reels.append(
                {
                    "id": media_id,
                    "thumbnail_url": item.get("thumbnail_url", item.get("media_url")),
                    "permalink": item.get("permalink"),
                    "caption": item.get("caption", "")[:120],
                    "media_type": item.get("media_type", "UNKNOWN"),
                    "config": config,
                }
            )

        return {"reels": reels, "total": len(reels)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/reels/{media_id}")
async def get_reel(media_id: str):
    return {"media_id": media_id, "config": get_reel_config(media_id)}


@router.put("/reels/{media_id}")
async def update_reel(media_id: str, config: ReelConfigUpdate):
    try:
        update_reel_config(media_id, config.model_dump())
        return {"status": "updated", "media_id": media_id}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/stats")
async def get_stats():
    media_items = get_account_media()
    configs = get_all_configs()

    configured = sum(1 for item in media_items if item["id"] in configs["reels"])
    total = len(media_items)

    return {
        "total_reels": total,
        "configured": configured,
        "using_default": total - configured,
    }


@router.post("/test/send-dm")
async def test_send_dm(request: TestDMRequest):
    try:
        result = send_dm(request.comment_id, request.message)
        return {"status": "success", "result": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/test/reply-comment")
async def test_reply_comment(request: TestReplyRequest):
    try:
        result = reply_to_comment(request.comment_id, request.message)
        return {"status": "success", "result": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

from typing import Sequence

from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from schemas.like import (
    LikeCreate, 
    LikeOut,
    LikeUpdate
)
from schemas.response import SuccessResponse
from models.article_like import ArticleLike as _ArticleLike
from database.managers.like_manager import LikeManager
from .dependencies import get_current_user

like_router = APIRouter(prefix="/likes", tags=["Лайки"])

like_manager = LikeManager()


@like_router.post("/",
                  summary='Создать лайк',
                  dependencies=[Depends(get_current_user)])
def create_like(like: LikeCreate) -> LikeOut:
    new_like = _ArticleLike(**like.model_dump())
    return like_manager.create_obj(new_like)


@like_router.get("/",
                 summary='Получить все лайки')
def get_all_likes(skip: int = 0, limit: int = 100) -> Sequence[LikeOut] | None:
    return like_manager.get_all_obj(skip=skip, limit=limit)


@like_router.get("/{id}",
                 summary='Получить лайк по ID')
def get_like(id: int) -> LikeOut:
    like = like_manager.get_obj_by_id(id)
    if not like:
        raise HTTPException(status_code=404, detail="Лайк не найден")
    return like


@like_router.put("/{id}",
                 summary='Изменить лайк по ID')
def update_like(id: int, like_update: LikeUpdate) -> LikeOut:
    updated = like_manager.update_obj(id, like_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Лайк не найден")
    return updated


@like_router.delete("/{id}",
                    summary='Удалить лайк по ID')
def delete_like(id: int) -> SuccessResponse:
    deleted = like_manager.delete_obj(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Лайк не найден")
    return SuccessResponse(success=True)

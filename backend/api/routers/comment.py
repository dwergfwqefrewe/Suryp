from fastapi import APIRouter, HTTPException, Depends

from schemas.comment import CommentCreate, CommentOut, CommentUpdate
from schemas.response import SuccessResponse
from models.comments import Comment as _Comment

from database.managers.comment_manager import CommentManager
from .dependencies import get_current_user


comment_router = APIRouter(prefix="/comments", tags=["Комментарии"])

comment_manager = CommentManager()


@comment_router.post("/",
                     summary='Создать комментарий',
                     dependencies=[Depends(get_current_user)])
def create_comment(comment: CommentCreate) -> CommentOut:
    new_comment = _Comment(**comment.model_dump())
    return comment_manager.create_obj(new_comment)


@comment_router.get("/{id}",
                    summary='Получить комментарий по ID',
                    dependencies=[Depends(get_current_user)])
def get_comment(id: int) -> CommentOut:
    comment = comment_manager.get_obj_by_id(id)
    if not comment:
        raise HTTPException(status_code=404, detail="Комментарий не найден")
    return CommentOut.model_validate(comment)


@comment_router.put("/{id}",
                    summary='Изменить комментарий по ID',
                    dependencies=[Depends(get_current_user)])
def update_comment(id: int, comment_update: CommentUpdate) -> CommentOut:
    updated = comment_manager.update_obj(id, comment_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Комментарий не найден")
    return updated


@comment_router.delete("/{id}",
                       summary='Удалить комментарий по ID',
                       dependencies=[Depends(get_current_user)])
def delete_comment(id: int) -> SuccessResponse:
    deleted = comment_manager.delete_obj(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Комментарий не найден")
    return SuccessResponse(success=True)

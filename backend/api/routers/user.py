from collections.abc import Sequence

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import joinedload

from models.user import User
from models.article import Article
from schemas.user import UserOut, UpdateUser, UpdateMe
from database.managers.user_manager import UserManager
from .dependencies import get_current_user


manager = UserManager()

user_router = APIRouter(prefix='/user', tags=['Пользователи'])


@user_router.get('/',
                 summary='Получить всех пользователей',
                 dependencies=[Depends(get_current_user)])
def get_users() -> Sequence[UserOut] | None:
    return manager.get_all_obj(options=[
        joinedload(User.articles).joinedload(Article.author)
        ])


@user_router.get('/me',
                 summary='Получить данные о себе',
                 dependencies=[Depends(get_current_user)])
def get_me(user: User = Depends(get_current_user)) -> UserOut:
    user_out = manager.get_obj_by_id(user.id, options=[
        joinedload(User.articles).joinedload(Article.author)
    ])
    if user_out is None:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    return user_out


@user_router.delete('/{id}',
                    summary='Удалить пользователя по ID',
                    dependencies=[Depends(get_current_user)])
def delete_user(id: int) -> UserOut:
    deleted_user = manager.delete_obj(id=id)

    return deleted_user


@user_router.patch('/me',
                  summary='Частичное обновление данных о себе',
                  dependencies=[Depends(get_current_user)])
def patch_me(updated_user: UpdateMe, user: User = Depends(get_current_user)) -> UserOut | None:
    update_data = UpdateUser(**updated_user.model_dump())
    user_out = manager.update_obj(id=user.id, updated_obj=update_data)
    if user_out is None:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    return manager.get_obj_by_id(user.id, options=[
        joinedload(User.articles).joinedload(Article.author)
    ])

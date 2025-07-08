from fastapi import (
    APIRouter,
    Depends
)
from typing import List
from models.user import User
from schemas.user import UserBase
from database.managers.message_manager import MessageManager
from database.managers.user_manager import UserManager
from .dependencies import get_current_user

message_router = APIRouter(prefix="/messages", tags=["Сообщения"])

message_manager = MessageManager()
user_manager = UserManager()


@message_router.get("/chats", summary="Получить все чаты")
def get_chats(user: User = Depends(get_current_user)) -> List[UserBase]:
    chats = set(message_manager.get_chats(user.id))
    users_id = []

    for chat in chats:
        if chat.receiver_id != user.id:
            users_id.append(chat.receiver_id)
        else:
            users_id.append(chat.sender_id)

    users_id = set(users_id)
    print(users_id)
    users = []

    for user_id in users_id:
        users.append(user_manager.get_obj_by_id(user_id))

    return [UserBase(id=user.id, login=user.login, about=user.about, avatar_url=user.avatar_url) for user in users]

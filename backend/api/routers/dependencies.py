from fastapi import HTTPException, Request
from jose import JWTError
from sqlalchemy.orm import selectinload

from .jwt_auth import decode_token
from api.auth_config import JWT_ACCESS_COOKIE_NAME
from database.managers.user_manager import UserManager
from models.user import User
from models.article import Article


manager = UserManager()


def get_current_user(request: Request) -> User:
    """
    Получает пользователя из БД по access token из cookies
    """
    token = request.cookies.get(JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Missing access token")
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
        user_id = int(sub)
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid Token")
    user = manager.get_obj_by_id(
        id=user_id,
        options=[selectinload(User.articles).selectinload(Article.author)]
    )
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

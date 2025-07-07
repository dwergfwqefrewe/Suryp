from fastapi import APIRouter, HTTPException, Response, Request, status

from api.auth_config import JWT_ACCESS_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME
from database.managers.user_manager import UserManager
from schemas.user import UserCreate, UserLogin
from schemas.response import SuccessResponse
from models.user import User as _User
from .jwt_auth import create_access_token, create_refresh_token, decode_refresh_token

manager = UserManager()

auth_router = APIRouter(prefix='/auth', tags=['Аутентификация'])


@auth_router.post('/register',
                  summary='Создать пользователя и выдать токен',
                  status_code=status.HTTP_201_CREATED)
def create_user(new_user: UserCreate, response: Response) -> SuccessResponse:
    """Создает нового пользователя и выдает токены"""
    try:
        user = _User(**new_user.model_dump())
        created_user = manager.create_obj(obj=user)
        
        # Создаем токены для нового пользователя
        access_token = create_access_token({"sub": str(created_user.id)})
        refresh_token = create_refresh_token({"sub": str(created_user.id)})
        
        # Устанавливаем cookies с токенами
        response.set_cookie(
            JWT_ACCESS_COOKIE_NAME, 
            access_token, 
            httponly=True,
            secure=False,  # True для HTTPS
            samesite='lax'
        )
        response.set_cookie(
            JWT_REFRESH_COOKIE_NAME, 
            refresh_token, 
            httponly=True,
            secure=False,  # True для HTTPS
            samesite='lax'
        )
        
        return SuccessResponse(success=True)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ошибка при создании пользователя: {str(e)}"
        )


@auth_router.post('/login/{id}',
                  summary='Авторизация по ID')
def get_access_token(id: int, response: Response) -> SuccessResponse:
    """Авторизация пользователя по ID"""
    user = manager.get_obj_by_id(id=id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail='Пользователь не найден'
        )

    access_token = create_access_token({"sub": str(id)})
    refresh_token = create_refresh_token({"sub": str(id)})
    
    # Устанавливаем cookies с дополнительными параметрами безопасности
    response.set_cookie(
        JWT_ACCESS_COOKIE_NAME, 
        access_token, 
        httponly=True,
        secure=False,  # True для HTTPS
        samesite='lax'
    )
    response.set_cookie(
        JWT_REFRESH_COOKIE_NAME, 
        refresh_token, 
        httponly=True,
        secure=False,  # True для HTTPS
        samesite='lax'
    )

    return SuccessResponse(success=True)


@auth_router.post('/login',
                  summary='Войти в аккаунт')
def login(user: UserLogin, response: Response) -> SuccessResponse:
    user_id = manager.get_user_id_by_login(login=user.login)

    if manager.check_user_data(user):
        access_token = create_access_token({"sub": str(user_id)})
        refresh_token = create_refresh_token({"sub": str(user_id)})
        response.set_cookie(JWT_ACCESS_COOKIE_NAME, access_token, httponly=True)
        response.set_cookie(JWT_REFRESH_COOKIE_NAME, refresh_token, httponly=True)

        return SuccessResponse(success=True)

    raise HTTPException(status_code=404, detail='Invalid register data')


@auth_router.post('/refresh',
                  summary='Обновить access токен')
def refresh_token(request: Request, response: Response) -> SuccessResponse:
    refresh_token = request.cookies.get(JWT_REFRESH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Missing refresh token')
    try:
        payload = decode_refresh_token(refresh_token)
        user_id = payload.get('sub')
        access_token = create_access_token({"sub": str(user_id)})
        response.set_cookie(JWT_ACCESS_COOKIE_NAME, access_token, httponly=True)
        return SuccessResponse(success=True)
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid refresh token')

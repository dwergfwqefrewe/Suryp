import socketio
import logging
from typing import Dict, Any

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Создаем Socket.IO сервер
sio = socketio.AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

def socket_app(app):
    """Создает ASGI приложение с Socket.IO"""
    return socketio.ASGIApp(sio, other_asgi_app=app)

# Хранилище подключенных пользователей
users: Dict[str, str] = {}


@sio.event
async def connect(sid: str, environ: Dict[str, Any]) -> None:
    """Обработчик подключения пользователя"""
    logger.info(f'Пользователь подключился: {sid}')
    await sio.emit('user_count', {'count': len(users) + 1}, skip_sid=sid)


@sio.event
async def disconnect(sid: str) -> None:
    """Обработчик отключения пользователя"""
    username = users.pop(sid, "Аноним")
    await sio.emit('message', {
        "user": "Система", 
        "text": f"{username} покинул чат.",
        "type": "system"
    })
    await sio.emit('user_count', {'count': len(users)})
    logger.info(f'Пользователь отключился: {sid} ({username})')


@sio.event
async def join(sid: str, data: Dict[str, Any]) -> None:
    """Обработчик присоединения к чату"""
    username = data.get("username", "Аноним")
    users[sid] = username
    
    await sio.emit('message', {
        "user": "Система", 
        "text": f"{username} присоединился к чату.",
        "type": "system"
    })
    await sio.emit('user_count', {'count': len(users)})
    
    logger.info(f"{username} присоединился ({sid})")


@sio.event
async def message(sid: str, data: Dict[str, Any]) -> None:
    """Обработчик сообщений"""
    username = users.get(sid, "Аноним")
    text = data.get("text", "").strip()
    
    if not text:
        return
    
    await sio.emit('message', {
        "user": username, 
        "text": text,
        "type": "user"
    })
    
    logger.info(f"Сообщение от {username}: {text}")


@sio.event
async def typing(sid: str, data: Dict[str, Any]) -> None:
    """Обработчик индикатора печати"""
    username = users.get(sid, "Аноним")
    is_typing = data.get("is_typing", False)
    
    await sio.emit('typing', {
        "user": username,
        "is_typing": is_typing
    }, skip_sid=sid) 

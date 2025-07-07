from typing import Any, Generator, Self
from database.config import engine, SessionLocal
from sqlalchemy.orm import Session, scoped_session

from contextlib import contextmanager


class Manager:
    """Менеджер для работы с сессиями базы данных
        - _instance - экземпляр менеджера
        - SessionLocal - сессия базы данных
        - engine - движок базы данных
    """

    _instance = None

    def __new__(cls) -> Self:
        """Создание экземпляра менеджера"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance


    def __init__(self) -> None:
        """Инициализация менеджера"""
        from models import Base
        
        self.SessionLocal = SessionLocal
        self.engine = engine

        Base.metadata.create_all(self.engine)

    @contextmanager
    def get_session(self) -> Generator[scoped_session[Session], Any, None]:
        """Контекстный менеджер для работы с scoped_session SQLAlchemy.
        
        Предоставляет безопасную сессию базы данных с автоматическим управлением
        транзакциями и очисткой ресурсов.

        Yields:
            scoped_session[Session]: Сессия базы данных, готовая к использованию.
            Автоматически создается при входе в контекст и очищается при выходе.
        """

        session = scoped_session(self.SessionLocal)
        try:
            yield session
        except Exception as _ex:
            session.rollback()
            raise _ex
        finally:
            session.close()


manager: Manager = Manager()

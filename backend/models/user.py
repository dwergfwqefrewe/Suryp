from sqlalchemy import (
    Column,
    String,
    Integer,
)
from sqlalchemy.orm import relationship

from database.config import Base


class User(Base):
    """Модель для пользователя
        - id - id пользователя
        - login - логин пользователя
        - password_hash - хэш пароля пользователя
        - role - роль пользователя
        - avatar_url - url аватара пользователя
        - about - описание пользователя
        - articles - связь с статьями пользователя
        - comments - связь с комментариями пользователя
        - article_likes - связь с лайками пользователя
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    login = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(Integer, default=1, nullable=False)
    avatar_url = Column(String, nullable=True, default=None)
    about = Column(String, nullable=True, default=None)

    articles = relationship('Article',
                            back_populates='author',
                            cascade='all, delete')
    
    comments = relationship('Comment',
                            back_populates='user',
                            cascade='all, delete')
    
    article_likes = relationship('ArticleLike',
                                 back_populates='user',
                                 cascade='all, delete')

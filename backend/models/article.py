from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from database.config import Base


class Article(Base):
    """Модель для истории
        - id - id истории
        - title - заголовок истории
        - description - описание истории
        - likes - количество лайков
        - created_at - дата и время создания истории
        - updated_at - дата и время обновления истории
        - author_id - id автора истории
        - author - автор истории
        - article_likes - связь с лайками истории
        - comments_rel - связь с комментариями истории
    """
    __tablename__ = 'articles'

    id: int = Column(Integer, primary_key=True)
    title: str = Column(String, nullable=False)
    description: str = Column(String)
    likes: int = Column(Integer, default=0, nullable=False)

    created_at: datetime = Column(DateTime,
                            nullable=False,
                            default=datetime.now)
    
    updated_at: datetime = Column(DateTime,
                            default=None,
                            onupdate=datetime.now)

    author_id: int = Column(Integer,
                            ForeignKey('users.id'),
                            nullable=False)

    author = relationship('User', back_populates='articles')

    article_likes = relationship('ArticleLike',
                                 back_populates='article',
                                 cascade='all, delete')

    comments_rel = relationship('Comment',
                                 back_populates='article',
                                 cascade='all, delete')

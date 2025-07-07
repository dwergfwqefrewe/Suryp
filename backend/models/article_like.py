from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    UniqueConstraint,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from database.config import Base


class ArticleLike(Base):
    """Модель для связи статьи и пользователя
        - id - id лайка
        - created_at - дата и время постановки лайка
        - user_id - id пользователя, который поставил лайк
        - article_id - id статьи, которой поставили лайк
        - user - пользователь, который поставил лайк
        - article - статья, которой поставили лайк
    """
    __tablename__ = 'article_likes' 

    id: int = Column(Integer, primary_key=True)
    created_at: datetime = Column(DateTime, default=datetime.now)
    
    user_id: int = Column(Integer,
                          ForeignKey('users.id',
                                     ondelete='CASCADE'),
                                     nullable=False)
    
    article_id: int = Column(Integer,
                             ForeignKey('articles.id',
                                        ondelete='CASCADE'),
                                        nullable=False)
    
    user = relationship('User', back_populates='article_likes')
    article = relationship('Article', back_populates='article_likes')

    __table_args__ = (
        # Уникальность для связи пользователя и статьи
        UniqueConstraint('user_id',
                         'article_id',
                         name='uix_user_article_like'),
    )
    

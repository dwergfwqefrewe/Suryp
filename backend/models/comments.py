from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from database.config import Base


class Comment(Base):
    """Модель для комментария
        - id - id комментария
        - content - текст комментария
        - created_at - дата и время создания комментария
        - updated_at - дата и время последнего обновления комментария
        - user_id - id пользователя, который оставил комментарий
        - article_id - id статьи, к которой оставили комментарий
        - user - пользователь, который оставил комментарий
        - article - статья, к которой оставили комментарий
    """
    __tablename__ = 'comments'

    id: int = Column(Integer, primary_key=True)
    content: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.now)
    updated_at: datetime = Column(DateTime,
                                    default=None,
                                    onupdate=datetime.now,
                                    nullable=True)


    user_id: int = Column(Integer,
                          ForeignKey('users.id',
                                     ondelete='CASCADE'),
                          nullable=False)
    
    article_id: int = Column(Integer,
                             ForeignKey('articles.id',
                                        ondelete='CASCADE'),
                             nullable=False)
    
    user = relationship('User', back_populates='comments')
    article = relationship('Article', back_populates='comments_rel')

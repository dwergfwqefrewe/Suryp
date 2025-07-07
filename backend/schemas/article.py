from pydantic import BaseModel, computed_field
from datetime import datetime

from schemas.author import AuthorResponse


class Article(BaseModel):
    """Схема для создания статьи"""
    title: str
    description: str | None
    author_id: int


class ArticleResponse(BaseModel):
    """Схема для получения статьи"""
    id: int
    title: str
    description: str
    likes: int
    author: AuthorResponse | None
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True


class UpdateArticle(BaseModel):
    """Схема для обновления статьи"""
    title: str | None
    description: str | None

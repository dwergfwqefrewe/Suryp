from pydantic import BaseModel


class AuthorResponse(BaseModel):
    """Схема для получения автора"""
    id: int
    login: str

    class Config:
        from_attributes = True


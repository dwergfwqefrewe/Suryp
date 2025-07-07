from models.article_like import ArticleLike
from schemas.like import LikeUpdate
from .base_manager import BaseManager


class LikeManager(BaseManager[ArticleLike, LikeUpdate]):
    """Менеджер для работы с лайками"""

    def __init__(self):
        super().__init__(ArticleLike)

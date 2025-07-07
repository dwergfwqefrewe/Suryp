from sqlalchemy.orm import joinedload

from database.managers.base_manager import BaseManager
from models.article import Article
from schemas.article import UpdateArticle, ArticleResponse


class ArticleManager(BaseManager[Article, UpdateArticle]):
    """Менеджер для работы со статьями"""

    def __init__(self):
        super().__init__(Article)

    def get_articles_with_authors(self):
        """Получение всех статей с авторами"""
        with self.manager.get_session() as session:
            query = session.query(self._model).options(joinedload(self._model.author))
            articles = query.all()
            return [ArticleResponse.model_validate(article) for article in articles]

    def get_article_by_id_with_author(self, id: int):
        """Получение статьи по id с автором"""
        with self.manager.get_session() as session:
            query = session.query(self._model).options(joinedload(self._model.author))
            article = query.get(id)
            if article:
                return ArticleResponse.model_validate(article)
            return None

    def create_article_with_response(self, article_obj):
        """Создать статью и вернуть сериализованный ArticleResponse с автором"""
        with self.manager.get_session() as session:
            session.add(article_obj)
            session.commit()
            session.refresh(article_obj)
            # Подгружаем автора
            session.refresh(article_obj)
            article_with_author = session.query(self._model).options(joinedload(self._model.author)).get(article_obj.id)
            return ArticleResponse.model_validate(article_with_author)

    def delete_article_with_response(self, id: int):
        """Удалить статью и вернуть сериализованный ArticleResponse с автором"""
        with self.manager.get_session() as session:
            article = session.query(self._model).options(joinedload(self._model.author)).get(id)
            if not article:
                return None
            response = ArticleResponse.model_validate(article)
            session.delete(article)
            session.commit()
            return response

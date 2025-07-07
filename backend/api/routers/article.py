from collections.abc import Sequence
from fastapi import APIRouter, HTTPException, Depends

from schemas.article import Article, UpdateArticle, ArticleResponse
from models.article import Article as _Article
from database.managers.article_manager import ArticleManager
from .dependencies import get_current_user

manager = ArticleManager()

article_router = APIRouter(prefix='/article', tags=['Новости'])


@article_router.post('/',
                     summary='Создать новость',
                     dependencies=[Depends(get_current_user)])
def create_article(new_article: Article) -> ArticleResponse:
    article = _Article(**new_article.model_dump())
    response = manager.create_article_with_response(article)
    if response is None:
        raise HTTPException(status_code=500, detail='Ошибка создания статьи')
    return response


@article_router.get('/',
                    summary='Получить все новости')
def get_articles() -> Sequence[ArticleResponse] | None:
    return manager.get_articles_with_authors()


@article_router.get('/{id}',
                    summary='Получить новость по ID',
                    dependencies=[Depends(get_current_user)])
def get_article(id: int) -> ArticleResponse | None:
    return manager.get_article_by_id_with_author(id=id)


@article_router.put('/{id}',
                    summary='Изменить новость по ID',
                    dependencies=[Depends(get_current_user)])    
def update_article(id: int, updated_article: UpdateArticle) -> ArticleResponse:
    updated = manager.update_obj(id=id, updated_obj=updated_article)
    if updated is None:
        raise HTTPException(status_code=404, detail='Новость не найдена')
    return updated


@article_router.delete('/{id}',
                       summary='Удалить новость по ID',
                       dependencies=[Depends(get_current_user)])
def delete_article(id: int) -> ArticleResponse:
    deleted_article = manager.delete_article_with_response(id)
    if deleted_article is None:
        raise HTTPException(status_code=404, detail='Новость не найдена')
    return deleted_article

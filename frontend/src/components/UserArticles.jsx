import React, { useState } from "react"
import ProfileInfo from "./ProfileInfo"
import ArticleActions from "./ArticleActions"
import CreateArticleButton from "./CreateArticleButton"
import CreateArticleModal from "./CreateArticleModal"

const UserArticles = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user, articles, loading, error, removeArticle, refreshData } = ProfileInfo()

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleArticleCreated = () => {
        refreshData() // Обновляем данные после создания статьи
    }

    if (loading) {
        return (
            <div className="user-articles">
                <h3 className="text-primary mb-3">📰 Мои истории</h3>
                <div className="text-center">
                    <div className="loading"></div>
                    <p className="text-secondary mt-3">Загрузка статей...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-articles">
                <h3 className="text-primary mb-3">📰 Мои истории</h3>
                <div className="alert alert-danger">
                    <strong>Ошибка загрузки статей:</strong> {error}
                </div>
            </div>
        )
    }

    return (
        <div className="user-articles">
            <div className="d-flex justify-between align-center mb-3">
                <h3 className="text-primary">📰 Мои истории</h3>
                <CreateArticleButton onClick={handleOpenModal} />
            </div>
            
            {articles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h4 className="empty-state-title">Нет историй</h4>
                    <p className="empty-state-text">Ты пока что не опубликовал(а) ни одной истории...</p>
                </div>
            ) : (
                <div className="user-articles-grid">
                    {articles.map((article) => (
                        <div key={article.id} className="user-article-card">
                            <h4 className="user-article-title">{article.title}</h4>
                            <p className="user-article-content">{article.description}</p>
                            <div className="user-article-meta">
                                <span>Дата: {new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
                                <ArticleActions 
                                    article={article} 
                                    onDelete={removeArticle}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateArticleModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleArticleCreated}
                authorId={user && user.id}
            />
        </div>
    )
}

export default UserArticles

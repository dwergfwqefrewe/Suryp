import React, { useState, useEffect } from 'react'
import ArticleCard from '../components/ArticleCard'
import CreateArticleButton from '../components/CreateArticleButton'
import CreateArticleForm from '../components/CreateArticleForm'

const articlesUrl = "http://localhost:8000/article"

const Articles = () => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)

    useEffect(() => {
        fetch(articlesUrl)
            .then(resp => resp.json())
            .then(data => {
                setArticles(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Ошибка загрузки историй:", error)
                setLoading(false)
            })
    }, [])

    const handleCreateArticle = async (formData) => {
        try {
            const response = await fetch(articlesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const newArticle = await response.json()
                setArticles(prev => [newArticle, ...prev])
                setShowCreateForm(false)
            } else {
                console.error('Ошибка создания статьи')
            }
        } catch (error) {
            console.error('Ошибка создания статьи:', error)
        }
    }

    const handleEditArticle = (articleId) => {
        // Перенаправление на страницу редактирования
        window.location.href = `/edit-article/${articleId}`
    }

    const handleDeleteArticle = async (articleId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
            try {
                const response = await fetch(`${articlesUrl}/${articleId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })

                if (response.ok) {
                    setArticles(prev => prev.filter(article => article.id !== articleId))
                } else {
                    console.error('Ошибка удаления статьи')
                }
            } catch (error) {
                console.error('Ошибка удаления статьи:', error)
            }
        }
    }

    const handleViewArticle = (articleId) => {
        // Здесь можно добавить логику просмотра статьи
        console.log('Просмотр статьи:', articleId)
    }

    if (loading) {
        return (
            <div className="articles-container">
                <div className="empty-articles">
                    <h3>Загрузка историй...</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="articles-container">
            <div className="articles-header">
                <h1 className="articles-title">Истории</h1>
                <p className="articles-subtitle">Читайте интересные истории от наших авторов</p>
                <CreateArticleButton onClick={() => setShowCreateForm(true)} />
            </div>
            
            {showCreateForm && (
                <div className="content-section">
                    <CreateArticleForm 
                        onSubmit={handleCreateArticle}
                        onCancel={() => setShowCreateForm(false)}
                    />
                </div>
            )}
            
            {articles.length === 0 ? (
                <div className="empty-articles">
                    <h3>Нет историй</h3>
                    <p>Пока что нет доступных историй. Будьте первым, кто поделится своей историей!</p>
                </div>
            ) : (
                <div className="articles-list">
                    {articles.map(article => (
                        <ArticleCard 
                            key={article.id} 
                            article={article}
                            onEdit={handleEditArticle}
                            onDelete={handleDeleteArticle}
                            onView={handleViewArticle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Articles

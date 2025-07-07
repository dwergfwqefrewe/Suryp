import React from "react"

const formatDateTime = (isoString) => {
    const date = new Date(isoString)

    return {
        date: date.toLocaleDateString("ru-RU"),
        time: date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute:"2-digit"
        })
    }
}

const ArticleCard = ({article}) => {
    const created = formatDateTime(article.created_at)
    const updated = formatDateTime(article.updated_at)

    return (
        <div className="article-card">
            <div className="article-header">
                <h3 className="article-title">{article.title}</h3>
                <div className="article-meta">
                    <div className="article-author">
                        <img 
                            src={article.author.avatar || `https://ui-avatars.com/api/?name=${article.author.login}&background=random`}
                            alt={article.author.login}
                            className="author-avatar"
                        />
                        <span>{article.author.login}</span>
                    </div>
                    <div className="article-date">
                        <span>📅 {created.date} в {created.time}</span>
                    </div>
                </div>
            </div>
            
            <div className="article-content">
                <p>{article.description}</p>
            </div>

            {article.updated_at && article.created_at !== article.updated_at && (
                <div className="article-meta">
                    <div className="article-date">
                        <span>✏️ Изменено: {updated.date} в {updated.time}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ArticleCard

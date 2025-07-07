import React from 'react'

const CreateArticleButton = ({ onClick }) => {
    return (
        <div className="create-article-section">
            <button 
                className="create-article-btn"
                onClick={onClick}
            >
                <span>✏️</span>
                Создать новую историю
            </button>
        </div>
    )
}

export default CreateArticleButton 

import React, { useState } from 'react'

const CreateArticleForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <h2 className="form-title">Создать новую статью</h2>
                    <p className="form-subtitle">Поделитесь своими мыслями с сообществом</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Заголовок статьи</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Введите заголовок статьи"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Опишите содержание вашей статьи"
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="form-btn form-btn-outline" onClick={onCancel}>
                            Отмена
                        </button>
                        <button type="submit" className="form-btn form-btn-primary">
                            Создать статью
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateArticleForm 

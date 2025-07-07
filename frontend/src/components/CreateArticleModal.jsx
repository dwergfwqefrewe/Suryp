import React, { useState } from 'react'

const createArticleUrl = "http://localhost:8000/article"

const CreateArticleModal = ({ isOpen, onClose, onSuccess, authorId }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch(createArticleUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    author_id: authorId
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Ошибка создания истории")
            }

            // Очищаем форму и закрываем модальное окно
            setFormData({ title: "", description: "" })
            onSuccess()
            onClose()
        } catch (err) {
            setError("Ошибка при создании истории: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading) {
            setFormData({ title: "", description: "" })
            setError("")
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal show">
            <div className="modal-dialog">
                <div className="modal-header">
                    <h3 className="modal-title">Создать новую историю</h3>
                    <button 
                        className="modal-close" 
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>
                
                <div className="modal-body">
                    {error && (
                        <div className="alert alert-danger">
                            <strong>Ошибка:</strong> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label required">Заголовок:</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Введите заголовок истории"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Описание:</label>
                            <textarea
                                name="description"
                                className="form-input form-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Введите описание истории"
                                rows="4"
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
                
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="form-btn secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button 
                        type="submit" 
                        className="form-btn primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Создать историю'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateArticleModal 

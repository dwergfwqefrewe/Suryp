import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

const editArticleUrl = "http://localhost:5000/article/"

const EditArticle = ({onSave}) => {

    const {id: articleId} = useParams()

    const [formData, setFormData] = useState(
        {
            title: "",
            description: ""
        }
    )

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch(editArticleUrl + articleId)
            .then( response => {
                if (!response.ok) throw new Error("Ошибка загрузки URL!")
                return response.json()
            } )

            .then( data => {
                setFormData({
                    title: data.title,
                    description: data.description || ""
                })
                setLoading(false)
            } )

            .catch( () => {
                setError("Ошибка загрузки статьи!")
                setLoading(false)
            })
    }, [articleId])


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(editArticleUrl + articleId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body:JSON.stringify(formData)
        })

            .then(response => {
                if (!response.ok) throw new Error("Ошибка сохранения")
                if (onSave) onSave()
            })

            .catch(() => {
                setError("Ошибка сохранения новости")
            })
    }

    if (loading) return (
        <div className="page-container">
            <div className="text-center">
                <div className="loading loading-lg"></div>
                <p className="text-secondary mt-3">Загрузка...</p>
            </div>
        </div>
    )
    
    if (error) return (
        <div className="page-container">
            <div className="alert alert-danger">
                <strong>Ошибка:</strong> {error}
            </div>
        </div>
    )

    return (
        <div className="page-container">
            <div className="create-article-form">
                <div className="form-header">
                    <h2 className="form-title">Редактировать статью</h2>
                    <p className="form-subtitle">Внесите изменения в статью</p>
                </div>

                <form onSubmit={handleSubmit} className="form-body">
                    <div className="form-group">
                        <label className="form-label required">Заголовок:</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Введите заголовок статьи"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Описание:</label>
                        <textarea
                            name="description"
                            className="form-input form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Введите описание статьи"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="form-btn secondary">Отмена</button>
                        <button type="submit" className="form-btn primary">Сохранить изменения</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default EditArticle

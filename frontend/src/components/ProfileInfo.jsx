import React, { useState, useEffect, useCallback } from 'react'

const infoUrl = "http://localhost:8000/user/me"

const ProfileInfo = () => {
    const [userInfo, setUserInfo] = useState({})
    const [userArticles, setUserArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true)
            
            // Получаем информацию о пользователе (включая статьи)
            const userResponse = await fetch(infoUrl, {
                credentials: "include"
            })
            
            if (!userResponse.ok) {
                throw new Error('Ошибка загрузки профиля')
            }
            
            const userData = await userResponse.json()
            
            // Проверяем, что ответ - это массив и берем первый элемент
            const user = Array.isArray(userData) ? userData[0] : userData
            
            setUserInfo(user)
            
            // Извлекаем статьи из поля articles пользователя
            if (user && user.articles) {
                setUserArticles(user.articles)
            } else {
                setUserArticles([])
            }
            
        } catch (err) {
            console.error("Error fetching user data:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    const removeArticle = useCallback((articleId) => {
        setUserArticles(prev => prev.filter(article => article.id !== articleId))
    }, [])

    // Возвращаем объект с данными пользователя и его статьями
    return {
        user: userInfo,
        articles: userArticles,
        loading,
        error,
        removeArticle,
        refreshData: fetchUserData
    }
}

export default ProfileInfo

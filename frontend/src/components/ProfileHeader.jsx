import React from "react"
import ProfileInfo from "./ProfileInfo"

const ProfileHeader = () => {
    const { user, loading, error } = ProfileInfo()

    if (loading) {
        return (
            <div className="profile-header">
                <div className="text-center">
                    <div className="loading loading-lg"></div>
                    <p className="text-secondary mt-3">Загрузка профиля...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="profile-header">
                <div className="alert alert-danger">
                    <strong>Ошибка:</strong> {error}
                </div>
            </div>
        )
    }

    return (
        <div className="profile-header">
            <div className="profile-avatar">
                {user.login ? user.login.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-info">
                <h2 className="profile-name">{user.login || 'Пользователь'}</h2>
                <p className="profile-email">@{user.login || 'user'}</p>
                <p className="profile-description">{user.description || 'Описание отсутствует'}</p>
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{user.friends_count || 0}</span>
                        <span className="stat-label">Друзья</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{user.articles_count || 0}</span>
                        <span className="stat-label">Статьи</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader

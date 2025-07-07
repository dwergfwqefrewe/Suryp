import React from "react"

import PasswordForm from "../components/PasswordForm"
import ProfileHeader from "../components/ProfileHeader"
import UserArticles from "../components/UserArticles"

const Profile = () => {
    return (
        <div className="page-container">
            <div className="profile-page">
                <div className="profile-container">
                    <ProfileHeader/>
                    <div className="profile-content">
                        <PasswordForm />
                        <UserArticles />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile

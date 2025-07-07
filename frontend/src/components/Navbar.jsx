import React from "react"
import { Link } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">SYRUP CHAT</Link>
                
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Истории</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">Профиль</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/messenger" className="nav-link">Мессенджер</Link>
                    </li>
                </ul>
                
                <div className="navbar-actions">
                    <Link to="/login" className="navbar-btn navbar-btn-primary">Войти</Link>
                    <Link to="/register" className="navbar-btn navbar-btn-secondary">Регистрация</Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar

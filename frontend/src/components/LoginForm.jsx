import { useState } from "react"
import { useNavigate } from "react-router-dom"

const loginUrl = "http://localhost:8000/auth/login"
const registerUrl = "http://localhost:8000/create_user"

const LoginForm = ({isRegister = false}) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch(isRegister ? registerUrl : loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    login: login,
                    password_hash: password
                })
            })

            if (response.ok) {
                localStorage.setItem('username', login)
                // Перенаправляем на профиль после успешного входа
                navigate('/profile')
            } else {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Ошибка авторизации")
            }
        } catch (err) {
            console.error("Auth error:", err)
            setError(err.message || "Ошибка подключения к серверу")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">
                        {isRegister ? "Регистрация" : "Вход в систему"}
                    </h1>
                    <p className="auth-subtitle">
                        {isRegister 
                            ? "Создайте новый аккаунт для доступа к функциям" 
                            : "Войдите в свой аккаунт для продолжения"
                        }
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error">
                            <strong>Ошибка:</strong> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Логин</label>
                        <input
                            type="text"
                            className="form-input"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <div className="password-field">
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-btn ${isRegister ? 'auth-btn-secondary' : 'auth-btn-primary'} ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading 
                            ? (isRegister ? "Регистрация..." : "Вход...") 
                            : (isRegister ? "Зарегистрироваться" : "Войти")
                        }
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
                        <a href={isRegister ? "/login" : "/register"} className="auth-link">
                            {isRegister ? "Войти" : "Зарегистрироваться"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm

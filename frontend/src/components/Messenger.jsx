import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:8000'

const Messenger = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [joined, setJoined] = useState(false)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL)
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (username && !joined) {
      socketRef.current.emit('join', { username })
      setJoined(true)
    }
  }, [username, joined])

  const handleSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      socketRef.current.emit('message', { text: input })
      setInput('')
    }
  }

  return (
    <div className="page-container">
      <div className="messenger-container">
        <div className="messenger-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Контакты</h3>
            <p className="sidebar-subtitle">Выберите пользователя для чата</p>
          </div>
          <div className="contacts-list">
            <div className="contact-item active">
              <div className="contact-avatar">U</div>
              <div className="contact-info">
                <div className="contact-name">Общий чат</div>
                <div className="contact-status online">Онлайн</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="messenger-main">
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="chat-user-avatar">C</div>
              <div>
                <div className="chat-user-name">Общий чат</div>
                <div className="chat-user-status">Онлайн</div>
              </div>
            </div>
          </div>
          
          <div className="messages-container">
            <div className="messages-list">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-item ${msg.user === username ? 'own' : ''}`}>
                  <div className="message-avatar">
                    {msg.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      <strong>{msg.user}:</strong> {msg.text}
                    </div>
                    <div className="message-time">
                      {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <form onSubmit={handleSend} className="message-form">
            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Введите сообщение..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn">➤</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Messenger;

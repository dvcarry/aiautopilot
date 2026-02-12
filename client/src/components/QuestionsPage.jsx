import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './QuestionsPage.css'

function QuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/answers')
      if (!response.ok) {
        throw new Error('Ошибка при загрузке вопросов')
      }
      const data = await response.json()
      setQuestions(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question)
    setDrawerOpen(true)
  }

  const handleStatusChange = async (newStatus) => {
    if (!selectedQuestion) return

    try {
      const response = await fetch(`/api/answers/${selectedQuestion.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса')
      }

      // Обновляем локальное состояние
      setSelectedQuestion(prev => ({ ...prev, status: newStatus }))
      setQuestions(prev => 
        prev.map(q => 
          q.id === selectedQuestion.id ? { ...q, status: newStatus } : q
        )
      )
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err)
    }
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedQuestion(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#007bff'
      case 'adding': return '#ffc107'
      case 'done': return '#28a745'
      default: return '#6c757d'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый'
      case 'adding': return 'В работе'
      case 'done': return 'Выполнено'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="questions-page">
        <div className="loader">
          <div className="spinner"></div>
          <p>Загрузка вопросов...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="questions-page">
        <div className="error">
          Ошибка: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="questions-page">
      <div className="questions-header">
        <h1>Все вопросы</h1>
        <a href="/" className="back-link">← Назад к чату</a>
      </div>

      {questions.length === 0 ? (
        <div className="no-questions">
          <p>Пока нет заданных вопросов</p>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((question) => (
            <div
              key={question.id}
              className="question-item"
              onClick={() => handleQuestionClick(question)}
            >
              <div className="question-content">
                <p className="question-text">{question.question}</p>
                <div className="question-meta">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(question.status) }}
                  >
                    {getStatusText(question.status)}
                  </span>
                  <span className="question-date">
                    {new Date(question.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Дровер */}
      {drawerOpen && selectedQuestion && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer}></div>
          <div className="drawer">
            <div className="drawer-header">
              <h2>Детали вопроса</h2>
              <button className="close-button" onClick={closeDrawer}>×</button>
            </div>
            
            <div className="drawer-content">
              <div className="drawer-section">
                <h3>Вопрос:</h3>
                <div className="question-display">
                  {selectedQuestion.question}
                </div>
              </div>

              <div className="drawer-section">
                <h3>Ответ:</h3>
                <div className="answer-display">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({children}) => <div style={{margin: '0.5rem 0', lineHeight: '1.6'}}>{children}</div>,
                      strong: ({children}) => <strong style={{display: 'inline'}}>{children}</strong>,
                      em: ({children}) => <em style={{display: 'inline'}}>{children}</em>
                    }}
                  >
                    {selectedQuestion.answer.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Статус:</h3>
                <select 
                  value={selectedQuestion.status} 
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="status-select"
                >
                  <option value="new">Новый</option>
                  <option value="adding">В работе</option>
                  <option value="done">Выполнено</option>
                </select>
              </div>

              <div className="drawer-section">
                <h3>Дата создания:</h3>
                <p>{new Date(selectedQuestion.createdAt).toLocaleString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default QuestionsPage
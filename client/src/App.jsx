import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import QuestionsPage from './components/QuestionsPage'
import './App.css'

function ChatPage() {
  const [question, setQuestion] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(true)
  const textareaRef = useRef(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px'
    }
  }

  const handleTextareaChange = (e) => {
    setQuestion(e.target.value)
    adjustTextareaHeight()
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [question])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setSubmittedQuestion(question)
    setShowForm(false)
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при отправке запроса')
      }

      const data = await response.json()
      setAnswer(data.response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Ошибка при копировании:', err)
    }
  }

  const handleNewQuestion = () => {
    window.location.reload()
  }

  return (
    <div className="chat-container">
      <h1>AI Автопилот</h1>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="chat-form">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleTextareaChange}
            placeholder="Введите ваш вопрос..."
            rows={4}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !question.trim()}>
            Отправить
          </button>
        </form>
      )}

      {!showForm && submittedQuestion && (
          <div className="question">
            <strong>Вопрос:</strong> {submittedQuestion}
          </div>
      )}

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Обрабатываю ваш запрос...</p>
        </div>
      )}

      {error && (
        <div className="error">
          Ошибка: {error}
        </div>
      )}

      {answer && !loading && (
        <div>
          <div className="answer">
            <strong>Ответ:</strong>
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({children}) => <div style={{margin: '0.5rem 0', lineHeight: '1.6'}}>{children}</div>,
                  strong: ({children}) => <strong style={{display: 'inline'}}>{children}</strong>,
                  em: ({children}) => <em style={{display: 'inline'}}>{children}</em>
                }}
              >
                {answer.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')}
              </ReactMarkdown>
            </div>
          </div>
          <div className="action-buttons">
            <button onClick={handleCopyAnswer} className="copy-button">
              Скопировать ответ
            </button>
            <button onClick={handleNewQuestion} className="new-question-button">
              Новый вопрос
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
      </Routes>
    </Router>
  )
}

export default App

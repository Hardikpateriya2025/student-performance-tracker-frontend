import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getStudents } from '../api/analytics'
import { askTutor } from '../api/tutor'

export default function Tutor() {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getStudents().then((res) => {
      setStudents(res.data)
      if (res.data.length > 0) setSelectedStudentId(res.data[0].id)
    })
  }, [])

  async function handleAsk(e) {
    e.preventDefault()
    if (!question.trim() || !selectedStudentId) return

    const userMessage = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setQuestion('')
    setError('')
    setLoading(true)

    try {
      const res = await askTutor(selectedStudentId, userMessage.content)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reach the tutor service')
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent = students.find((s) => s.id === Number(selectedStudentId))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">AI Tutor</h1>
        <p className="text-sm text-slate-500 mb-4">
          Ask questions about a student's performance — answers are grounded in their real grade data.
        </p>

        <div className="mb-4">
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value)
              setMessages([])
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.roll_number} ({s.class_name})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-96 overflow-y-auto flex flex-col gap-3 mb-4">
          {messages.length === 0 && (
            <p className="text-slate-400 text-sm m-auto">
              Ask something like "How is {selectedStudent?.roll_number || 'this student'} doing?"
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white self-end'
                  : 'bg-slate-100 text-slate-800 self-start'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="bg-slate-100 text-slate-500 text-sm px-4 py-2 rounded-lg self-start">
              Thinking...
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this student..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  )
}

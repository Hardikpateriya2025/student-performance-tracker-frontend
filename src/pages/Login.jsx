import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-3 rounded-2xl shadow-lg shadow-violet-200 mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold gradient-text text-center">
            Student Performance Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">Smarter tracking. Better outcomes.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-violet-100 border border-violet-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Log in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-2">
      <div className="w-full max-w-sm rounded-2xl bg-white/90 p-6 sm:p-8 shadow-2xl dark:bg-slate-900/80">
        <div className="flex flex-col items-center mb-6">
          <span className="h-12 w-12 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-2" />
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-pink-400">
            Welcome Back!
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Sign in to continue to Insta Reels.
          </p>
        </div>
        <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              className="text-sm text-slate-700 dark:text-slate-300"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm outline-none ring-indigo-500/60 focus:border-indigo-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="your username"
              required
            />
          </div>
          <div className="space-y-1">
            <label
              className="text-sm text-slate-700 dark:text-slate-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm outline-none ring-indigo-500/60 focus:border-indigo-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
          >
            Continue
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Don't have an account?
          </span>
          <a
            href="/register"
            className="ml-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-pink-400"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login



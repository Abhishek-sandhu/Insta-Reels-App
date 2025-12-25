import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'insta_reels_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || null)
        setToken(parsed.token || null)
      }
    } catch (err) {
      console.error('Failed to parse stored auth', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh user details (e.g., profile fields) when token is present
  useEffect(() => {
    const load = async () => {
      if (!token) return
      try {
        const { data } = await AuthService.me()
        setUser((prev) => ({ ...prev, ...data }))
      } catch (err) {
        // ignore
      }
    }
    load()
  }, [token])

  // Persist auth state whenever it changes
  useEffect(() => {
    const payload = JSON.stringify({ user, token })
    localStorage.setItem(STORAGE_KEY, payload)
  }, [user, token])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}



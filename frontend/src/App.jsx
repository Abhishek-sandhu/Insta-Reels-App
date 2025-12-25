import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Feed from './pages/Feed.jsx'
import Reels from './pages/Reels.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import AppLayout from './components/AppLayout.jsx'
import Messages from './pages/Messages.jsx'
import { useAuth } from './context/AuthContext.jsx'

function PageShell({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PageShell>
              <Login />
            </PageShell>
          }
        />
        <Route
          path="/register"
          element={
            <PageShell>
              <Register />
            </PageShell>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <PageShell>
                  <Feed />
                </PageShell>
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reels"
          element={
            <PrivateRoute>
              <AppLayout>
                <PageShell>
                  <Reels />
                </PageShell>
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <PageShell>
                  <Profile />
                </PageShell>
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <AppLayout>
                <PageShell>
                  <Messages />
                </PageShell>
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageShell>
              <NotFound />
            </PageShell>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

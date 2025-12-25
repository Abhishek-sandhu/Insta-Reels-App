import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { FiHome, FiFilm, FiUser, FiLogOut, FiPlus, FiSun, FiMoon } from 'react-icons/fi'

const navLinkClasses =
  'flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-pink-400 transition-colors px-3 py-2 rounded-lg'

function Navbar({ onOpenCreate }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur shadow-lg dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow" />
          <span className="text-lg font-bold tracking-tight text-indigo-600 dark:text-pink-400">
            Insta Reels
          </span>
        </Link>
        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive ? 'bg-indigo-100 dark:bg-pink-900/30' : ''
              }`
            }
          >
            <FiHome className="text-lg" /> Feed
          </NavLink>
          <NavLink
            to="/reels"
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive ? 'bg-indigo-100 dark:bg-pink-900/30' : ''
              }`
            }
          >
            <FiFilm className="text-lg" /> Reels
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive ? 'bg-indigo-100 dark:bg-pink-900/30' : ''
              }`
            }
          >
            <FiUser className="text-lg" /> Profile
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-xl text-slate-700 hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-pink-400 dark:hover:bg-pink-900/30"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="hidden rounded-full border border-indigo-500/60 px-3 py-1 text-xs font-medium text-indigo-100 hover:bg-indigo-500/10 sm:inline-flex"
          >
            <FiPlus className="mr-1" /> Create
          </button>
          {isAuthenticated && user ? (
            <>
              <button
                type="button"
                className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-500 sm:inline-flex"
                onClick={logout}
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
              <Link
                to="/profile"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-xs font-semibold text-white shadow"
              >
                {user.username?.[0]?.toUpperCase() || 'U'}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-xs font-medium text-slate-300 hover:text-indigo-600 sm:inline-block"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar



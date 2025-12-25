import { NavLink } from 'react-router-dom'
import { FiHome, FiFilm, FiUser, FiPlus } from 'react-icons/fi'

const baseClasses =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-colors shadow-sm'

function Sidebar({ onOpenCreate }) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white/90 px-3 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950/80 sm:flex rounded-xl">
      <nav className="space-y-2 text-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? 'bg-indigo-100 text-indigo-600 dark:bg-pink-900/30 dark:text-pink-400' : ''}`
          }
        >
          <FiHome className="text-lg mr-2" /> Feed
        </NavLink>
        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-3 w-full flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 px-3 py-2 text-center text-sm font-medium text-white shadow hover:scale-105 transition-transform"
        >
          <FiPlus className="text-lg mr-1" /> + Create post
        </button>
        <NavLink
          to="/reels"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? 'bg-indigo-100 text-indigo-600 dark:bg-pink-900/30 dark:text-pink-400' : ''}`
          }
        >
          <FiFilm className="text-lg mr-2" /> Reels
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? 'bg-indigo-100 text-indigo-600 dark:bg-pink-900/30 dark:text-pink-400' : ''}`
          }
        >
          <FiUser className="text-lg mr-2" /> Profile
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar



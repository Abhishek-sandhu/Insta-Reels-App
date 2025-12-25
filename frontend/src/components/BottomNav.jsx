import { NavLink } from 'react-router-dom'

function BottomNav({ onOpenCreate }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex h-14 items-center justify-around border-t border-slate-800 bg-slate-950/90 backdrop-blur sm:hidden">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${
            isActive ? 'text-slate-50' : 'text-slate-400'
          }`
        }
      >
        <span className="mb-0.5 h-1 w-6 rounded-full bg-slate-700" />
        Feed
      </NavLink>
      <button
        type="button"
        onClick={onOpenCreate}
        className="flex flex-col items-center text-xs text-slate-50"
      >
        <span className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-base">
          +
        </span>
        Create
      </button>
      <NavLink
        to="/reels"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${
            isActive ? 'text-slate-50' : 'text-slate-400'
          }`
        }
      >
        <span className="mb-0.5 h-1 w-6 rounded-full bg-pink-500" />
        Reels
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${
            isActive ? 'text-slate-50' : 'text-slate-400'
          }`
        }
      >
        <span className="mb-0.5 h-1 w-6 rounded-full bg-sky-500" />
        Profile
      </NavLink>
    </nav>
  )
}

export default BottomNav



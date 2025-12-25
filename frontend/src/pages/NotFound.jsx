import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-50">
      <p className="text-sm font-medium text-indigo-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist. Go back to your feed
        and keep scrolling.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Go to Feed
      </Link>
    </div>
  )
}

export default NotFound



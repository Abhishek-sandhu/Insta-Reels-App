import React, { useState } from 'react'
import { UserService } from '../services/UserService'

export default function UserSearchList({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    setQuery(e.target.value)
    if (e.target.value.length < 2) {
      setResults([])
      setError('')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await UserService.searchUsers(e.target.value)
      setResults(res.data)
    } catch (err) {
      setError('No users found')
      setResults([])
    }
    setLoading(false)
  }

  return (
    <div className="w-full">
      <input
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
      />
      {loading && <div className="text-xs text-slate-400">Searching...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
      <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {results.map(user => (
          <button
            key={user.id}
            className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            onClick={() => onSelect(user)}
            type="button"
          >
            <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">{user.username}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

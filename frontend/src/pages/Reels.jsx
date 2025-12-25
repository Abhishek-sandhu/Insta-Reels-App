import { useCallback, useMemo, useState, useEffect } from 'react'
import ReelCard from '../components/ReelCard.jsx'
import { PostService } from '../services/PostService.js'

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const normalizeMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads')) return `${API_ORIGIN}${url}`
  return url
}

const FALLBACK_REELS = []

function Reels() {
  const [reels, setReels] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { data } = await PostService.list()
        const mapped = (data || [])
          .filter((p) => {
            const type = p.type || (/\.mp4|\.webm|\.mov|\.m4v/i.test(p.mediaUrl || '') ? 'video' : 'image')
            return type === 'video'
          })
          .map((p) => {
            const username = p.user?.username || p.username || 'user'
            const videoUrl = normalizeMediaUrl(p.mediaUrl || p.videoUrl)
            if (!videoUrl || videoUrl.startsWith('blob:')) return null
            return {
              id: p._id || p.id,
              username,
              userInitials: username.slice(0, 2).toUpperCase(),
              caption: p.caption || '',
              hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
              likes: p.likes ?? 0,
              comments: p.commentsCount ?? 0,
              shares: p.shares ?? 0,
              timeAgo: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'just now',
              audio: p.audio || 'Original audio',
              videoUrl,
            }
          })
          .filter(Boolean)

        const finalReels = mapped.length ? mapped : FALLBACK_REELS
        if (!cancelled) {
          setReels(finalReels)
          if (finalReels.length > 0) setActiveId(finalReels[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch reels:', err)
        if (!cancelled) {
          setReels(FALLBACK_REELS)
          if (FALLBACK_REELS.length > 0) setActiveId(FALLBACK_REELS[0].id)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const activeIndex = useMemo(
    () => (reels && activeId ? reels.findIndex((r) => r.id === activeId) : -1),
    [activeId, reels],
  )

  const handleVisible = useCallback((id) => {
    setActiveId(id)
  }, [])

  const toggleMute = () => setMuted((m) => !m)

  return (
    <div className="flex h-screen w-full snap-y snap-mandatory flex-col overflow-y-scroll bg-black text-slate-50 sm:h-screen sm:px-0 px-1">
      {reels && reels.length > 0 ? (
        reels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            isActive={activeId === reel.id}
            onVisible={handleVisible}
            index={reels.findIndex((r) => r.id === reel.id)}
            total={reels.length}
            muted={muted}
            onToggleMute={toggleMute}
          />
        ))
      ) : (
        <div className="text-center py-10">No reels available.</div>
      )}
    </div>
  )
}

export default Reels

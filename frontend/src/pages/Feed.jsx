import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard.jsx'
import UserSearchList from '../components/UserSearchList.jsx'
import { PostService } from '../services/PostService.js'

const STORIES = [
  { id: 's1', label: 'You', color: 'from-indigo-500 to-purple-500', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 's2', label: 'BTS', color: 'from-fuchsia-500 to-amber-400', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 's3', label: 'Travel', color: 'from-emerald-400 to-cyan-500', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 's4', label: 'Edits', color: 'from-indigo-500 to-purple-500', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 's5', label: 'Gear', color: 'from-sky-400 to-pink-400', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 's6', label: 'Color', color: 'from-amber-400 to-rose-500', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
]

const FALLBACK_POSTS = [
  {
    id: '1',
    type: 'image',
    caption: 'Golden hour vibes on the rooftop. 🌇',
    likes: 1204,
    commentsCount: 42,
    hashtags: ['sunset', 'citylife', 'goldenhour'],
    timeAgo: '2h ago',
    location: 'Mumbai, India',
    imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    type: 'video',
    caption: 'Quick transitions tutorial for short-form edits. ✂️',
    likes: 3820,
    commentsCount: 98,
    hashtags: ['reels', 'editing', 'tutorial'],
    timeAgo: '5h ago',
    location: 'Creator Studio',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: '3',
    type: 'image',
    caption: 'Studio setup for shooting vertical content.',
    likes: 947,
    commentsCount: 19,
    hashtags: ['setup', 'behindthescenes', 'contentcreator'],
    timeAgo: '1d ago',
    location: 'Home',
    imageUrl: 'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    type: 'video',
    caption: 'Day-in-the-life of a short-form creator. ☕🎬',
    likes: 5810,
    commentsCount: 131,
    hashtags: ['dayinthelife', 'creator', 'workflow'],
    timeAgo: '1d ago',
    location: 'Bangalore, India',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  },
  {
    id: '5',
    type: 'image',
    caption: 'Exploring the city lights at night.',
    likes: 2345,
    commentsCount: 56,
    hashtags: ['night', 'city', 'explore'],
    timeAgo: '3h ago',
    location: 'New York, USA',
    imageUrl: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    type: 'video',
    caption: 'Timelapse of clouds rolling over the hills.',
    likes: 3200,
    commentsCount: 70,
    hashtags: ['timelapse', 'clouds', 'nature'],
    timeAgo: '10h ago',
    location: 'Hilltop',
    videoUrl: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
  },
]

function formatTimeAgo(dateString) {
  if (!dateString) return 'just now'
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diff = Math.max(0, now - then)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const normalizeMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads')) return `${API_ORIGIN}${url}`
  return url
}

function StoryStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {STORIES.map((story) => (
        <div key={story.id} className="flex w-16 flex-col items-center gap-1">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr ${story.color} text-[11px] font-semibold text-white shadow`}
          >
            {story.label.slice(0, 4)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {story.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-1 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <div className="h-72 w-full bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}

function Feed() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTab, setSearchTab] = useState('Posts')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await PostService.list()
        const mapped = (data || []).map((p) => {
          const type = p.type || (/\.mp4|\.webm|\.mov|\.m4v/i.test(p.mediaUrl || '') ? 'video' : 'image')
          const mediaRaw = p.mediaUrl || (type === 'image' ? p.imageUrl : p.videoUrl)
          const media = normalizeMediaUrl(mediaRaw)
          if (!media || media.startsWith('blob:')) return null
          return {
            id: p._id || p.id,
            type,
            caption: p.caption || '',
            likes: p.likes ?? 0,
            commentsCount: p.commentsCount ?? 0,
            hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
            timeAgo: formatTimeAgo(p.createdAt),
            location: p.location || '',
            imageUrl: type === 'image' ? media : undefined,
            videoUrl: type === 'video' ? media : undefined,
          }
        }).filter(Boolean)
        if (!cancelled) {
          setPosts(mapped.length ? mapped : FALLBACK_POSTS)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load posts. Please try again.')
          setPosts(FALLBACK_POSTS)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Filter posts by search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts
    const term = searchTerm.toLowerCase()
    return posts.filter(
      (post) =>
        (post.caption && post.caption.toLowerCase().includes(term)) ||
        (post.hashtags && post.hashtags.some((tag) => tag.toLowerCase().includes(term))),
    )
  }, [posts, searchTerm])

  // Example trending hashtags
  const trendingHashtags = [
    'reels', 'travel', 'editing', 'cinematic', 'workflow', 'sunset', 'friends', 'nature', 'gear', 'tutorial'
  ]

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-0 w-full max-w-md shadow-2xl relative border border-indigo-100 dark:border-slate-800">
            <button className="absolute top-2 right-3 text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" onClick={() => { setSearchOpen(false); setSearchTerm(''); setSearchTab('Posts') }} aria-label="Close">×</button>
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              {['Posts', 'Users', 'Trending'].map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${searchTab === tab ? 'text-indigo-500 border-b-2 border-indigo-500 dark:text-pink-400 dark:border-pink-400 bg-indigo-50 dark:bg-slate-900/40' : 'text-slate-500 dark:text-slate-400'}`}
                  onClick={() => setSearchTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-5">
              {searchTab === 'Posts' && (
                <>
                  <input
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                    placeholder="Search posts or hashtags..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredPosts.length === 0 && <div className="text-center text-slate-400 py-4">No results found.</div>}
                    {filteredPosts.map(post => (
                      <div key={post.id} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{post.caption}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{post.hashtags && post.hashtags.map(tag => `#${tag}`).join(' ')}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {searchTab === 'Users' && (
                <UserSearchList onSelect={user => { setSearchOpen(false); navigate(`/profile/${user.id}`) }} />
              )}
              {searchTab === 'Trending' && (
                <div className="grid grid-cols-2 gap-2">
                  {trendingHashtags.map(tag => (
                    <button
                      key={tag}
                      className="rounded-lg bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-white px-3 py-2 font-semibold shadow hover:from-indigo-600 hover:to-pink-500 transition-colors text-xs"
                      onClick={() => { setSearchTab('Posts'); setSearchTerm(tag) }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">Insta Reels</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xl text-slate-500 dark:text-slate-300" onClick={() => setSearchOpen(true)} aria-label="Search">🔍</button>
          <button className="text-xl text-slate-500 dark:text-slate-300" onClick={() => navigate('/messages')} aria-label="Messages">💬</button>
        </div>
      </nav>
      {/* Stories Section */}
      <section className="mx-auto mb-4 mt-2 flex max-w-xl gap-4 overflow-x-auto pb-2 px-2 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1"
          >
            <span className={`h-14 w-14 rounded-full border-2 border-pink-500 p-0.5 bg-gradient-to-tr ${story.color} flex items-center justify-center shadow-lg transition-transform hover:scale-105`}>
              <img src={story.avatar} alt={story.label} className="h-12 w-12 rounded-full object-cover border-2 border-white" />
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{story.label}</span>
          </div>
        ))}
      </section>
      {/* Posts */}
      <section className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-4 px-1 sm:px-2">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/30 dark:text-amber-100">
            {error}
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-lg bg-amber-600 px-3 py-1 text-white"
                onClick={() => {
                  // trigger refetch by re-running effect
                  setLoading(true)
                  setError('')
                  PostService.list()
                    .then(({ data }) => {
                      const mapped = (data || []).map((p) => {
                        const type = p.type || (/\.mp4|\.webm|\.mov|\.m4v/i.test(p.mediaUrl || '') ? 'video' : 'image')
                        return {
                          id: p._id || p.id,
                          type,
                          caption: p.caption || '',
                          likes: p.likes ?? 0,
                          commentsCount: p.commentsCount ?? 0,
                          hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
                          timeAgo: formatTimeAgo(p.createdAt),
                          location: p.location || '',
                          imageUrl: type === 'image' ? p.mediaUrl || p.imageUrl : undefined,
                          videoUrl: type === 'video' ? p.mediaUrl || p.videoUrl : undefined,
                        }
                      })
                      setPosts(mapped.length ? mapped : FALLBACK_POSTS)
                    })
                    .catch(() => setError('Could not load posts. Please try again.'))
                    .finally(() => setLoading(false))
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            No posts yet.
          </div>
        )}

        {!loading && !error &&
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </section>
    </div>
  )
}

export default Feed

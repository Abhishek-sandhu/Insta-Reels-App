import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useEffect } from 'react'
import { PostService } from '../services/PostService.js'
import { useAuth } from '../context/AuthContext'

const dummyUser = {
  username: 'reels_creator',
  avatar: 'RC',
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState('')
  const { token, user } = useAuth()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { data } = await PostService.getComments(post.id)
        if (!cancelled) setComments(data || [])
      } catch (err) {
        if (!cancelled) setComments([])
      }
    }
    load()
    return () => { cancelled = true }
  }, [post.id])

  const toggleLike = () => {
    setLiked((prev) => !prev)
    setLikes((prev) => prev + (liked ? -1 : 1))
  }

  const toggleSave = () => {
    setSaved((prev) => !prev)
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return
    setCommentLoading(true)
    try {
      const { data } = await PostService.addComment(post.id, commentText.trim())
      setComments((prev) => [data, ...prev])
      setCommentText('')
    } catch (err) {
      // optionally surface error
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return
    setDeletingCommentId(commentId)
    try {
      await PostService.deleteComment(post.id, commentId)
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      // optionally surface error
    } finally {
      setDeletingCommentId('')
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-lg dark:shadow-slate-950/40"
    >
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            {dummyUser.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {dummyUser.username}
            </span>
            <span className="text-xs text-slate-500">{post.timeAgo}</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {post.location}
        </span>
      </header>

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        {!mediaError && post.type === 'image' && post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setMediaError(true)}
          />
        ) : !mediaError && post.type === 'video' && post.videoUrl ? (
          <video
            src={post.videoUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            controls
            onError={() => setMediaError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/40 to-emerald-400/40">
            <span className="text-sm font-medium text-slate-800/90 dark:text-slate-50/80">
              Media unavailable
            </span>
          </div>
        )}
      </div>

      <footer className="space-y-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLike}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <AnimatePresence initial={false}>
                {liked && (
                  <motion.span
                    key="burst"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-pink-500/30"
                    initial={{ scale: 0.4, opacity: 0.8 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </AnimatePresence>
              <motion.span
                animate={{ scale: liked ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className={liked ? 'text-pink-400' : ''}
              >
                {liked ? '♥' : '♡'}
              </motion.span>
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              💬
            </button>
          </div>

          <button
            type="button"
            onClick={toggleSave}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {saved ? '🔖' : '📎'}
          </button>
        </div>

        <div className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold">{likes.toLocaleString()} likes</span>
        </div>

        <p className="text-sm text-slate-800 dark:text-slate-200">
          <span className="mr-1 font-semibold">{dummyUser.username}</span>
          {post.caption}
        </p>

        <div className="flex flex-wrap gap-1 text-xs text-indigo-500 dark:text-indigo-300">
          {post.hashtags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? 'Add a comment...' : 'Login to comment'}
              disabled={!user || commentLoading}
              className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            />
            <button
              type="button"
              onClick={handleCommentSubmit}
              disabled={!user || commentLoading || !commentText.trim()}
              className="rounded-lg bg-indigo-500 px-3 py-1 text-white text-[12px] disabled:opacity-50"
            >
              {commentLoading ? '...' : 'Post'}
            </button>
          </div>

          {comments.slice(0, 3).map((c) => {
            const canDelete = user && c.user && c.user.username && user.username && c.user.username.toLowerCase() === user.username.toLowerCase()
            return (
              <div key={c._id} className="flex items-start gap-2 leading-snug">
                <p className="flex-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{c.user?.username || 'user'}</span>{' '}
                  <span className="text-slate-600 dark:text-slate-300">{c.text}</span>
                </p>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(c._id)}
                    disabled={deletingCommentId === c._id}
                    className="text-[11px] text-red-500 hover:underline disabled:opacity-50"
                  >
                    {deletingCommentId === c._id ? '...' : 'Delete'}
                  </button>
                )}
              </div>
            )
          })}

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            {comments.length === 0 ? 'No comments yet.' : `View all ${comments.length} comments`}
          </div>
        </div>
      </footer>
    </motion.article>
  )
}

export default PostCard



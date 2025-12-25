import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView.js'

const toInstagramEmbed = (url) => {
  if (!url) return ''
  try {
    const u = new URL(url)
    const match = u.pathname.match(/\/reel\/([^/]+)/)
    const id = match?.[1]
    if (id) return `https://www.instagram.com/reel/${id}/embed`
  } catch (e) {
    return url
  }
  return `${url}${url.includes('?') ? '&' : '?'}embed=1`
}

function ReelCard({ reel, isActive, onVisible, index, total, muted, onToggleMute }) {
  const videoRef = useRef(null)
  const { ref, inView } = useInView({ threshold: 0.75 })
  const [likedOverlay, setLikedOverlay] = useState(false)
  const isYouTube = useMemo(
    () => reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be'),
    [reel.videoUrl],
  )
  const isInstagram = useMemo(
    () => reel.videoUrl.includes('instagram.com'),
    [reel.videoUrl],
  )
  const instagramEmbed = useMemo(() => (isInstagram ? toInstagramEmbed(reel.videoUrl) : ''), [isInstagram, reel.videoUrl])

  // When the card becomes visible, inform parent which reel is active
  useEffect(() => {
    if (inView) {
      onVisible(reel.id)
    }
  }, [inView, onVisible, reel.id])

  // Auto play / pause based on active state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video
        .play()
        .catch(() => {
          // autoplay may be blocked on some browsers; ignore for now
        })
    } else {
      video.pause()
    }
  }, [isActive])

  const handleDoubleClick = () => {
    setLikedOverlay(true)
    setTimeout(() => setLikedOverlay(false), 700)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen snap-start items-center justify-center bg-black"
    >
      <div className="relative h-[90vh] w-full max-w-sm overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 text-slate-50 shadow-2xl">
        {/* Video, YouTube, Instagram */}
        {isYouTube ? (
          <iframe
            className="h-full w-full object-cover"
            src={reel.videoUrl.replace('/shorts/', '/embed/') + (isActive ? '?autoplay=1' : '')}
            title="YouTube Shorts"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isInstagram ? (
          <iframe
            className="h-full w-full object-cover"
            src={instagramEmbed}
            title="Instagram Reel"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted={muted}
            loop
            playsInline
            {...(isActive ? { autoPlay: true } : {})}
            src={reel.videoUrl}
            onDoubleClick={handleDoubleClick}
          />
        )}

        {/* Overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        {/* Reel index rail */}
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-8 w-1 rounded-full transition ${
                i === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Top user bar */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-3 text-xs text-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-[10px] font-semibold">
              {reel.userInitials}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">@{reel.username}</span>
              <span className="text-[11px] text-slate-300">{reel.audio}</span>
            </div>
          </div>
          <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-slate-200">
            {reel.timeAgo}
          </span>
        </div>

        {/* Bottom actions + caption */}
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-3 pb-6 pt-4 text-slate-50">
          <div className="max-w-[70%] space-y-1 text-xs">
            <p className="font-semibold">@{reel.username}</p>
            <p className="text-[11px] text-slate-100">{reel.caption}</p>
            <p className="mt-1 text-[11px] text-indigo-200">
              {reel.hashtags.map((tag) => `#${tag}`).join(' ')}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-xs">
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center gap-1"
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base">
                ♥
              </span>
              <span>{reel.likes.toLocaleString()}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center gap-1"
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base">
                💬
              </span>
              <span>{reel.comments}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center gap-1"
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base">
                ↗
              </span>
              <span>{reel.shares}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onToggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base"
            >
              {muted ? '🔇' : '🔊'}
            </motion.button>
          </div>
        </div>

        {/* Like overlay */}
        <AnimatePresence>
          {likedOverlay && (
            <motion.span
              key="like-overlay"
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-6xl text-white/80"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              ♥
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ReelCard



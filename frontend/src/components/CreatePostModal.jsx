import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

function Backdrop({ children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/90 p-3 sm:p-6 text-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  )
}

function CreatePostModal({ open, onClose }) {
  const { token } = useAuth();
  const [previewType, setPreviewType] = useState('image');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setPreviewType(file.type.startsWith('video') ? 'video' : 'image');
    setMediaUrl('');
    setUseUrl(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    setError('');
    if (!mediaFile && !mediaUrl) {
      setError('Please select a file or provide a media URL.');
      return;
    }
    setLoading(true);
    try {
      let finalMediaUrl = mediaUrl;

      // If using file, upload first; otherwise use provided URL
      if (!useUrl) {
        const formData = new FormData();
        formData.append('media', mediaFile);
        const uploadRes = await fetch('/api/posts/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) throw new Error('Failed to upload media');
        finalMediaUrl = uploadData.url;
      }

      const tags = hashtags.split(/[#\s]+/).filter(Boolean);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: previewType,
          mediaUrl: finalMediaUrl,
          caption,
          hashtags: tags,
        }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-indigo-400">Create New Post</h2>
                <p className="mt-1 text-xs text-slate-400">Share your best moments with the world!</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Left: Upload and fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Media (image / video)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewType('image')}
                      className={`flex-1 rounded-lg border px-2 py-1 text-xs ${previewType === 'image' ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100' : 'border-slate-700 bg-slate-900 text-slate-300'}`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewType('video')}
                      className={`flex-1 rounded-lg border px-2 py-1 text-xs ${previewType === 'video' ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100' : 'border-slate-700 bg-slate-900 text-slate-300'}`}
                    >
                      Video
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => { setUseUrl(false); setMediaUrl(''); }}
                      className={`flex-1 rounded-lg border px-2 py-1 ${!useUrl ? 'border-indigo-400 bg-indigo-500/15 text-indigo-100' : 'border-slate-700 bg-slate-900 text-slate-300'}`}
                    >
                      Upload file
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUseUrl(true); setMediaFile(null); }}
                      className={`flex-1 rounded-lg border px-2 py-1 ${useUrl ? 'border-indigo-400 bg-indigo-500/15 text-indigo-100' : 'border-slate-700 bg-slate-900 text-slate-300'}`}
                    >
                      Use URL
                    </button>
                  </div>

                  {!useUrl && (
                    <>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <div
                        className="flex h-20 items-center justify-center rounded-lg border border-dashed border-indigo-500 bg-slate-950/80 text-xs text-indigo-300 cursor-pointer hover:bg-indigo-950/40"
                        onClick={handleUploadClick}
                      >
                        {mediaFile ? mediaFile.name : 'Click to choose file'}
                      </div>
                    </>
                  )}

                  {useUrl && (
                    <input
                      type="url"
                      placeholder="https://example.com/your-image.jpg"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-100 outline-none ring-indigo-500/50 focus:border-indigo-500 focus:ring"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300" htmlFor="caption">Caption</label>
                  <textarea
                    id="caption"
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none ring-indigo-500/50 focus:border-indigo-500 focus:ring"
                    placeholder="Write something about your post..."
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300" htmlFor="hashtags">Hashtags</label>
                  <input
                    id="hashtags"
                    type="text"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none ring-indigo-500/50 focus:border-indigo-500 focus:ring"
                    placeholder="#reels #editing #travel"
                    value={hashtags}
                    onChange={e => setHashtags(e.target.value)}
                  />
                </div>
                {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
              </div>

              {/* Right: Preview */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-300">Preview</p>
                <div className="flex items-center justify-center rounded-2xl border border-indigo-500 bg-slate-900/70 p-3">
                  <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-xl bg-slate-800">
                    {(!useUrl && mediaFile) ? (
                      previewType === 'image' ? (
                        <img src={URL.createObjectURL(mediaFile)} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <video src={URL.createObjectURL(mediaFile)} className="h-full w-full object-cover" controls />
                      )
                    ) : (useUrl && mediaUrl) ? (
                      previewType === 'image' ? (
                        <img src={mediaUrl} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <video src={mediaUrl} className="h-full w-full object-cover" controls />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-200">No media selected</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-3 py-1 font-medium text-white shadow-lg hover:bg-indigo-400"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default CreatePostModal



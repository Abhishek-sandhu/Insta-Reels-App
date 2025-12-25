import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PostService } from '../services/PostService.js'
import { AuthService } from '../services/api'

const INITIAL_PROFILE = {
  username: 'reels_creator',
  name: 'Reels Creator',
  bio: 'Sharing edits, transitions, and BTS of short-form video.',
  avatarInitials: 'RC',
  avatarUrl: '',
  stats: {
    posts: 124,
    followers: 10800,
    following: 326,
  },
  badges: ['Creator', 'Video Editor', 'Travel'],
};

const HIGHLIGHTS = [
  { id: 'h1', label: 'Edits', color: 'from-indigo-500 to-fuchsia-500' },
  { id: 'h2', label: 'Travel', color: 'from-amber-400 to-pink-500' },
  { id: 'h3', label: 'BTS', color: 'from-emerald-400 to-teal-500' },
  { id: 'h4', label: 'Gear', color: 'from-sky-400 to-pink-400' },
];

const PROFILE_STORE_KEY = 'insta_reels_profile';

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizeMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${API_ORIGIN}${url}`;
  return url;
};

function EditProfileModal({ open, profile, onClose, onSave }) {
  const [form, setForm] = useState(profile);
  useEffect(() => { setForm(profile); }, [profile, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/60 via-fuchsia-900/40 to-amber-200/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 w-full max-w-md shadow-2xl relative border border-indigo-100 dark:border-slate-800">
        <button className="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={onClose} aria-label="Close">×</button>
        <div className="flex flex-col items-center mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-3xl font-bold text-white shadow-lg mb-2">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              form.avatarInitials || 'U'
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">Edit Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your public profile info</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Avatar Initials</label>
            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.avatarInitials} maxLength={3} onChange={e => setForm(f => ({...f, avatarInitials: e.target.value.toUpperCase()}))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Avatar URL</label>
            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.avatarUrl} onChange={e => setForm(f => ({...f, avatarUrl: e.target.value.trim()}))} placeholder="https://example.com/avatar.jpg" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Username</label>
            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value.trim()}))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Name</label>
            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Bio</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Badges <span className="font-normal text-slate-400">(comma separated)</span></label>
            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.badges.join(', ')} onChange={e => setForm(f => ({...f, badges: e.target.value.split(',').map(b => b.trim()).filter(Boolean)}))} />
          </div>
          <button type="submit" className="w-full mt-2 rounded-lg bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-white py-2 font-bold shadow hover:from-indigo-600 hover:to-pink-500 transition-colors">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

function MediaCard({ type, src, poster }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(type === 'video');

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-200 dark:bg-slate-800 rounded-xl">
        <span className="text-xs text-red-500">Media failed to load</span>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <img
        src={src}
        alt="Post"
        className="h-full w-full object-cover rounded-xl"
        loading="lazy"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-xl">
          <span className="text-xs text-white">Loading...</span>
        </div>
      )}
      <video
        src={src}
        poster={poster}
        controls
        className="h-full w-full object-cover rounded-xl"
        onLoadedData={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editOpen, setEditOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const { user } = useAuth();

  // Load persisted profile overrides (avatar, bio, etc.) once (kept as fallback)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Fetch profile from backend when authenticated
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const { data } = await AuthService.me();
        setProfile((prev) => ({
          ...prev,
          username: data.username || prev.username,
          name: data.name || data.username || prev.name,
          bio: data.bio ?? prev.bio,
          avatarUrl: data.avatarUrl ?? prev.avatarUrl,
          avatarInitials: prev.avatarInitials || (data.username ? data.username.slice(0, 2).toUpperCase() : prev.avatarInitials),
        }));
      } catch (err) {
        // ignore fetch errors
      }
    };
    load();
  }, [user]);

  // Sync profile header with logged-in user
  useEffect(() => {
    if (user?.username) {
      setProfile((prev) => ({
        ...prev,
        username: user.username,
        name: prev.name || user.username,
        avatarInitials: prev.avatarInitials || user.username.slice(0, 2).toUpperCase(),
        // keep existing avatarUrl unless you later add it to the user payload
      }));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await PostService.list();
        const mapped = (data || []).map((p) => {
          const type = p.type || (/\.mp4|\.webm|\.mov|\.m4v/i.test(p.mediaUrl || '') ? 'video' : 'image');
          const owner = p.user?.username || p.username || p.owner;
          const rawSrc = p.mediaUrl || p.imageUrl || p.videoUrl;
          const src = normalizeMediaUrl(rawSrc);
          if (!src || src.startsWith('blob:')) return null;
          const poster = type === 'video' ? normalizeMediaUrl(p.poster || p.thumbnail) : undefined;
          return {
            id: p._id || p.id,
            type,
            src,
            poster,
            owner,
          };
        }).filter(Boolean);
        const mine = user?.username
          ? mapped.filter((m) => {
              if (!m.owner) return true;
              return m.owner.toLowerCase() === user.username.toLowerCase();
            })
          : mapped;
        const finalPosts = mine.length ? mine : mapped;
        if (!cancelled) setPosts(finalPosts);
      } catch (err) {
        if (!cancelled) setError('Could not load your posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  // Update profile stats when posts change
  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        posts: posts.length,
      },
    }));
  }, [posts]);

  const [activeTab, setActiveTab] = useState('Posts');
  let gridPosts = posts;
  if (activeTab === 'Reels') gridPosts = posts.filter(p => p.type === 'video');
  if (activeTab === 'Saved') gridPosts = [];

  const handleDelete = async (id) => {
    if (!id) return;
    setError('');
    setDeletingId(id);
    try {
      await PostService.remove(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Could not delete post.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="px-2 text-slate-900 dark:text-slate-50 sm:px-0 w-full min-h-screen">
      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={async (p) => {
          setProfile(p);
          try {
            localStorage.setItem(PROFILE_STORE_KEY, JSON.stringify(p));
          } catch (err) {
            // ignore storage errors
          }
          try {
            // persist to backend if authenticated
            await AuthService.updateMe({
              name: p.name,
              bio: p.bio,
              avatarUrl: p.avatarUrl,
            });
          } catch (err) {
            // ignore backend errors for now
          }
          setEditOpen(false);
        }}
      />
      <div className="mx-auto w-full max-w-full space-y-6 pb-16">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-500/10 via-slate-50 to-slate-100 dark:border-slate-800 dark:from-indigo-900/30 dark:via-slate-900 dark:to-slate-950">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-amber-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 px-3 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-xl sm:text-2xl font-semibold text-white shadow-lg shadow-indigo-900/40 overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    profile.avatarInitials
                  )}
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {profile.username}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {profile.name}
                  </p>
                  <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                    {profile.bio}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] sm:text-[11px] text-indigo-500 dark:text-indigo-300">
                    {profile.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-indigo-500/10 px-2 py-1 dark:bg-indigo-500/20"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm mt-4 sm:mt-0">
                <button className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                  Share
                </button>
                <button
                  className="rounded-full bg-indigo-500 px-3 py-1 font-semibold text-white shadow-md shadow-indigo-500/40 hover:bg-indigo-400"
                  onClick={() => setEditOpen(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-slate-200/70 bg-white/80 text-center text-xs dark:border-slate-800 dark:bg-slate-900/60 sm:text-sm">
            <div className="p-3">
              <div className="text-lg font-semibold">
                {profile.stats.posts.toLocaleString()}
              </div>
              <div className="text-slate-500 dark:text-slate-400">Posts</div>
            </div>
            <div className="p-3">
              <div className="text-lg font-semibold">
                {profile.stats.followers.toLocaleString()}
              </div>
              <div className="text-slate-500 dark:text-slate-400">Followers</div>
            </div>
            <div className="p-3">
              <div className="text-lg font-semibold">
                {profile.stats.following.toLocaleString()}
              </div>
              <div className="text-slate-500 dark:text-slate-400">Following</div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Highlights
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.id}
                className="flex w-20 flex-col items-center gap-2"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr ${h.color} text-xs font-semibold text-white shadow-md`}
                >
                  {h.label.slice(0, 3)}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200/70 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300">
          <div className="relative mx-auto flex max-w-xs items-center justify-between">
            {['Posts', 'Reels', 'Saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 transition-colors duration-200 ${activeTab === tab ? 'text-indigo-500 dark:text-pink-400 border-b-2 border-indigo-500 dark:border-pink-400 bg-indigo-50 dark:bg-slate-900/40 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section>
          {activeTab === 'Saved' ? (
            <div className="text-center text-slate-400 py-8">No saved posts yet.</div>
          ) : (
            <div className="space-y-3">
              {loading && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/30 dark:text-amber-100">
                  {error}
                </div>
              )}

              {!loading && !error && gridPosts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                  No posts yet.
                </div>
              )}

              {!loading && !error && gridPosts.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-200 dark:bg-slate-900 p-2 rounded-xl">
                  {gridPosts.map((post) => {
                    const canDelete = user?.username && post.owner && post.owner.toLowerCase() === user.username.toLowerCase();
                    return (
                      <div key={post.id} className="relative group">
                        <MediaCard type={post.type} src={post.src} poster={post.poster} />
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition"
                          >
                            {deletingId === post.id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;

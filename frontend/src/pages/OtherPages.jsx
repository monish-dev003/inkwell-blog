import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { postsAPI, usersAPI, categoriesAPI } from '../api'
import PostCard from '../components/posts/PostCard'
import { PostCardSkeleton, PageLoader, EmptyState } from '../components/ui'
import { useSelector } from 'react-redux'
import { useDebounce } from '../hooks'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiEye, FiHeart, FiFileText, FiBookmark, FiSearch } from 'react-icons/fi'

// ─── DASHBOARD ──────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useSelector(s => s.auth)
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    postsAPI.getMyPosts()
      .then(r => setPosts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await postsAPI.delete(id)
      setPosts(prev => prev.filter(p => p._id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Delete failed') }
  }

  const filtered = posts.filter(p => filter === 'all' ? true : p.status === filter)
  const stats = {
    total:  posts.length,
    views:  posts.reduce((s, p) => s + p.views, 0),
    likes:  posts.reduce((s, p) => s + p.likesCount, 0),
    drafts: posts.filter(p => p.status === 'draft').length,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link to="/write" className="btn-primary flex items-center gap-2 text-sm">✍️ New Post</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FiFileText />, label: 'Total Posts',   value: stats.total, color: 'text-primary-600', bg: 'bg-primary-50' },
          { icon: <FiEye />,      label: 'Total Views',   value: stats.views.toLocaleString(), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: <FiHeart />,    label: 'Total Likes',   value: stats.likes, color: 'text-red-500', bg: 'bg-red-50' },
          { icon: <FiEdit2 />,    label: 'Drafts',        value: stats.drafts, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['all','published','draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f === 'all' ? 'All Posts' : f}
          </button>
        ))}
      </div>

      {/* Posts table */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📝" title="No posts yet" message="Start writing your first article" action={<Link to="/write" className="btn-primary px-8 py-2.5 inline-block">Write now</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Title','Status','Views','Likes','Date','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/post/${p.slug}`} className="font-semibold text-slate-800 hover:text-primary-600 line-clamp-1">{p.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.views}</td>
                    <td className="px-4 py-3 text-slate-500">{p.likesCount}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/edit/${p._id}`} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AUTHOR PROFILE ────────────────────────────────────────
export function AuthorProfilePage() {
  const { username } = useParams()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usersAPI.getProfile(username)
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [username])

  if (loading) return <PageLoader />
  if (!data) return <div className="text-center py-20"><p className="text-slate-500">User not found</p></div>

  const { user, posts, stats } = data

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="card p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 text-4xl font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
          <p className="text-slate-500 text-sm mb-3">@{user.username}</p>
          {user.bio && <p className="text-slate-600 mb-4 max-w-lg">{user.bio}</p>}
          <div className="flex gap-6 justify-center sm:justify-start">
            {[['Posts', stats.totalPosts], ['Views', stats.totalViews.toLocaleString()]].map(([l, v]) => (
              <div key={l} className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{v}</p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-5">Posts by {user.name}</h2>
      {posts.length === 0 ? (
        <EmptyState icon="📝" title="No posts yet" message="This author hasn't published anything yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}

// ─── BOOKMARKS ─────────────────────────────────────────────
export function BookmarksPage() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usersAPI.getBookmarks()
      .then(r => setPosts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2"><FiBookmark /> Bookmarks</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon="🔖" title="No bookmarks yet" message="Save posts to read them later" action={<Link to="/posts" className="btn-primary px-8 py-2.5 inline-block">Explore posts</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}

// ─── CATEGORY PAGE ─────────────────────────────────────────
export function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts]   = useState([])
  const [cat, setCat]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, pRes] = await Promise.all([categoriesAPI.getAll(), postsAPI.getAll({ category: slug, limit: 20 })])
        setCat(cRes.data.data.find(c => c.slug === slug))
        setPosts(pRes.data.data.posts)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [slug])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {cat && (
        <div className="mb-8 p-6 rounded-2xl text-white" style={{ background: cat.color || '#4f46e5' }}>
          <p className="text-sm opacity-75 uppercase tracking-wider mb-1">Topic</p>
          <h1 className="text-3xl font-extrabold">{cat.name}</h1>
          <p className="opacity-75 mt-1">{cat.postCount} posts</p>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}</div>
      ) : posts.length === 0 ? (
        <EmptyState icon="📂" title="No posts in this category" message="Be the first to write about this topic" action={<Link to="/write" className="btn-primary px-8 py-2.5 inline-block">Write a post</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}

// ─── CATEGORIES LIST ───────────────────────────────────────
export function CategoriesPage() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCats(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Browse Topics</h1>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
      ) : cats.length === 0 ? (
        <EmptyState icon="📚" title="No topics yet" message="Topics will appear here once added" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map(c => (
            <Link key={c._id} to={`/category/${c.slug}`} className="card p-5 text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg" style={{ background: c.color }}>{c.name.charAt(0)}</div>
              <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.postCount} posts</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SEARCH PAGE ───────────────────────────────────────────
export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    postsAPI.getAll({ search: q, limit: 20 }).then(r => setPosts(r.data.data.posts)).catch(() => setPosts([])).finally(() => setLoading(false))
  }, [q])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Search Results</h1>
        {q && <p className="text-slate-500 mt-1">Showing results for "<span className="font-semibold text-slate-700">{q}</span>"</p>}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}</div>
      ) : !q ? (
        <EmptyState icon="🔍" title="Enter a search term" message="Type something in the search bar to find posts" />
      ) : posts.length === 0 ? (
        <EmptyState icon="😕" title="No results found" message={`No posts found for "${q}"`} action={<Link to="/posts" className="btn-secondary inline-block px-6 py-2.5">Browse all posts</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}

// ─── 404 PAGE ──────────────────────────────────────────────
export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-slate-100 mb-4 select-none">404</div>
      <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={() => navigate(-1)} className="btn-secondary px-6 py-2.5">← Go Back</button>
        <Link to="/" className="btn-primary px-6 py-2.5">🏠 Home</Link>
      </div>
    </div>
  )
}

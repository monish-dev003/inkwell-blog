import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI, categoriesAPI } from '../api'
import PostCard from '../components/posts/PostCard'
import { PostCardSkeleton } from '../components/ui'
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi'

function TrendingCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className="flex gap-3 group p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <img src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200'} alt={post.title} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-1">{post.author?.name} · {post.readingTime}m read</p>
        <h4 className="font-semibold text-sm text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{post.title}</h4>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [posts, setPosts]         = useState([])
  const [trending, setTrending]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, tRes, cRes] = await Promise.all([
          postsAPI.getAll({ limit: 9 }),
          postsAPI.getTrending(),
          categoriesAPI.getAll(),
        ])
        setPosts(pRes.data.data.posts)
        setPagination(pRes.data.data.pagination)
        setTrending(tRes.data.data)
        setCategories(cRes.data.data)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          Community Blog Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
          Ideas worth reading,<br />
          <span className="text-primary-600">stories worth telling</span>
        </h1>
        <p className="text-slate-500 text-lg mb-8">Discover insightful articles on technology, career, and life. Write and share your own stories.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/write" className="btn-primary px-8 py-3 text-base">✍️ Start Writing</Link>
          <Link to="/posts" className="btn-secondary px-8 py-3 text-base">Explore Posts</Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main posts */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Latest Posts</h2>
            <Link to="/posts" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📝</p>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-6">Be the first to write a post!</p>
              <Link to="/write" className="btn-primary inline-block px-8 py-3">Write the first post</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map(p => <PostCard key={p._id} post={p} />)}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="text-center mt-8">
              <Link to="/posts" className="btn-secondary inline-flex items-center gap-2 px-8 py-3">
                See more posts <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:w-72 space-y-6">
          {/* Trending */}
          {trending.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FiTrendingUp className="text-primary-600 w-5 h-5" /> Trending</h3>
              <div className="space-y-1">
                {trending.map(p => <TrendingCard key={p._id} post={p} />)}
              </div>
            </div>
          )}

          {/* Topics */}
          {categories.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-4">Browse Topics</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <Link key={c._id} to={`/category/${c.slug}`} className="badge px-3 py-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ backgroundColor: c.color + '18', color: c.color }}>
                    {c.name} <span className="ml-1 text-slate-400 text-xs">({c.postCount})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">Start writing today</h3>
            <p className="text-primary-100 text-sm mb-4">Share your knowledge and reach thousands of readers.</p>
            <Link to="/signup" className="bg-white text-primary-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary-50 transition-colors block text-center">Create free account</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

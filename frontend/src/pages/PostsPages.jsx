import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { postsAPI, categoriesAPI } from '../api'
import PostCard from '../components/posts/PostCard'
import { PostCardSkeleton } from '../components/ui'
import PostForm from '../components/posts/PostForm'
import { useDebounce } from '../hooks'
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export function AllPostsPage() {
  const [params, setParams] = useSearchParams()
  const [posts, setPosts]   = useState([])
  const [cats, setCats]     = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState(params.get('search') || '')
  const dSearch = useDebounce(search)
  const page     = +params.get('page') || 1
  const category = params.get('category') || ''
  const tag      = params.get('tag') || ''

  useEffect(() => { categoriesAPI.getAll().then(r => setCats(r.data.data)).catch(() => {}) }, [])

  useEffect(() => {
    setLoading(true)
    const p = { page, limit: 9 }
    if (dSearch)  p.search   = dSearch
    if (category) p.category = category
    if (tag)      p.tag      = tag
    postsAPI.getAll(p)
      .then(r => { setPosts(r.data.data.posts); setPagination(r.data.data.pagination) })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [page, dSearch, category, tag])

  const setFilter = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val); else next.delete(key)
    next.set('page', '1'); setParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Explore Posts</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap">
        <div className="relative max-w-sm w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="input-field pl-9 w-full" />
        </div>
        <select value={category} onChange={e => setFilter('category', e.target.value)} className="input-field max-w-xs">
          <option value="">All Topics</option>
          {cats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
        {(category || tag || dSearch) && <button onClick={() => { setSearch(''); setParams({ page: '1' }) }} className="btn-secondary text-sm">Clear</button>}
      </div>
      {tag && <div className="mb-4"><span className="badge bg-primary-100 text-primary-700 px-3 py-1.5 text-sm font-semibold">#{tag} <button onClick={() => setFilter('tag','')} className="ml-2 font-bold">×</button></span></div>}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(9)].map((_,i)=><PostCardSkeleton key={i}/>)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20"><p className="text-5xl mb-4">🔍</p><h3 className="text-xl font-bold text-slate-700 mb-2">No posts found</h3><p className="text-slate-500">Try different keywords</p></div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{pagination.total} posts found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map(p=><PostCard key={p._id} post={p}/>)}</div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
              <button disabled={page<=1} onClick={()=>setFilter('page',String(page-1))} className="btn-secondary p-2 disabled:opacity-40"><FiChevronLeft className="w-5 h-5"/></button>
              {[...Array(pagination.pages)].map((_,i)=>(
                <button key={i+1} onClick={()=>setFilter('page',String(i+1))} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page===i+1?'bg-primary-600 text-white':'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{i+1}</button>
              ))}
              <button disabled={page>=pagination.pages} onClick={()=>setFilter('page',String(page+1))} className="btn-secondary p-2 disabled:opacity-40"><FiChevronRight className="w-5 h-5"/></button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function WritePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8"><h1 className="text-3xl font-extrabold text-slate-900 mb-1">Write a Post</h1><p className="text-slate-500">Share your knowledge with the world</p></div>
      <PostForm />
    </div>
  )
}

export function EditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    postsAPI.getMyPosts()
      .then(r => { const found = r.data.data.find(p=>p._id===id); if(!found) navigate('/dashboard'); else { setPost(found); setLoading(false) } })
      .catch(() => navigate('/dashboard'))
  }, [id])

  if (loading) return <div className="flex justify-center items-center min-h-60"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8"><h1 className="text-3xl font-extrabold text-slate-900 mb-1">Edit Post</h1><p className="text-slate-500">Update your article</p></div>
      <PostForm post={post} />
    </div>
  )
}

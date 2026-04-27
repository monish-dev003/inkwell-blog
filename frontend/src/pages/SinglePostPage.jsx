import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postsAPI } from '../api'
import parse from 'html-react-parser'
import { LikeButton, BookmarkButton } from '../components/posts/ActionButtons'
import CommentSection from '../components/posts/CommentSection'
import PostCard from '../components/posts/PostCard'
import { PageLoader } from '../components/ui'
import { useReadingProgress } from '../hooks'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiClock, FiEye, FiShare2, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function SinglePostPage() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const { user }  = useSelector(s => s.auth)
  const [post, setPost]     = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const progress = useReadingProgress()

  useEffect(() => {
    setLoading(true)
    postsAPI.getOne(slug)
      .then(async r => {
        setPost(r.data.data)
        const rel = await postsAPI.getRelated(slug).catch(() => ({ data: { data: [] } }))
        setRelated(rel.data.data)
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      await postsAPI.delete(post._id)
      toast.success('Post deleted')
      navigate('/')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  const handleShare = () => {
    navigator.share ? navigator.share({ title: post.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'))
  }

  if (loading) return <PageLoader />
  if (!post) return null

  const isAuthor = user?._id === post.author?._id || user?._id === post.author
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      {/* Read progress bar */}
      <div id="read-progress" style={{ width: `${progress}%` }} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Category */}
        {post.category && (
          <Link to={`/category/${post.category.slug}`} className="text-sm font-semibold uppercase tracking-wider mb-4 inline-block" style={{ color: post.category.color || '#4f46e5' }}>
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <Link to={`/u/${post.author?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center overflow-hidden">
              {post.author?.avatar ? <img src={post.author.avatar} className="w-full h-full object-cover" alt="" /> : post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800">{post.author?.name}</p>
              <p className="text-xs text-slate-500">{date}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-slate-400 text-sm ml-auto">
            <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" /> {post.readingTime} min</span>
            <span className="flex items-center gap-1.5"><FiEye className="w-4 h-4" /> {post.views?.toLocaleString()}</span>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link to={`/edit/${post._id}`} className="flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                <FiEdit2 className="w-3.5 h-3.5" /> Edit
              </Link>
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                <FiTrash2 className="w-3.5 h-3.5" /> {deleting ? '...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Cover image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="post-content">{parse(post.content || '')}</div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
            {post.tags.map(t => (
              <Link key={t} to={`/posts?tag=${t}`} className="badge bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full text-sm transition-colors">#{t}</Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
          <LikeButton postId={post._id} initialLiked={post.isLiked} initialCount={post.likesCount} />
          <BookmarkButton postId={post._id} initialBookmarked={post.isBookmarked} />
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium ml-auto">
            <FiShare2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Author bio */}
        {post.author?.bio && (
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl flex gap-4">
            <div className="w-14 h-14 flex-shrink-0 rounded-full bg-primary-100 text-primary-700 font-bold text-lg flex items-center justify-center overflow-hidden">
              {post.author?.avatar ? <img src={post.author.avatar} className="w-full h-full object-cover" alt="" /> : post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Written by</p>
              <Link to={`/u/${post.author?.username}`} className="font-bold text-slate-900 hover:text-primary-600">{post.author?.name}</Link>
              <p className="text-sm text-slate-500 mt-1">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-12"><CommentSection postId={post._id} /></div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        </section>
      )}
    </>
  )
}

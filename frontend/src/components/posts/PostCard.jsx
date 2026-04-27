import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiEye, FiHeart, FiBookmark } from 'react-icons/fi'

const defaultImg = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'

export default function PostCard({ post }) {
  if (!post) return null
  const { title, slug, excerpt, featuredImage, author, category, tags, readingTime, views, likesCount, createdAt } = post

  const date = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <article className="card overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Cover */}
      <Link to={`/post/${slug}`} className="block overflow-hidden aspect-video bg-slate-100">
        <img
          src={featuredImage || defaultImg}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = defaultImg }}
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {category && (
          <Link to={`/category/${category.slug}`} className="text-xs font-semibold uppercase tracking-wider mb-2 inline-block" style={{ color: category.color || '#4f46e5' }}>
            {category.name}
          </Link>
        )}

        {/* Title */}
        <Link to={`/post/${slug}`} className="block mb-2">
          <h2 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        {excerpt && <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{excerpt}</p>}

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map(tag => (
              <Link key={tag} to={`/posts?tag=${tag}`} className="badge bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors text-xs px-2 py-0.5 rounded-full">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2">
            {author?.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                {author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <Link to={`/u/${author?.username}`} className="text-xs font-semibold text-slate-700 hover:text-primary-600">{author?.name}</Link>
              <p className="text-xs text-slate-400">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{readingTime}m</span>
            <span className="flex items-center gap-1"><FiEye className="w-3 h-3" />{views}</span>
            <span className="flex items-center gap-1"><FiHeart className="w-3 h-3" />{likesCount}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

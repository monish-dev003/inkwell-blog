import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likesAPI, usersAPI } from '../../api'
import toast from 'react-hot-toast'
import { FiHeart, FiBookmark } from 'react-icons/fi'
import { HiHeart, HiBookmark } from 'react-icons/hi'

export function LikeButton({ postId, initialLiked, initialCount }) {
  const { isAuthenticated } = useSelector(s => s.auth)
  const [liked, setLiked]   = useState(initialLiked)
  const [count, setCount]   = useState(initialCount || 0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toggle = async () => {
    if (!isAuthenticated) { toast.error('Sign in to like posts'); return navigate('/login') }
    setLoading(true)
    try {
      const res = await likesAPI.toggle(postId)
      setLiked(res.data.data.liked)
      setCount(res.data.data.likesCount)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  return (
    <button onClick={toggle} disabled={loading} title={liked ? 'Unlike' : 'Like'}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all ${liked ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
      {liked ? <HiHeart className="w-5 h-5" /> : <FiHeart className="w-5 h-5" />}
      <span>{count}</span>
    </button>
  )
}

export function BookmarkButton({ postId, initialBookmarked }) {
  const { isAuthenticated } = useSelector(s => s.auth)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  const toggle = async () => {
    if (!isAuthenticated) { toast.error('Sign in to bookmark'); return navigate('/login') }
    setLoading(true)
    try {
      const res = await usersAPI.toggleBookmark(postId)
      setBookmarked(res.data.data.bookmarked)
      toast.success(res.data.data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  return (
    <button onClick={toggle} disabled={loading} title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all ${bookmarked ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
      {bookmarked ? <HiBookmark className="w-5 h-5" /> : <FiBookmark className="w-5 h-5" />}
      <span>{bookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}

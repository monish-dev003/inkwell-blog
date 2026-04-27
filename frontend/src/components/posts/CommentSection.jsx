import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { commentsAPI } from '../../api'
import { useSelector } from 'react-redux'
import { Spinner } from '../ui'
import toast from 'react-hot-toast'
import { FiSend, FiTrash2, FiCornerDownRight } from 'react-icons/fi'

function CommentItem({ comment, onDelete, postId, onReplyAdded }) {
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const isOwner = user?._id === comment.author?._id || user?._id === comment.author

  const handleReply = async () => {
    if (!replyText.trim()) return
    setReplyLoading(true)
    try {
      const res = await commentsAPI.add(postId, { content: replyText, parentId: comment._id })
      onReplyAdded(comment._id, res.data.data)
      setReplyText(''); setReplyOpen(false)
      toast.success('Reply added')
    } catch { toast.error('Failed to add reply') }
    finally { setReplyLoading(false) }
  }

  const date = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center overflow-hidden">
        {comment.author?.avatar ? <img src={comment.author.avatar} className="w-full h-full object-cover" alt="" /> : comment.author?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="bg-slate-50 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-semibold text-sm text-slate-800">{comment.author?.name}</span>
              <span className="text-xs text-slate-400 ml-2">{date(comment.createdAt)}</span>
            </div>
            {isOwner && (
              <button onClick={() => onDelete(comment._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
        </div>

        {/* Reply button */}
        {isAuthenticated && (
          <button onClick={() => setReplyOpen(r => !r)} className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 mt-1 ml-1 transition-colors">
            <FiCornerDownRight className="w-3 h-3" /> Reply
          </button>
        )}

        {/* Reply input */}
        {replyOpen && (
          <div className="flex gap-2 mt-2">
            <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." className="flex-1 input-field text-sm py-2" onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()} />
            <button onClick={handleReply} disabled={replyLoading} className="btn-primary px-3 py-2 text-sm flex items-center gap-1">
              {replyLoading ? <Spinner size="sm" /> : <FiSend className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-100">
            {comment.replies.map(r => (
              <div key={r._id} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center overflow-hidden">
                  {r.author?.avatar ? <img src={r.author.avatar} className="w-full h-full object-cover" alt="" /> : r.author?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-slate-800">{r.author?.name}</span>
                    {(user?._id === r.author?._id) && (
                      <button onClick={() => onDelete(r._id)} className="text-slate-400 hover:text-red-500 p-0.5"><FiTrash2 className="w-3 h-3" /></button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700">{r.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const [comments, setComments] = useState([])
  const [text, setText]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const r = await commentsAPI.getAll(postId); setComments(r.data.data) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [postId])

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const res = await commentsAPI.add(postId, { content: text })
      setComments(prev => [{ ...res.data.data, replies: [] }, ...prev])
      setText(''); toast.success('Comment added')
    } catch { toast.error('Failed to add comment') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete comment?')) return
    try {
      await commentsAPI.delete(id)
      setComments(prev => prev.filter(c => c._id !== id).map(c => ({ ...c, replies: c.replies?.filter(r => r._id !== id) })))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  const handleReplyAdded = (parentId, reply) => {
    setComments(prev => prev.map(c => c._id === parentId ? { ...c, replies: [...(c.replies||[]), reply] } : c))
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>

      {isAuthenticated ? (
        <div className="flex gap-3 mb-8">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your thoughts..." rows={2} className="flex-1 input-field resize-none text-sm" onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleSubmit()} />
            <button onClick={handleSubmit} disabled={submitting || !text.trim()} className="btn-primary px-4 self-end flex items-center gap-2">
              {submitting ? <Spinner size="sm" /> : <FiSend className="w-4 h-4" />} Post
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-5 text-center mb-8">
          <p className="text-slate-600 mb-3">Sign in to join the conversation</p>
          <Link to="/login" className="btn-primary inline-block text-sm px-6 py-2">Sign In</Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-3xl mb-2">💬</p>
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(c => <CommentItem key={c._id} comment={c} onDelete={handleDelete} postId={postId} onReplyAdded={handleReplyAdded} />)}
        </div>
      )}
    </section>
  )
}

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { categoriesAPI, postsAPI } from '../../api'
import toast from 'react-hot-toast'
import { Spinner } from '../ui'

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image', 'blockquote', 'code-block'],
    ['clean'],
  ],
}

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'link', 'image', 'blockquote', 'code-block',
]

export default function PostForm({ post }) {
  const [categories, setCategories] = useState([])
  const [content, setContent]       = useState(post?.content || '')
  const [preview, setPreview]       = useState(post?.featuredImage || null)
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title:      post?.title || '',
      categoryId: post?.category?._id || '',
      tags:       post?.tags?.join(', ') || '',
      status:     post?.status || 'draft',
    },
  })

  const { onChange: imageOnChange, ...imageRegister } = register('image')

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data.data)).catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    const plainText = content.replace(/<[^>]+>/g, '').trim()
    if (!plainText) return toast.error('Content is required')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title',   data.title)
      fd.append('content', content)
      fd.append('status',  data.status)
      if (data.categoryId) fd.append('categoryId', data.categoryId)
      if (data.tags)       fd.append('tags', data.tags)
      if (data.image?.[0]) fd.append('featuredImage', data.image[0])

      const res = post
        ? await postsAPI.update(post._id, fd)
        : await postsAPI.create(fd)

      toast.success(post ? 'Post updated!' : 'Post created!')
      navigate(`/post/${res.data.data.slug}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const inputCls = (err) => `input-field ${err ? 'border-red-400 focus:ring-red-400' : ''}`

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter post title..."
              className={inputCls(errors.title)}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Content *</label>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                style={{ minHeight: '400px' }}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
        </div>

        <div className="lg:w-72 space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">Post Settings</h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select {...register('categoryId')} className="input-field">
                <option value="">No category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
              <input
                {...register('tags')}
                placeholder="react, mern, javascript"
                className="input-field text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">Comma separated</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Featured Image</label>
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
              )}
              <input
                {...imageRegister}
                type="file"
                accept="image/*"
                onChange={e => { imageOnChange(e); handleImageChange(e) }}
                className="text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer w-full"
              />
              <p className="text-xs text-slate-400 mt-1">Max 5MB · JPG / PNG / WebP</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading
                ? <><Spinner size="sm" /> Saving...</>
                : post ? '✅ Update Post' : '🚀 Publish Post'}
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}
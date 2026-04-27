const express = require('express');
const { Post, Like, Bookmark, Category } = require('../models');
const { asyncHandler, ApiError, ApiResponse, slugify, readingTime } = require('../utils');
const { protect, optionalAuth } = require('../middleware/auth');
const { cloudinary, upload } = require('../config/cloudinary');
const router = express.Router();

// GET /api/v1/posts
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = +req.query.page || 1, limit = +req.query.limit || 9;
  const q = { status: 'published' };
  if (req.query.search)   q.$text = { $search: req.query.search };
  if (req.query.tag)      q.tags  = req.query.tag.toLowerCase();
  if (req.query.category) { const c = await Category.findOne({ slug: req.query.category }); if (c) q.category = c._id; }
  const total = await Post.countDocuments(q);
  const posts = await Post.find(q).populate('author','name username avatar').populate('category','name slug color')
    .sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean();
  let liked = new Set(), bookmarked = new Set();
  if (req.user) {
    const ids = posts.map(p => p._id);
    (await Like.find({ user: req.user._id, post: { $in: ids } })).forEach(l => liked.add(l.post.toString()));
    (await Bookmark.find({ user: req.user._id, post: { $in: ids } })).forEach(b => bookmarked.add(b.post.toString()));
  }
  res.json(new ApiResponse(200, { posts: posts.map(p => ({ ...p, isLiked: liked.has(p._id.toString()), isBookmarked: bookmarked.has(p._id.toString()) })), pagination: { page, limit, total, pages: Math.ceil(total/limit) } }));
}));

// GET /api/v1/posts/trending
router.get('/trending', asyncHandler(async (req, res) => {
  const posts = await Post.find({ status:'published', createdAt: { $gte: new Date(Date.now()-30*24*60*60*1000) } })
    .populate('author','name username avatar').sort({ views:-1 }).limit(6).lean();
  res.json(new ApiResponse(200, posts));
}));

// GET /api/v1/posts/my-posts
router.get('/my-posts', protect, asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id }).populate('category','name slug color').sort({ createdAt:-1 }).lean();
  res.json(new ApiResponse(200, posts));
}));

// GET /api/v1/posts/related/:slug
router.get('/related/:slug', asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) return res.json(new ApiResponse(200, []));
  const related = await Post.find({ _id:{$ne:post._id}, status:'published', $or:[{category:post.category},{tags:{$in:post.tags}}] })
    .populate('author','name username avatar').populate('category','name slug color').sort({ views:-1 }).limit(4).lean();
  res.json(new ApiResponse(200, related));
}));

// GET /api/v1/posts/:slug
router.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate('author','name username avatar bio').populate('category','name slug color');
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.status === 'draft' && post.author._id.toString() !== req.user?._id?.toString()) throw new ApiError(403, 'Private post');
  await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
  let isLiked = false, isBookmarked = false;
  if (req.user) {
    [isLiked, isBookmarked] = await Promise.all([
      Like.findOne({ user: req.user._id, post: post._id }).then(l => !!l),
      Bookmark.findOne({ user: req.user._id, post: post._id }).then(b => !!b),
    ]);
  }
  res.json(new ApiResponse(200, { ...post.toObject(), isLiked, isBookmarked }));
}));

// POST /api/v1/posts
router.post('/', protect, upload.single('featuredImage'), asyncHandler(async (req, res) => {
  const { title, content, categoryId, tags, status } = req.body;
  if (!title || !content) throw new ApiError(400, 'Title and content required');
  let slug = slugify(title), exists = await Post.findOne({ slug }), c = 1;
  while (exists) { slug = `${slugify(title)}-${c++}`; exists = await Post.findOne({ slug }); }
  const post = await Post.create({
    title, slug, content,
    excerpt:       content.replace(/<[^>]+>/g,'').slice(0,160).trim(),
    featuredImage: req.file?.path || '',
    author:        req.user._id,
    category:      categoryId || null,
    tags:          tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim()).filter(Boolean)) : [],
    status:        status || 'draft',
    readingTime:   readingTime(content),
  });
  const populated = await Post.findById(post._id).populate('author','name username avatar').populate('category','name slug color');
  res.status(201).json(new ApiResponse(201, populated, 'Post created'));
}));

// PUT /api/v1/posts/:id
router.put('/:id', protect, upload.single('featuredImage'), asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  const { title, content, categoryId, tags, status } = req.body;
  if (title)   post.title    = title;
  if (content) { post.content = content; post.excerpt = content.replace(/<[^>]+>/g,'').slice(0,160).trim(); post.readingTime = readingTime(content); }
  if (categoryId !== undefined) post.category = categoryId || null;
  if (tags)    post.tags     = Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim()).filter(Boolean);
  if (status)  post.status   = status;
  if (req.file) {
    if (post.featuredImage) { try { const pid = post.featuredImage.split('/').slice(-2).join('/').split('.')[0]; await cloudinary.uploader.destroy(pid); } catch {} }
    post.featuredImage = req.file.path;
  }
  await post.save();
  const updated = await Post.findById(post._id).populate('author','name username avatar').populate('category','name slug color');
  res.json(new ApiResponse(200, updated, 'Post updated'));
}));

// DELETE /api/v1/posts/:id
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  if (post.featuredImage) { try { const pid = post.featuredImage.split('/').slice(-2).join('/').split('.')[0]; await cloudinary.uploader.destroy(pid); } catch {} }
  await post.deleteOne();
  res.json(new ApiResponse(200, null, 'Post deleted'));
}));

module.exports = router;

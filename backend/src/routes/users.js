const express = require('express');
const { User, Post, Bookmark } = require('../models');
const { asyncHandler, ApiError, ApiResponse } = require('../utils');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.get('/bookmarks', protect, asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate({ path: 'post', populate: [{ path: 'author', select: 'name username avatar' }, { path: 'category', select: 'name slug color' }] })
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, bookmarks.map(b => b.post).filter(Boolean)));
}));

router.post('/bookmarks/:postId', protect, asyncHandler(async (req, res) => {
  const existing = await Bookmark.findOne({ user: req.user._id, post: req.params.postId });
  if (existing) { await existing.deleteOne(); return res.json(new ApiResponse(200, { bookmarked: false })); }
  await Bookmark.create({ user: req.user._id, post: req.params.postId });
  res.json(new ApiResponse(200, { bookmarked: true }));
}));

router.put('/profile', protect, upload.single('avatar'), asyncHandler(async (req, res) => {
  const update = {};
  if (req.body.name) update.name = req.body.name;
  if (req.body.bio !== undefined) update.bio = req.body.bio;
  if (req.file) update.avatar = req.file.path;
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
  res.json(new ApiResponse(200, user, 'Profile updated'));
}));

router.put('/password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Both passwords required');
  if (newPassword.length < 6) throw new ApiError(400, 'Min 6 characters');
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(400, 'Wrong current password');
  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, null, 'Password changed'));
}));

router.get('/:username', asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw new ApiError(404, 'User not found');
  const posts = await Post.find({ author: user._id, status: 'published' })
    .populate('category','name slug color').sort({ createdAt: -1 }).lean();
  res.json(new ApiResponse(200, { user, posts, stats: { totalPosts: posts.length, totalViews: posts.reduce((s,p)=>s+p.views,0) } }));
}));

module.exports = router;

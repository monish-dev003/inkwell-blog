const express = require('express');
const { Like, Post } = require('../models');
const { asyncHandler, ApiError, ApiResponse } = require('../utils');
const { protect, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/:postId', protect, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  const existing = await Like.findOne({ user: req.user._id, post: post._id });
  if (existing) {
    await existing.deleteOne();
    const updated = await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: -1 } }, { new: true });
    return res.json(new ApiResponse(200, { liked: false, likesCount: updated.likesCount }));
  }
  await Like.create({ user: req.user._id, post: post._id });
  const updated = await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: 1 } }, { new: true });
  res.json(new ApiResponse(200, { liked: true, likesCount: updated.likesCount }));
}));

router.get('/:postId', optionalAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  const liked = req.user ? !!(await Like.findOne({ user: req.user._id, post: post._id })) : false;
  res.json(new ApiResponse(200, { liked, likesCount: post.likesCount }));
}));

module.exports = router;

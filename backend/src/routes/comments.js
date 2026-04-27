// comments.js
const express = require('express');
const { Comment, Post } = require('../models');
const { asyncHandler, ApiError, ApiResponse } = require('../utils');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/:postId', asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, parent: null })
    .populate('author','name username avatar').sort({ createdAt: -1 }).lean();
  const withReplies = await Promise.all(comments.map(async c => ({
    ...c,
    replies: await Comment.find({ parent: c._id }).populate('author','name username avatar').sort({ createdAt: 1 }).lean()
  })));
  res.json(new ApiResponse(200, withReplies));
}));

router.post('/:postId', protect, asyncHandler(async (req, res) => {
  const { content, parentId } = req.body;
  if (!content?.trim()) throw new ApiError(400, 'Content required');
  if (!(await Post.findById(req.params.postId))) throw new ApiError(404, 'Post not found');
  const comment = await (await Comment.create({ post: req.params.postId, author: req.user._id, content: content.trim(), parent: parentId||null })).populate('author','name username avatar');
  res.status(201).json(new ApiResponse(201, comment, 'Comment added'));
}));

router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  await Comment.deleteMany({ parent: comment._id });
  await comment.deleteOne();
  res.json(new ApiResponse(200, null, 'Deleted'));
}));

module.exports = router;

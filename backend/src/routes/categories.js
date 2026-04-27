const express = require('express');
const { Category, Post } = require('../models');
const { asyncHandler, ApiError, ApiResponse, slugify } = require('../utils');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const cats = await Category.find().sort({ name: 1 }).lean();
  const withCount = await Promise.all(cats.map(async c => ({ ...c, postCount: await Post.countDocuments({ category: c._id, status: 'published' }) })));
  res.json(new ApiResponse(200, withCount));
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  if (!name) throw new ApiError(400, 'Name required');
  const slug = slugify(name);
  if (await Category.findOne({ slug })) throw new ApiError(400, 'Category exists');
  const cat = await Category.create({ name: name.trim(), slug, color: color||'#4F46E5' });
  res.status(201).json(new ApiResponse(201, cat, 'Category created'));
}));

module.exports = router;

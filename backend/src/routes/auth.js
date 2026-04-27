const express = require('express');
const jwt     = require('jsonwebtoken');
const { User } = require('../models');
const { asyncHandler, ApiError, ApiResponse, slugify } = require('../utils');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, code, res, msg) => {
  const token = signToken(user._id);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 7*24*60*60*1000 });
  res.status(code).json(new ApiResponse(code, { user, token }, msg));
};

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'All fields required');
  if (password.length < 6) throw new ApiError(400, 'Password min 6 characters');
  if (await User.findOne({ email })) throw new ApiError(400, 'Email already registered');
  let username = slugify(name); let c = 1;
  while (await User.findOne({ username })) username = `${slugify(name)}${c++}`;
  const user = await User.create({ name, username, email, password });
  sendToken(user, 201, res, 'Account created');
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password required');
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');
  sendToken(user, 200, res, 'Logged in');
}));

router.post('/logout', protect, (req, res) => {
  res.cookie('token', '', { maxAge: 0, httpOnly: true });
  res.json(new ApiResponse(200, null, 'Logged out'));
});

router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await User.findById(req.user._id)));
}));

module.exports = router;

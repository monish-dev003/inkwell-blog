const jwt  = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError } = require('../utils');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) throw new ApiError(401, 'Not authorized - no token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new ApiError(401, 'User not found');
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError')  return next(new ApiError(401, 'Invalid token'));
    if (e.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired'));
    next(e);
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id).select('-password').then(u => { req.user = u; next(); }).catch(() => next());
  } catch { next(); }
};

const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : next(new ApiError(403, 'Admin only'));

const errorHandler = (err, req, res, next) => {
  let code = err.statusCode || 500;
  let msg  = err.message   || 'Server Error';
  if (err.code === 11000) { const f = Object.keys(err.keyValue)[0]; msg = `${f} already exists`; code = 400; }
  if (err.name === 'ValidationError') { msg = Object.values(err.errors).map(e => e.message).join(', '); code = 400; }
  if (err.name === 'CastError')       { msg = 'Invalid ID'; code = 400; }
  res.status(code).json({ success: false, message: msg });
};

module.exports = { protect, optionalAuth, adminOnly, errorHandler };

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// USER
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '', maxlength: 250 },
  role:     { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(p) { return bcrypt.compare(p, this.password); };
userSchema.methods.toJSON = function() { const o = this.toObject(); delete o.password; return o; };
const User = mongoose.model('User', userSchema);

// CATEGORY
const catSchema = new mongoose.Schema({
  name:  { type: String, required: true, unique: true, trim: true },
  slug:  { type: String, required: true, unique: true, lowercase: true },
  color: { type: String, default: '#4F46E5' },
}, { timestamps: true });
const Category = mongoose.model('Category', catSchema);

// POST
const postSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true, maxlength: 200 },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  content:       { type: String, required: true },
  excerpt:       { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  author:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  tags:          [{ type: String, lowercase: true, trim: true }],
  status:        { type: String, enum: ['draft','published'], default: 'draft' },
  readingTime:   { type: Number, default: 1 },
  views:         { type: Number, default: 0 },
  likesCount:    { type: Number, default: 0 },
}, { timestamps: true });
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ status: 1, createdAt: -1 });
const Post = mongoose.model('Post', postSchema);

// COMMENT
const commentSchema = new mongoose.Schema({
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true });
const Comment = mongoose.model('Comment', commentSchema);

// LIKE
const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });
likeSchema.index({ user: 1, post: 1 }, { unique: true });
const Like = mongoose.model('Like', likeSchema);

// BOOKMARK
const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = { User, Category, Post, Comment, Like, Bookmark };

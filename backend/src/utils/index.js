const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class ApiError extends Error {
  constructor(code, msg) { super(msg); this.statusCode = code; this.success = false; }
}

class ApiResponse {
  constructor(code, data, msg = 'Success') { this.statusCode = code; this.data = data; this.message = msg; this.success = code < 400; }
}

const slugify = str => str.toString().toLowerCase().trim().replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');

const readingTime = html => Math.max(1, Math.ceil(html.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length / 200));

module.exports = { asyncHandler, ApiError, ApiResponse, slugify, readingTime };

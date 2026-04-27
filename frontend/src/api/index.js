import API from './axios'

// AUTH
export const authAPI = {
  register: d  => API.post('/auth/register', d),
  login:    d  => API.post('/auth/login', d),
  logout:   () => API.post('/auth/logout'),
  getMe:    () => API.get('/auth/me'),
}

// POSTS
export const postsAPI = {
  getAll:    p  => API.get('/posts', { params: p }),
  getOne:    s  => API.get(`/posts/${s}`),
  getMyPosts:() => API.get('/posts/my-posts'),
  getTrending:() => API.get('/posts/trending'),
  getRelated: s  => API.get(`/posts/related/${s}`),
  // ✅ FIX: Do NOT set Content-Type manually for FormData — axios detects FormData
  // and sets 'multipart/form-data; boundary=...' automatically. Manually setting
  // it omits the boundary, which breaks multer's multipart parser on the server.
  create:    d  => API.post('/posts', d),
  update:    (id, d) => API.put(`/posts/${id}`, d),
  delete:    id => API.delete(`/posts/${id}`),
}

// COMMENTS
export const commentsAPI = {
  getAll:  postId => API.get(`/comments/${postId}`),
  add:     (postId, d) => API.post(`/comments/${postId}`, d),
  delete:  id => API.delete(`/comments/${id}`),
}

// LIKES
export const likesAPI = {
  toggle:    postId => API.post(`/likes/${postId}`),
  getStatus: postId => API.get(`/likes/${postId}`),
}

// CATEGORIES
export const categoriesAPI = {
  getAll:  () => API.get('/categories'),
  create:  d  => API.post('/categories', d),
}

// USERS
export const usersAPI = {
  getProfile:      username => API.get(`/users/${username}`),
  // ✅ FIX: Same boundary fix for profile/avatar upload
  updateProfile:   d => API.put('/users/profile', d),
  changePassword:  d => API.put('/users/password', d),
  getBookmarks:    () => API.get('/users/bookmarks'),
  toggleBookmark:  postId => API.post(`/users/bookmarks/${postId}`),
}

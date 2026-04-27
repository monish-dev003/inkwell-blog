import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
})

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('inkwell_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('inkwell_token')
      localStorage.removeItem('inkwell_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default API

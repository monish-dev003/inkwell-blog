import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clearCredentials, setCredentials } from '../store/slices/authSlice'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

// useAuth
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated } = useSelector(s => s.auth)

  const login = useCallback(async (data) => {
    const res = await authAPI.login(data)
    dispatch(setCredentials(res.data.data))
    return res.data
  }, [dispatch])

  const register = useCallback(async (data) => {
    const res = await authAPI.register(data)
    dispatch(setCredentials(res.data.data))
    return res.data
  }, [dispatch])

  const logout = useCallback(async () => {
    try { await authAPI.logout() } catch {}
    dispatch(clearCredentials())
    toast.success('Logged out')
  }, [dispatch])

  return { user, token, isAuthenticated, login, register, logout }
}

// useDebounce
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// useReadingProgress
export const useReadingProgress = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

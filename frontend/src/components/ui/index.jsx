import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Spinner
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className="flex justify-center items-center">
      <div className={`${s} border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin`} />
    </div>
  )
}

// Full page loader
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  )
}

// Post card skeleton
export function PostCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-3 w-24 rounded mt-2" />
        </div>
      </div>
    </div>
  )
}

// Protected route
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth)
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Public only route (redirect if logged in)
export function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth)
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

// Empty state
export function EmptyState({ icon = '📝', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{message}</p>
      {action}
    </div>
  )
}

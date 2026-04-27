import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { ProtectedRoute, PublicRoute, PageLoader } from './components/ui'

// Pages
import HomePage from './pages/HomePage'
import SinglePostPage from './pages/SinglePostPage'
import { AllPostsPage, WritePage, EditPage } from './pages/PostsPages'
import { LoginPage, SignupPage } from './pages/AuthPages'
import { DashboardPage, AuthorProfilePage, BookmarksPage, CategoryPage, CategoriesPage, SearchPage, NotFoundPage } from './pages/OtherPages'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/posts"         element={<AllPostsPage />} />
          <Route path="/post/:slug"    element={<SinglePostPage />} />
          <Route path="/categories"    element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search"        element={<SearchPage />} />
          <Route path="/u/:username"   element={<AuthorProfilePage />} />

          {/* Auth only (redirect if logged in) */}
          <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/write"     element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
          <Route path="/edit/:id"  element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

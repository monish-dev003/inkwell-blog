import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { FiEdit, FiBookmark, FiUser, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [searchQ, setSearchQ]     = useState('')
  const [dropdown, setDropdown]   = useState(false)
  const navigate = useNavigate()

  const handleSearch = e => {
    e.preventDefault()
    if (searchQ.trim()) { navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`); setMenuOpen(false) }
  }

  const navLink = 'text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors'
  const activeLink = ({ isActive }) => `font-medium text-sm transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span className="text-2xl">✍️</span>
            <span>InkWell</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/"        className={activeLink} end>Home</NavLink>
            <NavLink to="/posts"   className={activeLink}>Explore</NavLink>
            <NavLink to="/categories" className={activeLink}>Topics</NavLink>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search posts..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-52" />
            </div>
          </form>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/write" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                  <FiEdit className="w-4 h-4" /> Write
                </Link>
                <div className="relative">
                  <button onClick={() => setDropdown(d => !d)} className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center hover:bg-primary-200 transition-colors">
                    {user?.avatar ? <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                  </button>
                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="font-semibold text-sm text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">@{user?.username}</p>
                      </div>
                      {[
                        { to: `/u/${user?.username}`, icon: <FiUser />, label: 'Profile' },
                        { to: '/dashboard',           icon: <FiEdit />,     label: 'Dashboard' },
                        { to: '/bookmarks',           icon: <FiBookmark />, label: 'Bookmarks' },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <button onClick={() => { logout(); setDropdown(false) }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(m => !m)} className="md:hidden p-2 text-slate-600 hover:text-primary-600">
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search posts..." className="flex-1 input-field" />
              <button type="submit" className="ml-2 btn-primary px-3">Go</button>
            </form>
            {[['/', 'Home'], ['/posts', 'Explore'], ['/categories', 'Topics']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block text-sm font-medium py-1 ${isActive ? 'text-primary-600' : 'text-slate-700'}`}>
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                {[`/u/${user?.username}`, '/dashboard', '/bookmarks', '/write'].map((to, i) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-1">
                    {['Profile', 'Dashboard', 'Bookmarks', 'Write Post'][i]}
                  </Link>
                ))}
                <button onClick={() => { logout(); setMenuOpen(false) }} className="block text-sm font-medium text-red-600 py-1">Logout</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login"  onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 text-center">Sign In</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

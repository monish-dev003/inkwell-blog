import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <span className="text-2xl">✍️</span> InkWell
            </Link>
            <p className="text-sm leading-relaxed">A professional full-stack blog platform built with the MERN stack. Write, publish, and connect.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/posts', 'All Posts'], ['/categories', 'Topics'], ['/write', 'Write']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['/login','Sign In'],['/signup','Create Account'],['/dashboard','Dashboard'],['/bookmarks','Bookmarks']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} InkWell. Built with MERN Stack by Monish Shekh.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

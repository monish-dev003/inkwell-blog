# ✍️ InkWell — Full Stack MERN Blog Platform

A production-grade blog platform built with MongoDB, Express.js, React.js, and Node.js.

## 🚀 Features
- JWT Authentication (register, login, logout)
- Full Post CRUD with TinyMCE rich text editor
- Image upload via Cloudinary
- Categories, Tags, Search & Pagination
- Comments with nested replies
- Like & Bookmark system
- Author profile pages
- User dashboard with stats
- Reading time estimate & view counter
- Trending posts algorithm
- Skeleton loaders, toast notifications
- Mobile responsive design

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express.js |
| Auth | JWT + bcrypt |
| Storage | Cloudinary |
| Frontend | React 18 + Vite |
| State | Redux Toolkit |
| Styling | Tailwind CSS v3 |
| Editor | TinyMCE |
| Forms | React Hook Form |

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your values

# Frontend
cd frontend
npm install
cp .env.example .env   # fill in your values
```

### 2. Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/inkwell
JWT_SECRET=your_64_char_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_TINYMCE_KEY=no-api-key
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit: http://localhost:5173

## 📁 Structure

```
inkwell/
├── backend/
│   └── src/
│       ├── config/      (db, cloudinary)
│       ├── middleware/  (auth, error)
│       ├── models/      (User, Post, Comment, Like, Bookmark, Category)
│       ├── routes/      (auth, posts, comments, likes, categories, users)
│       └── utils/       (asyncHandler, ApiError, ApiResponse)
└── frontend/
    └── src/
        ├── api/         (axios instance + all API calls)
        ├── components/  (Navbar, Footer, PostCard, PostForm, Comments...)
        ├── hooks/       (useAuth, useDebounce, useReadingProgress)
        ├── pages/       (13 pages)
        └── store/       (Redux auth slice)
```

## 🌐 Deployment

- **Backend** → [Render](https://render.com) (free tier)
- **Frontend** → [Vercel](https://vercel.com) (free tier)
- **Database** → [MongoDB Atlas](https://cloud.mongodb.com) (free M0)
- **Images** → [Cloudinary](https://cloudinary.com) (free tier)

## 📬 Developer
**Monish Shekh** — Full Stack Developer  
✉️ monishshekh03@gmail.com  
💻 [github.com/monish-dev003](https://github.com/monish-dev003)

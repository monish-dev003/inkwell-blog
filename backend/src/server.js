require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/auth');

const app = express();
connectDB();

app.use(cors({ 
  origin: ['http://localhost:5173', 'https://inkwell-one-phi.vercel.app', process.env.CLIENT_URL].filter(Boolean), 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/v1/health', (_, res) => res.json({ success: true, message: 'InkWell API running ✅' }));

app.use('/api/v1/auth',       require('./routes/auth'));
app.use('/api/v1/posts',      require('./routes/posts'));
app.use('/api/v1/comments',   require('./routes/comments'));
app.use('/api/v1/likes',      require('./routes/likes'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/users',      require('./routes/users'));

app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🚀 InkWell API → http://localhost:${PORT}/api/v1/health\n`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, 
}));
app.use(morgan('dev'));

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/upload', uploadRoutes);

// Health check / Ping route
app.get('/ping', (req, res) => res.send('pong'));

// Self-ping to keep Render awake (every 14 mins)
const URL = `https://harshit-shakya-portfolio.onrender.com/ping`;
setInterval(() => {
  fetch(URL).catch(err => console.log('Ping failed:', err.message));
}, 14 * 60 * 1000);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

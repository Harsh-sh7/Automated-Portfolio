const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/upload', uploadRoutes);

// Static files
const __dirname_path = path.resolve();
app.use('/uploads', express.static(path.join(__dirname_path, '/uploads')));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

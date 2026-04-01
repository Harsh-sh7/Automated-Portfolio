require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Project = require('./models/Project');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(async () => {
    console.log('MongoDB connected');
    
    // Clear existing
    await Admin.deleteMany({});
    
    // Create new Admin
    const admin = new Admin({
      email: 'harshakya56@gmail.com',
      password: 'hello563827'
    });
    
    await admin.save();
    console.log('Admin user seeded: harshakya56@gmail.com / hello563827');
    
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

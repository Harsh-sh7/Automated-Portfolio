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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'securepassword123';

    const admin = new Admin({
      email: adminEmail,
      password: adminPassword
    });
    
    await admin.save();
    console.log(`Admin user seeded: ${adminEmail} / [HIDDEN]`);
    
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

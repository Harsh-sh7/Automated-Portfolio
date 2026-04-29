const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    console.log('Testing Cloudinary Upload...');
    const result = await cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg', {
      public_id: 'test_cat'
    });
    console.log('Upload SUCCESS:', result.secure_url);
  } catch (err) {
    console.error('Upload FAILED:', err);
  }
}

testUpload();

const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Image = require('../models/Image');

const router = express.Router();

// Use Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Upload image to MongoDB
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newImage = new Image({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    const savedImage = await newImage.save();
    
    // Return a URL that points to our new serving route
    // We use a relative path that will be prepended with the API URL on the frontend
    const imageUrl = `/api/upload/image/${savedImage._id}`;
    res.send(imageUrl);

  } catch (err) {
    console.error('MongoDB Upload Error:', err);
    res.status(500).json({ message: 'Failed to store image in database', error: err.message });
  }
});

// @desc    Serve image from MongoDB
// @route   GET /api/upload/image/:id
// @access  Public
router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', image.contentType);
    // Allow caching for 1 day
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(image.data);
  } catch (err) {
    res.status(500).send('Error retrieving image');
  }
});

module.exports = router;

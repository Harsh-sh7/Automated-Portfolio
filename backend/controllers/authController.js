const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify security question answer
// @route   POST /api/admin/verify-security
// @access  Public
const verifySecurityAnswer = async (req, res) => {
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ message: 'Answer is required' });
  }

  // Compare case-insensitively against the env variable — never exposed to frontend
  const correct = (process.env.ADMIN_SECURITY_ANSWER || '').trim().toUpperCase();
  const provided = answer.trim().toUpperCase();

  if (provided === correct) {
    // Issue a short-lived reset token (just the JWT of the admin account)
    try {
      const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!admin) return res.status(404).json({ message: 'Admin account not found' });
      res.json({ resetToken: generateToken(admin._id), verified: true });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(401).json({ message: 'Incorrect answer' });
  }
};

// @desc    Reset admin password after security verification
// @route   POST /api/admin/reset-password
// @access  Public (protected by reset token from verifySecurityAnswer)
const resetPassword = async (req, res) => {
  const { email, newPassword, resetToken } = req.body;

  if (!email || !newPassword || !resetToken) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.email !== email) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.password = newPassword; // pre-save hook hashes it
    await admin.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authAdmin, verifySecurityAnswer, resetPassword };

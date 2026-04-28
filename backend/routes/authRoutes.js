const express = require('express');
const router = express.Router();
const { authAdmin, verifySecurityAnswer, resetPassword } = require('../controllers/authController');

router.post('/login',           authAdmin);
router.post('/verify-security', verifySecurityAnswer);
router.post('/reset-password',  resetPassword);

module.exports = router;

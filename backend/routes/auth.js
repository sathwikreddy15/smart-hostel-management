const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, upload } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/signup', upload.single('photo'), signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router; 
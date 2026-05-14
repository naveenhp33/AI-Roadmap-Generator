const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserTheme } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/theme', protect, updateUserTheme);

module.exports = router;

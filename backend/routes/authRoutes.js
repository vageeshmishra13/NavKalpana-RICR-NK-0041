const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Future endpoints can use 'admin' middleware for role-based access
// router.get('/admin-data', protect, admin, getAdminData);

module.exports = router;


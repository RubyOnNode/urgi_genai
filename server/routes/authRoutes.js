// routes/authRoutes.js  
const express = require('express');
const router = express.Router();
const { registerUser, authUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Registration Route  
router.post('/register' ,registerUser);

// Login Route  
router.post('/login', authUser);

router.post('/fetch', protect, getCurrentUser)

module.exports = router;  
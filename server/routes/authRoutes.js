// routes/authRoutes.js  
const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

// Registration Route  
router.post('/register' ,registerUser);

// Login Route  
router.post('/login', authUser);

module.exports = router;  
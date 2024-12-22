// routes/chatRoutes.js  
const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Send Message  
router.post('/send', protect, sendMessage);

// Get Chat History  
router.get('/history', protect, getChatHistory);

module.exports = router;  
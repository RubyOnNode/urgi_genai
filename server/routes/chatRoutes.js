// routes/chatRoutes.js  
const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChats} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Send Message  
router.post('/send', protect, sendMessage);

// Get Chat History  
router.post('/history', protect, getChatHistory);

// Clear Chats
router.post('/clearChats', protect, clearChats);

module.exports = router;  
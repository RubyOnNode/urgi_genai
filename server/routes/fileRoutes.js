// routes/fileRoutes.js  
const express = require('express');
const router = express.Router();
const { uploadFile, getUserFiles } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// Upload File  
router.post('/upload', protect, uploadFile);

// Get User Files  
router.get('/', protect, getUserFiles);

module.exports = router;  
// routes/fileRoutes.js  
const express = require('express');
const router = express.Router();
const { runMfgBot } = require('../controllers/mfgBotController');
const { protect } = require('../middleware/authMiddleware');

router.post("/run-query", protect, runMfgBot)

module.exports = router;  
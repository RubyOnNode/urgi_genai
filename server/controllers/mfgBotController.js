//controllers/mfgBotController.js
const axios = require('axios');
const Chat = require('../models/Chat');
const { response } = require('express');

// API endpoint
const mfgBotBaseUrl = process.env.MFG_BOT_BASE_URL;
const apiUrl = `${mfgBotBaseUrl}/run-query`;

// Define a POST route to handle queries
const runMfgBot = async (req, res) => {
  const { query } = req.body;

  console.log(req.body)

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Prepare headers and payload
    const headers = {
      "access_token": process.env.MFG_API_KEY,
      "Content-Type": "application/json"
    };

    const data = { query };

    // Make the API call
    const aiResponse = await axios.post(apiUrl, data, { headers });

    // Save chat to DB  
    const chat = await Chat.create({
      user: req.user._id,
      message: query,
      response: aiResponse.data.result,
    });

    res.status(201).json({
      _id: chat._id,
      message: chat.response,
      timestamp: chat.createdAt,
    });

  } catch (error) {
    if (error.response) {
      // Handle errors returned from the external API
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle other errors
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
};

module.exports = {
  runMfgBot
};
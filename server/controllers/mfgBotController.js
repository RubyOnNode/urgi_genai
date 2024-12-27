//controllers/mfgBotController.js
const axios = require('axios');

// API endpoint
const mfgBotBaseUrl = process.env.MFG_BOT_BASE_URL;
const apiUrl = `${mfgBotBaseUrl}/run-query`;

// Define a POST route to handle queries
const runMfgBot = async (req, res) => {
  const { query } = req.body;

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
    const response = await axios.post(apiUrl, data, { headers });

    // Send the API response back to the client
    res.status(200).json(response.data);
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
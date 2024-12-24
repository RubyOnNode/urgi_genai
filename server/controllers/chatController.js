// controllers/chatController.js  
const Chat = require('../models/Chat');
const File = require('../models/File');

// Simulate AI response (replace with actual AI integration)  
const getAIResponse = (query) => {
  // Placeholder for AI logic  
  return `You said: "${query}". This is a simulated AI response.`;
};

// @desc    Send a message and get AI response  
// @route   POST /api/chats/send  
// @access  Private  
const sendMessage = async (req, res) => {
  const { query, fileId } = req.body;
  console.log(req.body)

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    // Optionally, validate fileId belongs to user  
    let file = null;
    if (fileId) {
      file = await File.findById(fileId);
      if (!file) {
        return res.status(400).json({ message: 'Invalid file ID' });
      }
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to use this file' });
      }
    }

    // Get AI response  
    const aiResponse = getAIResponse(query);

    // Save chat to DB  
    const chat = await Chat.create({
      user: req.user._id,
      message: query,
      response: aiResponse,
      fileId: file ? file._id : null,
    });

    res.status(201).json({
      _id: chat._id,
      message: chat.response,
      timestamp: chat.createdAt,
    });
  } catch (error) {
    console.error('Send message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get chat history  
// @route   GET /api/chats/history  
// @access  Private  
const getChatHistory = async (req, res) => {
  console.log("Fetch Chat Request")
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: 1 });

    const formattedChats = chats.map((chat) => ({
      _id: chat._id,
      sender: 'user',
      text: chat.message,
      timestamp: chat.createdAt,
    })).concat(
      chats.map(chat => ({
        _id: chat._id + '_response',
        sender: 'bot',
        text: chat.response,
        timestamp: chat.createdAt,
      }))
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(formattedChats);
  } catch (error) {
    console.error('Get chat history error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};  
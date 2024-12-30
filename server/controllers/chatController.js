// controllers/chatController.js  
const Chat = require('../models/Chat');
const File = require('../models/File');
const {aiBot} = require("../ai_bot/bot");

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
    const aiResponse = await aiBot(query);

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
  console.log(req.body)
  try {
    const chats = await Chat.find({ user: req.user._id, fileId: req.body.fileId }).sort({ createdAt: 1 });

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



// clearChats
const clearChats = async (req, res) => {
  console.log("Clear Chats")
  console.log(req.body)
  const { fileId } = req.body;
  const userId = req.user?._id;

  if (!fileId) {
    return res.status(400).json({ message: 'fileId is required' });
  }

  try {
    // Verify if the user owns the chats associated with the fileId
    const chats = await Chat.find({ fileId });

    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found for the provided fileId' });
    }

    const unauthorizedChats = chats.some((chat) => chat.user.toString() !== userId.toString());

    if (unauthorizedChats) {
      return res.status(403).json({ message: 'You are not authorized to clear these chats' });
    }

    // If authorized, delete the chats
    await Chat.deleteMany({ fileId });
    res.status(200).json({
      message: 'Chats cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing chats:', error);
    res.status(500).json({ message: 'An error occurred while clearing chats', error: error.message });
  }
};


module.exports = {
  sendMessage,
  getChatHistory,
  clearChats
};  
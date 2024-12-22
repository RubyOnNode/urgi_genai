// models/Chat.js  
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    response: {
      type: String,
      required: [true, 'Please add a response'],
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);  
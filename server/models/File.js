// models/File.js  
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: [true, 'Please add a filename'],
    },
    url: {
      type: String,
      required: [true, 'Please add a file URL'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);  
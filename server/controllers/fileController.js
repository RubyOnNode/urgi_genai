// controllers/fileController.js  
const File = require('../models/File');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const path = require('path');

// Initialize Azure Blob Service Client  
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Ensure the container exists  
const createContainerIfNotExists = async () => {
  console.log( `Azure Container name: ${process.env.AZURE_STORAGE_CONTAINER_NAME}`)
  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
    console.log(`Container "${process.env.AZURE_STORAGE_CONTAINER_NAME}" created.`);
  }
};

createContainerIfNotExists().catch((error) => {
  console.error('Error creating container:', error.message);
});


// Configure Multer storage (in-memory)  
const storage = multer.memoryStorage();
// In fileController.js  
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB  
  fileFilter: fileFilter = (req, file, cb) => {
    console.log('File received by Multer:', file);
  
    const filetypes = /jpeg|jpg|png|pdf|docx|txt|text/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following types: JPEG, JPG, PNG, PDF, DOCX, TXT'));
  },
}).single('file');  

// @desc    Upload a file  
// @route   POST /api/files/upload  
// @access  Private  
const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    try {
      const blobName = `${req.user._id}-${Date.now()}-${path.basename(req.file.originalname)}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload to Azure Blob Storage  
      const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.size);
      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

      // Save file metadata to MongoDB  
      const file = await File.create({
        user: req.user._id,
        filename: req.file.originalname,
        url: blockBlobClient.url,
      });

      res.status(201).json({
        id: file._id,
        filename: file.filename,
        url: file.url,
        uploadedAt: file.uploadedAt,
      });
    } catch (error) {
      console.error('Azure Blob upload error:', error.message);
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  });
};

// @desc    Get user uploaded files  
// @route   GET /api/files  
// @access  Private  
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Get files error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
};  
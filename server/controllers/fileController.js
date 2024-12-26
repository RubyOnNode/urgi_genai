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
  console.log(`Azure Container name: ${process.env.AZURE_STORAGE_CONTAINER_NAME}`)
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
        blobName: blobName
      });

      res.status(201).json({_id: file._id, filename: file.filename});

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
  console.log("get User Files")
  console.log(req.body)
  try {
    const files = await File.find({ user: req.user._id },).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Get files error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Delete a user file  
// @route   DELETE /api/files/:id  
// @access  Private  
const deleteFile = async (req, res) => {
  const fileId = req.body.fileId;
  console.log(`Delete file req ${req.body}`)
  console.log(req.body)

  try {
    // Find the file by ID  
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if the file belongs to the authenticated user  
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }

    // Retrieve the blobName from the file document  
    const blobName = file.blobName;

    if (!blobName) {
      return res.status(500).json({ message: 'Blob name not found in file metadata' });
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob from Azure Blob Storage  
    const deleteBlobResponse = await blockBlobClient.deleteIfExists();

    if (deleteBlobResponse.succeeded) {
      console.log(`Blob ${blobName} deleted successfully.`);
    } else {
      console.warn(`Blob ${blobName} was not found or already deleted.`);
    }

    // Remove the file document from MongoDB  
    await file.deleteOne();  

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
  deleteFile, // Export the new deleteFile function  
}; 
// src/components/Dashboard/FileUpload.js  
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../../features/files/filesSlice';
import { toast } from 'react-toastify';

const FileUpload = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.files);
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleUpload = () => {
    if (!file) {
      setLocalError('Please select a file to upload.');
      return;
    }

    // Optionally, add file type or size validations here  

    dispatch(uploadFile(file))
      .unwrap()
      .then(() => {
        setSuccessMessage('File uploaded successfully!');
        setFile(null);
        toast.success('File uploaded successfully!');
      })
      .catch(() => {
        // Error is handled by Redux  
        toast.error(error || 'Failed to upload file.');
      });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Upload a File</Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {localError && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {localError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {successMessage}
        </Alert>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Button variant="contained" component="label">
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Typography variant="body2" sx={{ ml: 2 }}>
          {file ? file.name : 'No file selected'}
        </Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;  
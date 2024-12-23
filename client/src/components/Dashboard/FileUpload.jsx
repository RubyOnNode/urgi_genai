// src/components/Dashboard/FileUpload.js  
import { useState } from 'react';
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
        toast.error('Failed to upload file.');
      });
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {localError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" component="label" sx={{ mr: 2 }}>
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Typography variant="body2">
          {file ? file.name : 'No file selected'}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading || !file}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
    </Box>
  );
  
};

export default FileUpload;  
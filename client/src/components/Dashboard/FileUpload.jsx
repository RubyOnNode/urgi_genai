// components/FileUpload.js  
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadFile } from '../features/files/filesSlice';

const FileUpload = ({ loading, error, setSnackbar }) => {
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadFile(file))
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: 'File uploaded successfully!', severity: 'success' });
        })
        .catch((error) => {
          console.error(error);
          setSnackbar({ open: true, message: error.error || 'File upload failed!', severity: 'error' });
        });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload File
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Uploading...' : 'Select File'}
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default FileUpload;  
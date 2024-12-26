// components/FilesList.js  
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, IconButton, Paper, Typography, CircularProgress, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilesListItem from './FilesListItem';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { deleteFile } from '../features/files/filesSlice';

const FilesList = ({ files, loading, error, selectedFile, onSelectFile, setSnackbar }) => {
  const dispatch = useDispatch();
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenDeleteDialog = (file) => {
    setFileToDelete(file);
  };

  const handleCloseDeleteDialog = () => {
    setFileToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    setDeleting(true);
    try {
      await dispatch(deleteFile(fileToDelete._id)).unwrap();
      setSnackbar({ open: true, message: 'File deleted successfully!', severity: 'success' });
    } catch (err) {
      console.error('Delete failed:', err);
      setSnackbar({ open: true, message: err.message || 'Failed to delete file!', severity: 'error' });
    } finally {
      setDeleting(false);
      setFileToDelete(null);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Files
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Typography variant="body2">No files uploaded yet.</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <FilesListItem
              key={file._id}
              file={file}
              selected={selectedFile && selectedFile._id === file._id}
              onSelect={() => onSelectFile(file)}
              onDelete={() => handleOpenDeleteDialog(file)}
            />
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={Boolean(fileToDelete)}
        filename={fileToDelete?.filename}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      {/* Display error if any */}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
};

export default FilesList;  
// components/DeleteConfirmationDialog.js  
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';

const DeleteConfirmationDialog = ({ open, filename, onClose, onConfirm, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-file-dialog-title"
      aria-describedby="delete-file-dialog-description"
    >
      <DialogTitle id="delete-file-dialog-title">Delete File</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-file-dialog-description">
          Are you sure you want to delete the file "{filename}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;  
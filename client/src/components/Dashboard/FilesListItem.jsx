// components/FilesListItem.js  
import React from 'react';
import { ListItem, ListItemText, IconButton, Typography, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FilesListItem = ({ file, selected, onSelect, onDelete }) => {
  return (
    <ListItem
      button
      selected={selected}
      onClick={onSelect}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the select handler    
            onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={file.filename}
        secondary={`Uploaded at: ${new Date(file.uploadedAt).toLocaleString()}`}
      />
      {selected && (
        <ListItemSecondaryAction>
          <Typography variant="caption" color="primary">
            Selected
          </Typography>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default FilesListItem;  
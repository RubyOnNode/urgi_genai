// components/FilesListItem.js    
import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  ListItemSecondaryAction,
  ListItemButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FilesListItem = ({ file, selected, onSelect, onDelete }) => {
  return (
    <ListItem
      disablePadding
      selected={selected}
    >
      <ListItemButton onClick={onSelect}>
        <ListItemText
          primary={file.filename}
          secondary={`Uploaded at: ${new Date(file.uploadedAt).toLocaleString()}`}
        />
        {selected && (
          <Typography variant="caption" color="primary">
            Selected
          </Typography>
        )}
      </ListItemButton>
      <ListItemSecondaryAction>
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
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default FilesListItem;  
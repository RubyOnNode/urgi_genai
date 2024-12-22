// src/components/Dashboard/Sidebar.js  
import React, { useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../../features/chats/chatsSlice';
import { fetchFiles } from '../../features/files/filesSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 300;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages } = useSelector((state) => state.chats);
  const { files } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleChatClick = (chatId) => {
    // Implement navigation to a specific chat if applicable  
    // For now, it could scroll to the message in ChatBox  
    // Implement as needed  
    console.log('Chat clicked:', chatId);
  };

  const handleFileClick = (fileId) => {
    // Implement file selection logic  
    // For example, dispatch an action to set selectedFileId  
    // Implement as needed  
    console.log('File clicked:', fileId);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant="h6" align="center" sx={{ my: 2 }}>
          Chat History
        </Typography>
        <Divider />
        <List>
          {messages.map((msg) => (
            <ListItem button key={msg.id} onClick={() => handleChatClick(msg.id)}>
              <ListItemText
                primary={msg.sender === 'user' ? 'You' : 'AI'}
                secondary={msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : '')}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="h6" align="center" sx={{ my: 2 }}>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem button key={file.id} onClick={() => handleFileClick(file.id)}>
              <ListItemText primary={file.filename} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;  
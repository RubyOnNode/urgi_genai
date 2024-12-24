// src/components/Dashboard/Sidebar.js  
import { useEffect } from 'react';
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
import FileUpload from './FileUpload';

const drawerWidth = 300;

const Sidebar = () => {
  const dispatch = useDispatch();
  // const { messages } = useSelector((state) => state.chats);
  const { files } = useSelector((state) => state.files);

  console.log("Sidebar Rendered")

  useEffect(() => {
    console.log("Fetching files and chats in side bar")
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Fixed Upload Files Section */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', p: 2 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Upload Files
          </Typography>
            <FileUpload />
            <Divider sx={{ my: 2 }} />
          <Typography variant="h6" align="center" sx={{ mt: 3, mb: 2 }}>
            Files
          </Typography>
          <List>
            {files.map((file) => (
              <ListItem button key={file.id} onClick={() => handleFileClick(file.id)}>
                <ListItemText primary={file.filename} />
              </ListItem>
            ))}
          </List>
        </Box>
  
        {/* Scrollable Chat History */}
        {/* <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
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
        </Box>*/}
      </Box> 
    </Drawer>
  );
  
  
};

export default Sidebar;  
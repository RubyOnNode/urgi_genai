// src/components/Dashboard/ChatBox.js  
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addMessage } from '../../features/chats/chatsSlice';
import UserInfo from './UserInfo';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chats);
  const { files } = useSelector((state) => state.files);

  const [query, setQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState('');
  const [localError, setLocalError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const messagesEndRef = useRef(null);

  console.log("ChatBox rendered")

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    
    if (!query.trim()) {
      setLocalError('Please enter a message.');
      return;
    }

    setLocalError('');

    // Create a new message object for the user's query
    const newMessage = {
      _id: Date.now(), // You can use a unique ID for the message
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    // Optimistically update the UI with the new message
    dispatch(addMessage(newMessage));

    dispatch(sendMessage({ query, fileId: selectedFileId || null }))
      .unwrap()
      .then(() => {
        // Success 
        // dispatch(fetchChats());
      })
      .catch(() => {
        // Error handled by useEffect  
      });

    setQuery('');
  };



  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Information */}
      <UserInfo />

      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          paddingRight: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                color: msg.sender === 'user' ? 'white' : 'black',
                p: 1,
                borderRadius: 2,
                maxWidth: '70%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" align="right" display="block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Error Messages */}
      {localError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}

      {/* Message Input and File Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Attach File Icon */}
        <Box>
          <IconButton
            color="primary"
            onClick={(e) => setAnchorEl(e.currentTarget)} // Open menu on click
          >
            <AttachFileIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)} // Close menu
          >
            {files.length > 0 ? (
              files.map((file) => (
                <MenuItem
                  key={file._id}
                  onClick={() => {
                    setSelectedFileId(file._id);
                    setAnchorEl(null); // Close menu after selecting
                  }}
                >
                  {file.filename}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No files uploaded</MenuItem>
            )}
          </Menu>
        </Box>

        <TextField
          variant="outlined"
          label="Type your message..."
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Box>
  );

}
export default ChatBox;  
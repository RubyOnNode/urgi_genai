// src/components/Dashboard/ChatBox.js  
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, fetchChats, addMessage } from '../../features/chats/chatsSlice';
import { fetchFiles } from '../../features/files/filesSlice';
import UserInfo from './UserInfo';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chats);
  const { files } = useSelector((state) => state.files);

  const [query, setQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState('');
  const [localError, setLocalError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchFiles());
  }, [dispatch]);

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

    if (files.length > 0 && !selectedFileId) {
      setLocalError('Please select a file or choose to send without a file.');
      return;
    }

    setLocalError('');

    // Create a new message object for the user's query
    const newMessage = {
      id: Date.now(), // You can use a unique ID for the message
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
      <UserInfo/>

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

      {/* File Selection */}
      {files.length > 0 ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="file-select-label">Select a File</InputLabel>
          <Select
            labelId="file-select-label"
            value={selectedFileId}
            label="Select a File"
            onChange={(e) => setSelectedFileId(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {files.map((file) => (
              <MenuItem key={file.id} value={file.id}>
                {file.filename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          No files uploaded. Please upload a file to associate with your messages.
        </Alert>
      )}

      {/* Option to send without a file if files are available */}
      {files.length > 0 && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2">Or send without selecting a file.</Typography>
        </Box>
      )}

      {/* Message Input and Send Button */}
      <Box sx={{ display: 'flex' }}>
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
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{ ml: 1 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;  
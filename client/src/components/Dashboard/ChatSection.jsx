// components/ChatSection.js  
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Divider, Box, List, ListItem, CircularProgress, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { addMessage, sendMessage, clearChatsThunk } from '../features/chats/chatsSlice';

const ChatSection = ({ selectedFile, chats, loading, error, messagesEndRef, setSnackbar }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedFile) return;

    const message = {
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      fileId: selectedFile._id,
    };

    // Optimistically update the UI with the new message  
    dispatch(addMessage(message));

    dispatch(sendMessage({ query: newMessage, fileId: selectedFile._id }))
      .unwrap()
      .then(() => {
        setNewMessage('');
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error || 'Failed to send message!', severity: 'error' });
      });
  };

  const handleClearChat = () => {
    if (!selectedFile) return;
    dispatch(clearChatsThunk(selectedFile._id))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Chats cleared successfully!', severity: 'success' });
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error.message || 'Failed to clear chats!', severity: 'error' });
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Paper sx={{ p: 2, height: '75vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat with AI
        </Typography>
        {selectedFile && (
          <IconButton
            color="error"
            onClick={handleClearChat}
            disabled={loading}
            title="Clear Chats"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          paddingRight: 1,
        }}
      >
        {selectedFile ? (
          chats.length === 0 && !loading ? (
            <Typography variant="body2" color="text.secondary">
              Start the conversation by typing a message below.
            </Typography>
          ) : (
            <List>
              {chats.map((msg, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      maxWidth: '80%',
                      backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                      color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                      p: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              {loading && (
                <ListItem>
                  <CircularProgress size={24} />
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          )
        ) : (
          <Typography variant="body2" color="text.secondary">
            Please select a file to start chatting with the AI.
          </Typography>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      {/* Message Input */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Type your message..."
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!selectedFile || loading}
        />
        <IconButton
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleSendMessage}
          disabled={!selectedFile || loading || newMessage.trim() === ''}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatSection;  
// components/Dashboard.js  
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Box,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { logout } from '../features/auth/authSlice'; // Adjust the import path  
import { uploadFile, fetchFiles } from '../features/files/filesSlice'; // Adjust the import path  
import {addMessage, sendMessage, fetchChats, clearChatsThunk } from '../features/chats/chatsSlice'; // Adjust the import path  

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const files = useSelector((state) => state.files.files);
  const filesLoading = useSelector((state) => state.files.loading);
  const filesError = useSelector((state) => state.files.error);
  const chats = useSelector((state) => state.chats.messages);
  const chatsLoading = useSelector((state) => state.chats.loading);
  const chatsError = useSelector((state) => state.chats.error);

  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch files when component mounts  
    dispatch(fetchFiles());
  }, [dispatch]);

  useEffect(() => {
    // Scroll to the latest message when chats update  
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadFile(file))
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: 'File uploaded successfully!', severity: 'success' });
        })
        .catch((error) => {
          console.log(error)
          setSnackbar({ open: true, message: error.error || 'File upload failed!', severity: 'error' });
        });
    }
  };

  const handleClearChat = () => {
    if (!selectedFile) return;
  
    dispatch(clearChatsThunk({ fileId: selectedFile._id }))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Chats cleared successfully!', severity: 'success' });
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error.message || 'Failed to clear chats!', severity: 'error' });
      });
  };
  

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    dispatch(fetchChats({fileId: file._id})); // Clear previous chat messages when selecting a new file  
    setSnackbar({ open: true, message: `Selected file: ${file.filename}`, severity: 'info' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedFile) return;

    console.log(newMessage)

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>AI</Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI Dashboard
          </Typography>
          <Box sx={{ textAlign: 'right', mr: 2 }}>
            <Typography variant="body1">{user.username}</Typography>
            <Typography variant="body2" color="inherit">
              {user.email}
            </Typography>
          </Box>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* File Upload Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload File
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                disabled={filesLoading}
                fullWidth
              >
                {filesLoading ? 'Uploading...' : 'Select File'}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {filesError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {filesError}
                </Typography>
              )}
            </Paper>

            {/* Uploaded Files List */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Files
              </Typography>
              {filesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress />
                </Box>
              ) : files.length === 0 ? (
                <Typography variant="body2">No files uploaded yet.</Typography>
              ) : (
                <List>
                  {files.map((file) => (
                    <ListItem
                      button
                      key={file._id}
                      selected={selectedFile && selectedFile._id === file._id}
                      onClick={() => handleSelectFile(file)}
                    >
                      <ListItemText
                        primary={file.filename}
                        secondary={`Uploaded at: ${new Date(file.uploadedAt).toLocaleString()}`}
                      />
                      {selectedFile && selectedFile._id === file._id && (
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color="primary">
                            Selected
                          </Typography>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Chat Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '75vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chat with AI
              </Typography>
              {selectedFile && (
                <IconButton
                  color="error"
                  onClick={() => dispatch(handleClearChat)}
                  disabled={chatsLoading}
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
                  chats.length === 0 && !chatsLoading ? (
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
                      {chatsLoading && (
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
              {chatsError && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {chatsError}
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
                  disabled={!selectedFile || chatsLoading}
                />
                <IconButton
                  color="primary"
                  sx={{ ml: 1 }}
                  onClick={handleSendMessage}
                  disabled={!selectedFile || chatsLoading || newMessage.trim() === ''}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} AI Chat App
        </Typography>
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;  
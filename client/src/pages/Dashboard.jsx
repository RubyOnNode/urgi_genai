// components/Dashboard.js  
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Box } from '@mui/material';

import Header from '../components/Dashboard/Header';
import FileUpload from '../components/Dashboard/FileUpload';
import FilesList from '../components/Dashboard/FilesList';
import ChatSection from '../components/Dashboard/ChatSection';
import Footer from '../components/Dashboard/Footer';
import SnackbarNotification from '../components/Dashboard/SnackbarNotification';

import { fetchFiles, clearFiles } from '../features/files/filesSlice';
import { fetchChats } from '../features/chats/chatsSlice';

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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch files when component mounts    
    dispatch(fetchFiles());

    // Cleanup: Clear files from store when component unmounts    
    return () => {
      dispatch(clearFiles());
    };
  }, [dispatch]);

  useEffect(() => {
    // Scroll to the latest message when chats update    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    dispatch(fetchChats(file._id));
    setSnackbar({ open: true, message: `Selected file: ${file.filename}`, severity: 'info' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header user={user} />

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* File Upload and List */}
          <Grid item xs={12} md={4}>
            <FileUpload
              loading={filesLoading}
              error={filesError}
              setSnackbar={setSnackbar}
            />
            <FilesList
              files={files}
              loading={filesLoading}
              error={filesError}
              selectedFile={selectedFile}
              onSelectFile={handleSelectFile}
              setSnackbar={setSnackbar}
            />
          </Grid>

          {/* Chat Section */}
          <Grid item xs={12} md={8}>
            <ChatSection
              selectedFile={selectedFile}
              chats={chats}
              loading={chatsLoading}
              error={chatsError}
              messagesEndRef={messagesEndRef}
              setSnackbar={setSnackbar}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Footer />

      {/* Snackbar for Notifications */}
      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default Dashboard;  
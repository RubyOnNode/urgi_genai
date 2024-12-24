// src/pages/DashboardPage.js  
import { Box } from '@mui/material';
import Sidebar from '../components/Dashboard/Sidebar';
import ChatBox from '../components/Dashboard/ChatBox';
import { fetchChats } from '../features/chats/chatsSlice'
import { fetchFiles } from '../features/files/filesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const DashboardPage = () => {

  console.log("Dashboard Rendered")

  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chats);
  const { files } = useSelector((state) => state.files);
  
  useEffect(() => {
    console.log("Fetching files and chats in side bar")
    dispatch(fetchChats());
    dispatch(fetchFiles());
  }, [dispatch]);

  console.log("Messages in Dashborad")
  console.table(messages)

  console.log("Files in Dashboard")
  console.table(files)

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{flexGrow: 1,bgcolor: 'background.default',display: 'flex',flexDirection: 'column'}}>
        <ChatBox />
      </Box>
    </Box>
  );
};

export default DashboardPage;
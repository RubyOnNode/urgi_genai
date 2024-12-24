// src/pages/DashboardPage.js  
import { Box } from '@mui/material';
import Sidebar from '../components/Dashboard/Sidebar';
import ChatBox from '../components/Dashboard/ChatBox';

const DashboardPage = () => {
  console.log("Dashboard Rendered")
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
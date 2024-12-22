// src/pages/Dashboard.js  
import React from 'react';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        This is the dashboard. The actual interface will be developed in a subsequent phase.
      </Typography>
    </Container>
  );
};

export default Dashboard;  
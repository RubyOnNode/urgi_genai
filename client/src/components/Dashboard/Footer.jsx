// components/Footer.js  
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} ReD.
      </Typography>
    </Box>
  );
};

export default Footer;  
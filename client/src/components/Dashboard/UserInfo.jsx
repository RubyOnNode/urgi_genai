// src/components/Dashboard/UserInfo.js  
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, shallowEqual } from 'react-redux';

const UserInfo = () => {
  const user = useSelector((state) => state.auth.user, shallowEqual);
  console.log("UserInfo Rendered");

  if (!user) {
    return <Typography variant="h6">Guest User</Typography>;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">Hello, {user.username}</Typography>
      <Typography variant="body2">{user.email}</Typography>
    </Box>
  );
};

export default React.memo(UserInfo);  
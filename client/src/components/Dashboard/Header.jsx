// components/Header.js  
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../features/auth/authSlice';
import { green } from '@mui/material/colors';

const Header = ({ user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar sx={{ mr: 2 }}>AI</Avatar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Urji
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
  );
};

export default Header;
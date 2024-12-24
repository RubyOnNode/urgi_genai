// src/components/Dashboard/UserInfo.js  

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Edit as EditIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Selector moved outside to prevent re-creation on every render  
const selectUser = (state) => state.auth.user;

const UserInfo = React.memo(() => {
  const user = useSelector(selectUser);
  const theme = useTheme();

  console.log('UserInfo Rendered');

  // Function to generate initials from username  
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n[0].toUpperCase());
    return initials.slice(0, 2).join('');
  };

  // Placeholder avatar image if user.profilePicture is not available  
  const avatarSrc = user?.profilePicture || '';

  return (
    <Card
      sx={{
        mb: 4,
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        bgcolor: theme.palette.background.paper,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', padding: 3 }}>
        {/* Avatar Section */}
        <Box sx={{ position: 'relative', mr: 3 }}>
          <Avatar
            src={avatarSrc}
            alt={user?.username || 'Guest'}
            sx={{
              width: 80,
              height: 80,
              bgcolor: deepPurple[500],
              fontSize: '2rem',
            }}
          >
            {!avatarSrc && getInitials(user?.username)}
          </Avatar>
          {/* Status Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              bgcolor: user?.isOnline ? 'success.main' : 'grey.500',
              borderRadius: '50%',
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        </Box>

        {/* User Information Section */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ mr: 1 }}>
              {user ? `Hello, ${user.username}` : 'Welcome, Guest'}
            </Typography>
            {user && (
              <Tooltip title="Edit Profile">
                <IconButton
                  aria-label="edit profile"
                  size="small"
                  sx={{ color: theme.palette.primary.main }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            {user ? user.email : 'You are currently browsing as a guest.'}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <Tooltip title="Logout">
              <IconButton
                aria-label="logout"
                size="large"
                color="error"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Login">
              <IconButton
                aria-label="login"
                size="large"
                color="primary"
              >
                {/* Replace with a Login icon as needed */}
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>

      {/* Decorative Divider */}
      <Divider variant="middle" />

      {/* Optional: Additional Information */}
      {user && (
        <Box sx={{ padding: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="body2" color="text.secondary">
            Joined on: {new Date(user.joinedDate).toLocaleDateString()}
          </Typography>
        </Box>
      )}
    </Card>
  );
});

export default UserInfo;  
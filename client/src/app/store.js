// src/app/store.js  
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from '../features/auth/authSlice';
import chatsReducer from '../features/chats/chatsSlice';
import filesReducer from '../features/files/filesSlice';
import axiosInstance from '../api/axiosInstance';

// Configure the Redux store  
const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    files: filesReducer,
    // Add other reducers here  
  },
});

// Set up Axios interceptors AFTER store is configured to avoid circular dependencies  
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, possibly invalid token  
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default store;  
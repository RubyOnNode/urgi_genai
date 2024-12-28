// src/features/auth/authAPI.js  
import axiosInstance from '../../api/axiosInstance';

const register = (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

const login = (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

const getCurrentUser = () => {
  return axiosInstance.post('/auth/fetch'); // Adjust the endpoint based on your API  
};

export default {
  register,
  login,
  getCurrentUser,
  // Future auth-related API calls    
};  
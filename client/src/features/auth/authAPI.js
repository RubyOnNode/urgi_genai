// src/features/auth/authAPI.js  
import axiosInstance from '../../api/axiosInstance';

const register = (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

const login = (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

export default {
  register,
  login,
  // Future auth-related API calls  
};  
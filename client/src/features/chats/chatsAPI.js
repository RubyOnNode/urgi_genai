// src/features/chats/chatsAPI.js  
import axiosInstance from '../../api/axiosInstance';

const sendMessage = ({ query, fileId }) => {
  return axiosInstance.post('/chats/send', { query, fileId });
};

const fetchChats = () => {
  return axiosInstance.get('/chats/history');
};

export default {
  sendMessage,
  fetchChats,
};  
// src/features/chats/chatsAPI.js  
import axiosInstance from '../../api/axiosInstance';

const sendMessage = ({ query, fileId }) => {
  return axiosInstance.post('/chats/send', { query, fileId });
};

const fetchChats = ({ fileId }) => {
  console.log(fileId)
  return axiosInstance.post('/chats/history', { fileId });
};

export default {
  sendMessage,
  fetchChats,
};  
// src/features/chats/chatsAPI.js  
import axiosInstance from '../../api/axiosInstance';

const sendMessage = ({ query, fileId }) => {
  return axiosInstance.post('/chats/send', { query, fileId });
};

const fetchChats = (fileId) => {
  return axiosInstance.post('/chats/history', { fileId });
};

const sendMessageMfgBot = ({query}) =>{
  return axiosInstance.post("/mfg_bot/run-query", {query})
}


const clearChats = (fileId) => {
  return axiosInstance.post('/chats/clearChats', { fileId });
};


export default {
  sendMessage,
  fetchChats,
  clearChats,
  sendMessageMfgBot
};  
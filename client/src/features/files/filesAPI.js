// src/features/files/filesAPI.js  
import axiosInstance from '../../api/axiosInstance';

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const fetchFiles = () => {
  return axiosInstance.get('/files');
};

const deleteFile = (fileId) => {
  return axiosInstance.post("/files/delete", {fileId})
}

export default {
  uploadFile,
  fetchFiles,
  deleteFile
};  
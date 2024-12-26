// src/features/files/filesSlice.js    
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import filesAPI from './filesAPI';

// Thunk to upload a file    
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const response = await filesAPI.uploadFile(file);
      console.log(response.data);
      return response.data; // Expected: { _id, filename, url, uploadedAt }    
    } catch (err) {
      // Check if the error response exists  
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

// Thunk to fetch user files    
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await filesAPI.fetchFiles();
      return response.data; // Expected: Array of files    
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

// Thunk to delete a file  
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      console.log(fileId)
      await filesAPI.deleteFile(fileId);
      return fileId; // Return the ID to remove it from the state  
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [], // { _id, filename, url, uploadedAt }    
    loading: false,
    error: null,
  },
  reducers: {
    clearFiles(state) {
      state.files = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle deleteFile thunk  
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the file with the matching ID from the files array  
        state.files = state.files.filter(file => file._id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to delete file';
      })
      // Handle uploadFile thunk  
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to upload file';
      })
      // Handle fetchFiles thunk  
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        console.log(state.files);
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch files';
      });
  },
});

export const { clearFiles } = filesSlice.actions;
export default filesSlice.reducer;  
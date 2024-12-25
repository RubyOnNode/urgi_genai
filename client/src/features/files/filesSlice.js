// src/features/files/filesSlice.js  
import { createSlice, createAsyncThunk, combineSlices } from '@reduxjs/toolkit';
import filesAPI from './filesAPI';

// Thunk to upload a file  
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const response = await filesAPI.uploadFile(file);
      console.log(response.data)
      return response.data; // Expected: { _id, filename, url, uploadedAt }  
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      state.loading=false
    },
  },
  extraReducers: (builder) => {
    builder
      // uploadFile  
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
      // fetchFiles  
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload
        console.log(state.files)
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch files';
      });
  },
});

export const { clearFiles } = filesSlice.actions;
export default filesSlice.reducer;    
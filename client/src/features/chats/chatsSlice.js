// src/features/chats/chatsSlice.js  
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatsAPI from './chatsAPI';

// Thunk to send a message  
export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ query, fileId }, { rejectWithValue }) => {
    try {
      const response = await chatsAPI.sendMessage({ query, fileId });
      return response.data; // Expected: { message: 'AI response' }  
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to fetch chat history  
export const fetchChats = createAsyncThunk(
  'chats/fetchChats',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await chatsAPI.fetchChats(fileId);
      return response.data; // Expected: Array of messages  
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to clear chats
export const clearChatsThunk = createAsyncThunk(
  'chats/clearChats',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await chatsAPI.clearChats(fileId); // Assuming chatsAPI.clearChats sends the delete request
      console.log("in clear thunk")
      console.log(response.data)
      return response.data; // Expected: { message: 'Chats cleared successfully' }
    } catch (err) {
      console.log("in clear eror")
      console.log(err.response.data)
      return rejectWithValue(err.response.data);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    messages: [], // { _id, sender: 'user' | 'bot', text, timestamp }  
    loading: false,
    error: null,
  },
  reducers: {
    clearChats(state) {
      state.messages = [];
      state.error = null;
      state.loading= false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // sendMessage  
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          sender: 'bot',
          text: action.payload.message,
          timestamp: action.payload.timestamp,
          fileId: action.payload.fileId
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to send message';
      })
      // fetchChats  
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.map((msg) => ({
          _id: msg._id,
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp,
        }));
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch chats';
      })
      // clearChats
      .addCase(clearChatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearChatsThunk.fulfilled, (state) => {
        state.loading = false;
        state.messages = []; // Clear all messages in state
      })
      .addCase(clearChatsThunk.rejected, (state, action) => {
        state.loading = false;
        console.log("Tried tgus")
        state.error = action.payload.message || 'Failed to clear chats';
      });
  },
});

export const { clearChats, addMessage} = chatsSlice.actions;
export default chatsSlice.reducer;  
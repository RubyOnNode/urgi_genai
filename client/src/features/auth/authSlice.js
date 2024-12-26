import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from './authAPI';

// Initialize token and user from localStorage  
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token ? token : null,
  loading: false,
  error: null,
};

// Thunks    
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('No token available');

    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log(`Response from Database: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice    
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser(state, action) {
      state.user = {
        _id: action.payload._id,
        username: action.payload.username,
        email: action.payload.email,
      };
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases    
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
        };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Registration failed';
      })

      // Login Cases    
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
        };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Login failed';
      })

      // Fetch Current User Cases    
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch user';
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;  
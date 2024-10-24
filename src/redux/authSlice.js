import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {SEND_OTP_API,LOGIN_API,SIGNUP_API,PROFILE_API} from './api';
// API Endpoints


// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Helper: Store token in Keychain
const storeToken = async (token) => {
  if (!token) {
    console.error('Token is null or undefined. Skipping Keychain storage.');
    return;
  }

  try {
    await Keychain.setGenericPassword('auth', token, {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
    console.log('Token stored successfully in Keychain.');
  } catch (e) {
    console.error('Failed to store token in Keychain:', e);
  }
};

// Helper: Retrieve token from Keychain
const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (e) {
    console.error('Failed to retrieve token from Keychain:', e);
    return null;
  }
};

// Helper: Remove token from Keychain
const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Token removed from Keychain.');
  } catch (e) {
    console.error('Failed to remove token from Keychain:', e);
  }
};

// AsyncThunk: Send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ email, phoneNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post(SEND_OTP_API, { email, phoneNumber });
      console.log('OTP sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP.'
      );
    }
  }
);

// AsyncThunk: Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ formData, otp }, { rejectWithValue }) => {
    try {
      const registrationData = { ...formData, otp };
      const response = await axios.post(SIGNUP_API, registrationData);

      const { token, user } = response.data;
      await storeToken(token);  // Store token securely
      return user;
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed.'
      );
    }
  }
);

// AsyncThunk: Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_API, { email, password });
      const { token, user } = response.data;

      if (!token) {
        console.error('Received null/undefined token.');
        throw new Error('Login failed. Please try again.');
      }

      await storeToken(token); // Store token securely
      return user;
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed.');
    }
  }
);

// AsyncThunk: Fetch Logged-in User Profile
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken(); // Retrieve token from Keychain

      if (!token) throw new Error('User not logged in.');

      const response = await axios.get(PROFILE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('User profile fetched:', response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Fetch User Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile.'
      );
    }
  }
);

// AsyncThunk: Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await removeToken(); // Clear token from Keychain
  return null;
});

// Optional: Function to handle token refresh (to be implemented later)
const refreshToken = async () => {
  console.warn('Token refresh functionality is not implemented yet.');
};

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        console.log('sendOtp.pending'); // Add logging
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        console.log('sendOtp.fulfilled'); // Add logging
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        console.log('sendOtp.rejected', action.payload); // Add logging
        state.loading = false;
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Profile
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null; // Clear any previous errors
      });
  },
});

// Export Actions and Reducer
export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

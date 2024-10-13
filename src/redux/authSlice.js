import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { base_api, login_api, register_api, send_otp } from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Helper functions to store, retrieve, and remove user from AsyncStorage
const storeUserData = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to AsyncStorage', e);
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Failed to fetch user from AsyncStorage', e);
    return null;
  }
};

const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.error('Failed to remove user from AsyncStorage', e);
  }
};

// Fetch user from AsyncStorage or Redux state
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (user) {
      return user;  // If user exists in state, return it
    }
    const storedUser = await getUserData();
    if (storedUser) {
      return storedUser;  // If user exists in AsyncStorage, return it
    }
    // return rejectWithValue('No user found');
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ formData, otp }, { rejectWithValue }) => {
    const { userName, email, phoneNo, password } = formData;
    try {
      const response = await axios.post(
        `${register_api}`,
        {
          userName,
          email,
          password,
          phoneNo,
          otp,
        },
      );
      await storeUserData(response.data.user);  // Store user in AsyncStorage
      return response.data.user;
    } catch (err) {
      console.log(err.response.data.message)
      return rejectWithValue(err.response.data.message);
    }
  },
);

// Send OTP action
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${send_otp}`,
        { email },
      );
      return response.data;  // No need to store this in state, only for UI feedback
    } catch (err) {
      // console.log(err.response.data.message)
      return rejectWithValue(err.response.data.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${login_api}`, { email, password });
      await storeUserData(response.data.user);  // Store user in AsyncStorage
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      removeUserData();  // Clear user from AsyncStorage
    },
    clearError: (state) => {
      state.error = null; // Reset error
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
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

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        // Handle any response needed in UI
      })
      .addCase(sendOtp.rejected, (state, action) => {
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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
